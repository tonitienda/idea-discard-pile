import { NextRequest, NextResponse } from "next/server";
import {
  getIdeaById,
  notifyBuildingStarted,
  startBuilding,
  stopBuilding,
} from "../../../../../backend/db";
import { getUser } from "../../../../../backend/users";
import { BUILDING_URL_MAX_LENGTH } from "../../../model";

const notFound = () =>
  NextResponse.json({ message: "Idea not found" }, { status: 404 });

// Only the owner can say they are building their idea.
async function ownIdea(req: NextRequest, id: string) {
  const user = await getUser(req);
  if (!user) {
    return {
      error: NextResponse.json({ message: "Unauthorized" }, { status: 401 }),
    };
  }
  const idea = await getIdeaById(id);
  if (!idea || idea.deletedAt || idea.owner.id !== user.id) {
    return { error: notFound() };
  }
  return { idea };
}

// Empty means no link. Anything else must be an http(s) URL.
function parseUrl(value: unknown): { url: string | null } | { error: string } {
  if (value === undefined || value === null) {
    return { url: null };
  }
  if (typeof value !== "string") {
    return { error: "The link must be text" };
  }
  const trimmed = value.trim();
  if (!trimmed) {
    return { url: null };
  }
  if (trimmed.length > BUILDING_URL_MAX_LENGTH) {
    return {
      error: `The link must be at most ${BUILDING_URL_MAX_LENGTH} characters`,
    };
  }
  // Accept "github.com/me/repo" as well as full URLs.
  const withScheme = /^[a-z][a-z0-9+.-]*:/i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;
  try {
    const parsed = new URL(withScheme);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
      return { error: "The link must start with http:// or https://" };
    }
    if (!parsed.hostname.includes(".")) {
      return { error: "That doesn't look like a web address" };
    }
    return { url: parsed.toString() };
  } catch {
    return { error: "That doesn't look like a web address" };
  }
}

// Start building, or change the link. Body: { url?: string }.
export async function PUT(req: NextRequest, { params }) {
  const { idea, error } = await ownIdea(req, params.id);
  if (error) {
    return error;
  }
  if (idea.isFlagged) {
    return NextResponse.json(
      { message: "Flagged ideas can't be marked as being built" },
      { status: 400 }
    );
  }

  let body: { url?: unknown } = {};
  try {
    body = await req.json();
  } catch {
    // No body: start building without a link.
  }

  const parsed = parseUrl(body.url);
  if ("error" in parsed) {
    return NextResponse.json({ message: parsed.error }, { status: 400 });
  }

  const { building, started } = await startBuilding(idea.id, parsed.url);
  if (started) {
    await notifyBuildingStarted(idea.owner.id, idea.id);
  }

  return NextResponse.json(building, { status: 200 });
}

export async function DELETE(req: NextRequest, { params }) {
  const { idea, error } = await ownIdea(req, params.id);
  if (error) {
    return error;
  }

  await stopBuilding(idea.id);

  return new NextResponse(null, { status: 204 });
}
