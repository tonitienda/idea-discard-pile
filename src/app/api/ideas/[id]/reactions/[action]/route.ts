import { NextRequest, NextResponse } from "next/server";
import { getUser } from "../../../../users";
import {
  createIdeaReaction,
  deleteIdeaReaction,
  getIdeaById,
} from "../../../../../../backend/db";

export const POST = async (req: NextRequest, { params }) => {
  console.log("CREATING IDEA REACTION: ", params);

  const user = await getUser(req);
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  console.log("Params: ", params);

  const { id: ideaId, action } = params;

  const idea = await getIdeaById(ideaId);
  if (!idea) {
    return NextResponse.json({ message: "Idea not found" }, { status: 404 });
  }

  await createIdeaReaction(ideaId, user.id, action);

  return NextResponse.json({}, { status: 201 });
};

export const DELETE = async (req: NextRequest, { params }) => {
  console.log("DELETING IDEA REACTION: ", params);
  const user = await getUser(req);
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  console.log("USER: ", user);

  const { id: ideaId, action } = params;

  const idea = await getIdeaById(ideaId);
  if (!idea) {
    return NextResponse.json({ message: "Idea not found" }, { status: 404 });
  }

  await deleteIdeaReaction(ideaId, user.id, action);

  return NextResponse.json({}, { status: 201 });
};
