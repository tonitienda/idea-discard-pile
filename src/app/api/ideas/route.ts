import { v4 as uuid } from "uuid";
import {
  Idea,
  IdeaModeration,
  INTERACTION_FUNNY,
  INTERACTION_LOVE,
  INTERACTION_NOT_USEFUL,
  INTERACTION_SUPPORT,
} from "../model";
import { NextRequest, NextResponse } from "next/server";
import { getUser } from "../../../backend/users";
import {
  countIdeasByUserIdSince,
  createIdea,
  getIdeasByUserId,
} from "../../../backend/db";
import { analyzeIdea } from "../../../backend/ai/idea-analysis";
import { toSlug } from "../../../backend/ideas";
import {
  DISCARDED_REASON_MAX_LENGTH,
  IDEA_DESCRIPTION_MAX_LENGTH,
  IDEA_DESCRIPTION_MIN_LENGTH,
  MAX_IDEAS_PER_HOUR_FREE_USER,
} from "../../invariants";
import { sub } from "date-fns";

export async function GET(req: NextRequest) {
  const user = await getUser(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const items: Idea[] = await getIdeasByUserId(user.id);
  return NextResponse.json({ items }, { status: 200 });
}

export async function POST(req: NextRequest) {
  const user = await getUser(req);
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const recentCount = await countIdeasByUserIdSince(
    user.id,
    sub(new Date(), { hours: 1 })
  );

  if (recentCount >= MAX_IDEAS_PER_HOUR_FREE_USER) {
    return NextResponse.json(
      {
        message: `You can share up to ${MAX_IDEAS_PER_HOUR_FREE_USER} ideas per hour. Please try again later.`,
      },
      { status: 429 }
    );
  }

  let data: { description?: unknown; discardedReason?: unknown };
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
  }

  const description =
    typeof data.description === "string" ? data.description.trim() : "";
  const discardedReason =
    typeof data.discardedReason === "string"
      ? data.discardedReason.trim()
      : "";

  if (discardedReason.length > DISCARDED_REASON_MAX_LENGTH) {
    return NextResponse.json(
      {
        message: `The reason you dropped it must be under ${DISCARDED_REASON_MAX_LENGTH} characters`,
      },
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

  // Ideas are published only after moderation, so a failed analysis
  // rejects the submission instead of publishing unchecked content.
  const analysis = await analyzeIdea(description, user.id);
  if (!analysis) {
    return NextResponse.json(
      {
        message:
          "We couldn't process your idea right now. Please try again in a minute.",
      },
      { status: 503 }
    );
  }

  const id = uuid();

  const idea: Idea = {
    id,
    slug: toSlug(analysis.title, id),
    title: analysis.title,
    description,
    discardedReason: discardedReason || undefined,
    tags: analysis.tags,
    owner: user,
    isFlagged:
      analysis.spamProbability > 0.5 || analysis.offensiveProbability > 0.5,
    reactions: {
      [INTERACTION_LOVE]: 0,
      [INTERACTION_FUNNY]: 0,
      [INTERACTION_NOT_USEFUL]: 0,
      [INTERACTION_SUPPORT]: 0,
    },
    myReactions: {
      [INTERACTION_LOVE]: false,
      [INTERACTION_FUNNY]: false,
      [INTERACTION_NOT_USEFUL]: false,
      [INTERACTION_SUPPORT]: false,
    },
  };

  const ideaModeration: IdeaModeration = { ideaId: id, ...analysis };

  await createIdea(idea, ideaModeration);

  return NextResponse.json({ id }, { status: 201 });
}
