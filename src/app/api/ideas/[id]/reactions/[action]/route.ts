import { NextRequest, NextResponse } from "next/server";
import { getUser } from "../../../../../../backend/users";
import {
  createIdeaReaction,
  deleteIdeaReaction,
  getIdeaById,
  notifyHelpOffered,
} from "../../../../../../backend/db";
import { INTERACTION_SUPPORT, REACTIONS } from "../../../../model";

const handle =
  (apply: typeof createIdeaReaction) =>
  async (req: NextRequest, { params }) => {
    const user = await getUser(req);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id: ideaId, action } = params;

    if (!REACTIONS.includes(action)) {
      return NextResponse.json({ message: "Unknown reaction" }, { status: 400 });
    }

    const idea = await getIdeaById(ideaId);
    if (!idea || idea.deletedAt || idea.isFlagged) {
      return NextResponse.json({ message: "Idea not found" }, { status: 404 });
    }

    await apply(ideaId, user.id, action);

    if (apply === createIdeaReaction && action === INTERACTION_SUPPORT) {
      await notifyHelpOffered(idea.owner.id, user.id, ideaId);
    }

    return new NextResponse(null, { status: 204 });
  };

export const POST = handle(createIdeaReaction);
export const DELETE = handle(deleteIdeaReaction);
