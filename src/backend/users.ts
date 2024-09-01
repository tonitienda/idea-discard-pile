import { getSession } from "@auth0/nextjs-auth0";
import { NextRequest, NextResponse } from "next/server";
import { User } from "../app/api/model";
import { getUserBySub } from "./db";

export const getUser = async (req: NextRequest): Promise<User | null> => {
  const res = new NextResponse();

  const session = await getSession(req, res);
  console.log("session", session);

  if (!session || !session.user || !session.user.sub) {
    console.log("No session");
    return null;
  }

  return getUserBySub(session.user.sub);
};
