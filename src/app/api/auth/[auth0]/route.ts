// app/api/auth/[auth0]/route.ts
import {
  AppRouteHandlerFnContext,
  getSession,
  handleAuth,
  handleCallback,
} from "@auth0/nextjs-auth0";
import { NextRequest, NextResponse } from "next/server";
import {
  getUserBySub,
  createUser,
  isHandleTaken,
} from "../../../../backend/db";
import { toHandle } from "../../../../backend/users";
import { v4 as uuid } from "uuid";

// handleCallback redirects to the login's returnTo. Only same-origin
// targets are followed.
const returnUrl = (res: Response, req: NextRequest) => {
  const home = new URL("/", req.url);
  const location = res.headers.get("location");
  if (!location) {
    return home;
  }
  const target = new URL(location, req.url);
  return target.origin === home.origin ? target : home;
};

export const GET = handleAuth({
  callback: async (req: NextRequest, ctx: AppRouteHandlerFnContext) => {
    try {
      // Handle the callback
      const res = await handleCallback(req, ctx);

      // Get the user from the session
      const nextRes = new NextResponse(res.body, res);

      const session = await getSession(req, nextRes);
      const user = session?.user;

      if (user) {
        // Check if the user exists in your database
        const existingUser = await getUserBySub(user.sub);

        if (!existingUser) {
          // If the user doesn't exist, add them to your database
          // Handles are unique: add a numeric suffix if the nickname is taken
          let handle = toHandle(user.nickname);
          while (await isHandleTaken(handle)) {
            const suffix = String(Math.floor(1000 + Math.random() * 9000));
            handle = handle.slice(0, 15 - suffix.length) + suffix;
          }

          await createUser({
            id: uuid(),
            sub: user.sub,
            email: user.email,
            name: user.name || handle,
            picture: user.picture,
            handle,
          });

          // Redirect to profile page for new users
          const profileUrl = new URL("/profile", req.url);

          return NextResponse.redirect(profileUrl, {
            headers: nextRes.headers, // Preserve headers
            status: 302,
          });
        }

        // Existing users go back where they logged in from (returnTo),
        // or home.
        return NextResponse.redirect(returnUrl(res, req), {
          headers: nextRes.headers, // Preserve headers
          status: 302,
        });
      }

      // If no user, return the original response
      return nextRes;
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        { error: "An error occurred during the login process." },
        { status: 500 }
      );
    }
  },
});
