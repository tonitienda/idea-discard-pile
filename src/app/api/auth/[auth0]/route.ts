// app/api/auth/[auth0]/route.ts
import {
  AppRouteHandlerFnContext,
  getSession,
  handleAuth,
  handleCallback,
} from "@auth0/nextjs-auth0";
import { NextRequest, NextResponse } from "next/server";
import { getUserBySub, createUser } from "../../../../backend/db";
import { v4 as uuid } from "uuid";

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
          await createUser({
            id: uuid(),
            sub: user.sub,
            email: user.email,
            name: user.name,
            picture: user.picture,
            handle: user.nickname,
          });

          // Redirect to profile page for new users
          const profileUrl = new URL("/profile", req.url);

          return NextResponse.redirect(profileUrl, {
            headers: nextRes.headers, // Preserve headers
            status: 302,
          });
        }

        // For existing users, redirect to home page
        const homeUrl = new URL("/", req.url);

        return NextResponse.redirect(homeUrl, {
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
