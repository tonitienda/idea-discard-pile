import { v4 as uuid } from "uuid";
import { AdminDashboard, Idea } from "../../model";
import { NextRequest, NextResponse } from "next/server";
import { getUser } from "../../../../backend/users";
import { getAdminDashboardInfo } from "../../../../backend/db";

export async function GET(req: NextRequest) {
  try {
    console.log("GET", req.url);
    // FIXME - See why this is not working
    const user = await getUser(req);

    if (!user) {
      return NextResponse.redirect("/api/auth/login");
    }

    // FIXME - Super hardcoded check. Add claims to DB and set admins
    if (user.email !== "tonitienda@gmail.com") {
      return NextResponse.json(
        { error: "You are not authorized to access this resource" },
        { status: 403 }
      );
    }

    const dashboard: AdminDashboard = await getAdminDashboardInfo();

    console.log("dashboard", dashboard);

    return NextResponse.json(dashboard, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "An error occurred while fetching ideas" },
      { status: 500 }
    );
  }
}
