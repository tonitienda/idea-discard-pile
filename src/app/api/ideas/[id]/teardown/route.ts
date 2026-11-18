import { NextRequest, NextResponse } from "next/server";
import { getUser } from "../../../../../backend/users";
import { getIdeaById, saveTeardown } from "../../../../../backend/db";
import { generateTeardown } from "../../../../../backend/ai/teardown";

// Generation can take a while on larger models.
export const maxDuration = 60;

// Generates the teardown for an idea, once. Only the owner can trigger it,
// so the cost is bounded by the per-user idea limit.
export async function POST(req: NextRequest, { params }) {
  const user = await getUser(req);
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const idea = await getIdeaById(params.id);
  if (!idea || idea.deletedAt || idea.owner.id !== user.id) {
    return NextResponse.json({ message: "Idea not found" }, { status: 404 });
  }

  if (idea.isFlagged) {
    return NextResponse.json(
      { message: "Flagged ideas don't get a teardown" },
      { status: 409 }
    );
  }

  if (idea.teardown) {
    return NextResponse.json(idea.teardown, { status: 200 });
  }

  const result = await generateTeardown(
    { description: idea.description, discardedReason: idea.discardedReason },
    user.id
  );

  if (!result) {
    return NextResponse.json(
      { message: "We couldn't write the teardown right now. Please try again." },
      { status: 503 }
    );
  }

  await saveTeardown(idea.id, result.teardown, result.model);

  // Re-read in case a parallel request saved first.
  const saved = await getIdeaById(idea.id);
  return NextResponse.json(saved?.teardown ?? result.teardown, { status: 201 });
}
