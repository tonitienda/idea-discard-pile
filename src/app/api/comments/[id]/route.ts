import { NextRequest, NextResponse } from "next/server";
import { getUser } from "../../../../backend/users";
import {
  getCommentById,
  getIdeaById,
  softDeleteComment,
} from "../../../../backend/db";

// The author, or the owner of the idea, can remove a comment.
export async function DELETE(req: NextRequest, { params }) {
  const user = await getUser(req);
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const comment = await getCommentById(params.id);
  if (!comment || comment.deletedAt) {
    return NextResponse.json({ message: "Comment not found" }, { status: 404 });
  }

  const idea = await getIdeaById(comment.ideaId);
  if (comment.author.id !== user.id && idea?.owner.id !== user.id) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  await softDeleteComment(comment.id);
  return new NextResponse(null, { status: 204 });
}
