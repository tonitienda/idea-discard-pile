import { v4 as uuid } from "uuid";
import { Idea, IdeaModeration } from "../model";
import { NextRequest, NextResponse } from "next/server";
import { getUser } from "../users";
import { getIdeasByUserId, createIdea } from "../../../backend/db";
import { completeIdea } from "../../../backend/ai/idea-analysis";

const EmptyIdea: Idea = {
  id: "",
  title: "",
  description: "",
  discardedReason: "",
  tags: [],
  createdAt: "",
  updatedAt: "",
  owner: null,
};

export async function GET(req: NextRequest) {
  try {
    console.log("GET", req.url);
    // FIXME - See why this is not working
    const user = await getUser(req);
    // if (!user) {
    //   return redirectToLogin(req);
    // }

    const items: Idea[] = await getIdeasByUserId(user.id);

    console.log("Ideas", items);

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
  const data = await req.json();

  const { description } = data;

  console.log("Description:", description);

  if (!description || description.length < 10) {
    return NextResponse.json(
      { message: "Description must be at least 10 characters" },
      { status: 400 }
    );
  }

  const ideaCompletion = await completeIdea(description, user.id);

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
  };

  const ideaModeration: IdeaModeration = {
    ideaId: id,
    ...ideaCompletion,
  };

  // TODO - Add fields in DB to store the spam and offensive scores.
  // Do not load the ideas with scores > 50% but let the user
  // Find their ideas in their dashboard so they can try to "unflag" them.
  // Ban users with more than 3 flagged ideas. They are not allowed to post ideas anymore.
  // Limit users to a max of 1 idea per day and a max of x characters per idea. (each token costs money)
  // Premium users can get more ideas per day (10?), longer ideas, and the description corrected
  // Maybe the difference between premium and premium+ is around the number of ideas or the length of their descriptions.
  // But think about how many ideas a user will have.
  // Also maybe premum have titles of 3-10 words and normal users 3-5 and cannot edit the title.
  // Maybe premium have more tags. Sell is as "better quallity ideas" and "more visibility"
  await createIdea(idea, ideaModeration);

  return NextResponse.json({ id }, { status: 201 });
}
