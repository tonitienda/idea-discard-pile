import { getSession } from "@auth0/nextjs-auth0";
import { getUserBySub } from "../../backend/db";
import { User } from "@auth0/auth0-react";

export async function useUser(): Promise<User | null> {
  const session = await getSession();
  const sessionUser = session ? session.user : null;

  if (!sessionUser) {
    return null;
  }

  return getUserBySub(sessionUser.sub);
}
