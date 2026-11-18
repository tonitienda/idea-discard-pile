import { NextRequest, NextResponse } from "next/server";
import { getUser } from "../../../backend/users";
import { getFeed } from "../../../backend/ideas";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const user = await getUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const ideas = await getFeed();

    return NextResponse.json({ items: ideas }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "An error occurred while fetching ideas" },
      { status: 500 }
    );
  }
}
