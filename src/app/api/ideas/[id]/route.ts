import { NextRequest, NextResponse } from "next/server";
import { getIdeaById, softDeleteIdea, updateIdea } from "../../../../backend/db";
import { getUser } from "../../../../backend/users";
import {
  IDEA_DESCRIPTION_MAX_LENGTH,
  IDEA_DESCRIPTION_MIN_LENGTH,
} from "../../../invariants";

const notFound = () =>
  NextResponse.json({ message: "Idea not found" }, { status: 404 });

export async function GET(req: NextRequest, { params }) {
  const idea = await getIdeaById(params.id);
  if (!idea || idea.deletedAt) {
    return notFound();
  }

  // Flagged ideas are only visible to their owner
  if (idea.isFlagged) {
    const user = await getUser(req);
    if (!user || user.id !== idea.owner.id) {
      return notFound();
    }
  }

  return NextResponse.json(idea, { status: 200 });
}

export async function PUT(req: NextRequest, { params }) {
  const user = await getUser(req);
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const idea = await getIdeaById(params.id);
  if (!idea || idea.deletedAt || idea.owner.id !== user.id) {
    return notFound();
  }

  let body: { title?: unknown; description?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
  }

  const title =
    typeof body.title === "string" ? body.title.trim() : idea.title;
  const description =
    typeof body.description === "string"
      ? body.description.trim()
      : idea.description;

  if (!title || title.length > 255) {
    return NextResponse.json(
      { message: "Title must be between 1 and 255 characters" },
      { status: 400 }
    );
  }

  if (
    description.length < IDEA_DESCRIPTION_MIN_LENGTH ||
    description.length > IDEA_DESCRIPTION_MAX_LENGTH
  ) {
    return NextResponse.json(
      {
        message: `Description must be between ${IDEA_DESCRIPTION_MIN_LENGTH} and ${IDEA_DESCRIPTION_MAX_LENGTH} characters`,
      },
      { status: 400 }
    );
  }

  await updateIdea(idea.id, { title, description });

  return NextResponse.json({ id: idea.id }, { status: 200 });
}

export async function DELETE(req: NextRequest, { params }) {
  const user = await getUser(req);
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const idea = await getIdeaById(params.id);
  if (!idea || idea.deletedAt || idea.owner.id !== user.id) {
    return notFound();
  }

  await softDeleteIdea(idea.id);

  return NextResponse.json({ id: idea.id }, { status: 200 });
}
