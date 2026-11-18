import { NextRequest, NextResponse } from "next/server";
import { v4 as uuid } from "uuid";
import { sub } from "date-fns";
import { getUser } from "../../../../../backend/users";
import {
  countCommentsByUserIdSince,
  createComment,
  getCommentById,
  getComments,
  getIdeaById,
} from "../../../../../backend/db";
import { isCommentFlagged } from "../../../../../backend/ai/comment-moderation";
import { COMMENT_MAX_LENGTH, MAX_COMMENTS_PER_HOUR } from "../../../../invariants";

const findPublicIdea = async (id: string) => {
  const idea = await getIdeaById(id);
  return idea && !idea.deletedAt && !idea.isFlagged ? idea : null;
};

export async function GET(_req: NextRequest, { params }) {
  const idea = await findPublicIdea(params.id);
  if (!idea) {
    return NextResponse.json({ message: "Idea not found" }, { status: 404 });
  }
  return NextResponse.json({ items: await getComments(idea.id) });
}

export async function POST(req: NextRequest, { params }) {
  const user = await getUser(req);
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const idea = await findPublicIdea(params.id);
  if (!idea) {
    return NextResponse.json({ message: "Idea not found" }, { status: 404 });
  }

  let data: { body?: unknown };
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
  }

  const body = typeof data.body === "string" ? data.body.trim() : "";
  if (!body) {
    return NextResponse.json({ message: "Write a comment first" }, { status: 400 });
  }
  if (body.length > COMMENT_MAX_LENGTH) {
    return NextResponse.json(
      { message: `Comments must be under ${COMMENT_MAX_LENGTH} characters` },
      { status: 400 }
    );
  }

  const recent = await countCommentsByUserIdSince(
    user.id,
    sub(new Date(), { hours: 1 })
  );
  if (recent >= MAX_COMMENTS_PER_HOUR) {
    return NextResponse.json(
      {
        message: `You can post up to ${MAX_COMMENTS_PER_HOUR} comments per hour. Please try again later.`,
      },
      { status: 429 }
    );
  }

  let flagged: boolean;
  try {
    flagged = await isCommentFlagged(body);
  } catch (e) {
    console.error("Comment moderation failed", e);
    return NextResponse.json(
      { message: "We couldn't check your comment right now. Please try again." },
      { status: 503 }
    );
  }
  if (flagged) {
    return NextResponse.json(
      { message: "This comment breaks our community guidelines." },
      { status: 422 }
    );
  }

  const id = uuid();
  await createComment({ id, ideaId: idea.id, userId: user.id, body }, idea.owner.id);

  return NextResponse.json(await getCommentById(id), { status: 201 });
}
