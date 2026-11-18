import { NextRequest, NextResponse } from "next/server";
import { getUser } from "../../../backend/users";
import { getNotifications } from "../../../backend/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const user = await getUser(req);
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(await getNotifications(user.id));
}
