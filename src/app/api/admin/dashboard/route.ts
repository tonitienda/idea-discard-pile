import { NextRequest, NextResponse } from "next/server";
import { getUser, isAdmin } from "../../../../backend/users";
import { getAdminDashboardInfo } from "../../../../backend/db";

export async function GET(req: NextRequest) {
  const user = await getUser(req);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isAdmin(user)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json(await getAdminDashboardInfo(), { status: 200 });
}
