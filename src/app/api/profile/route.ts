import { IdeasIndexById } from "../inmemorydb";
import { NextRequest, NextResponse } from "next/server";
import { getUser } from "../users";
import { redirectToLogin } from "../redirects";

export async function GET(req: NextRequest, res) {
  const user = await getUser(req);

  if (!user) {
    return redirectToLogin(req);
  }

  return NextResponse.json(user, { status: 200 });
}
