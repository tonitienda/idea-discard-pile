import { getSession } from "@auth0/nextjs-auth0";
import { NextRequest, NextResponse } from "next/server";
import { User } from "../app/api/model";
import { getUserBySub } from "./db";

export const getUser = async (req: NextRequest): Promise<User | null> => {
  const session = await getSession(req, new NextResponse());

  if (!session?.user?.sub) {
    return null;
  }

  return getUserBySub(session.user.sub);
};

// Comma-separated list of admin emails, e.g. ADMIN_EMAILS="a@x.com,b@y.com"
export const isAdmin = (user: User | null): boolean => {
  if (!user?.email) {
    return false;
  }
  const admins = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return admins.includes(user.email.toLowerCase());
};

export const HANDLE_PATTERN = /^[a-zA-Z0-9_]{1,15}$/;

// Turns an Auth0 nickname into a valid handle candidate.
export const toHandle = (nickname: string | undefined): string => {
  const cleaned = (nickname || "").replace(/[^a-zA-Z0-9_]/g, "").slice(0, 15);
  return cleaned || "user";
};
