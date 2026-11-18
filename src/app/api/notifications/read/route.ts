import { NextRequest, NextResponse } from "next/server";
import { getUser } from "../../../../backend/users";
import { markNotificationsRead } from "../../../../backend/db";

export async function POST(req: NextRequest) {
  const user = await getUser(req);
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  await markNotificationsRead(user.id);
  return new NextResponse(null, { status: 204 });
}
