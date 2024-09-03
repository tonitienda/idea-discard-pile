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
  createIdea,
  getIdeas,
  getIdeasByUserId,
  getIdeasByUserIdSince,
} from "../../../backend/db";
import { analyzeIdea } from "../../../backend/ai/idea-analysis";
import {
  IDEA_DESCRIPTION_MAX_LENGTH,
  IDEA_DESCRIPTION_MIN_LENGTH,
  MAX_IDEAS_PER_HOUR_FREE_USER,
} from "../../invariants";
import { sub } from "date-fns";

const EmptyIdea: Idea = {
  id: "",
  title: "",
  description: "",
  discardedReason: "",
  tags: [],
  createdAt: "",
  updatedAt: "",
  owner: null,
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
  isExample: false,
};

export async function GET(req: NextRequest) {
  try {
    console.error("GET2", req.url);
    const user = await getUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const items: Idea[] = await getIdeasByUserId(user.id);

    console.log("Total ideas", items.length);
    return NextResponse.json({ items }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "An error occurred while fetching ideas" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const user = await getUser(req);
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const lastCreatedIdeas = await getIdeasByUserIdSince(
    user.id,
    sub(new Date(), { hours: 1 })
  );

  if (lastCreatedIdeas.length >= MAX_IDEAS_PER_HOUR_FREE_USER) {
    return NextResponse.json(
      {
        message: `Free users can only create up to ${MAX_IDEAS_PER_HOUR_FREE_USER} ideas per hour. Become a <a href="/pricing">premium user</a> if you want to unlock more fatures.`,
      },
      { status: 429 }
    );
  }
  const data = await req.json();

  const { description } = data;

  console.log("Description:", description);

  if (
    !description ||
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

  let ideaCompletion = await analyzeIdea(description, user.id);

  if (!ideaCompletion) {
    ideaCompletion = {
      ideaProbability: 0,
      spamProbability: 0,
      spamExplanation: "",
      offensiveProbability: 0,
      relevanceProbability: 0,
      sentiment: "neutral",
      uniquenessProbability: 0,
      clarityProbability: 0,
      culturalSensitivity: 0,
      engagementPotential: 0,
      tags: [],
      title: "Untitled",
    };
  }

  console.log("Idea completion", ideaCompletion);

  const id = uuid();

  const idea: Idea = {
    id,
    title: ideaCompletion.title || "Untitled",
    description,
    tags:
      ideaCompletion.tags?.map((t) => t.toLowerCase().replaceAll(" ", "")) ||
      [],
    owner: user,
    isFlagged: [
      ideaCompletion.spamProbability,
      ideaCompletion.offensiveProbability,
    ].some((v) => v > 0.5),
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
    isExample: false,
  };

  const ideaModeration: IdeaModeration = {
    ideaId: id,
    ...ideaCompletion,
  };

  // TODO
  // Limit users to a max of 1 idea per day and a max of x characters per idea. (each token costs money)
  // Premium users can get more ideas per day (10?), longer ideas, and the description corrected
  // Maybe the difference between premium and premium+ is around the number of ideas or the length of their descriptions.
  // But think about how many ideas a user will have.
  // Also maybe premum have titles of 3-10 words and normal users 3-5 and cannot edit the title.
  // Maybe premium have more tags. Sell is as "better quallity ideas" and "more visibility"
  await createIdea(idea, ideaModeration);

  return NextResponse.json({ id }, { status: 201 });
}
