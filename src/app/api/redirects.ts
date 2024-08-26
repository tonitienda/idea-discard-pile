import { NextRequest, NextResponse } from "next/server";

export const redirectTo = (req: NextRequest, dest: string) => {
  const baseUrl = req.headers.get("host");
  const url = `${baseUrl}${dest}`;

  console.log("Redirecting to", url);
  return NextResponse.redirect(url);
};

export const redirectToLogin = async (req: NextRequest) => {
  // Redirect to the login page with absolute URL
  return redirectTo(req, "/api/auth/login");
};
