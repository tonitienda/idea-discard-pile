import { getSession } from "@auth0/nextjs-auth0";
import { getUserBySub } from "../../backend/db";

export async function useUser() {
  const session = await getSession();
  const sessionUser = session ? session.user : null;

  const user = await getUserBySub(sessionUser.sub);

  return user;
}
