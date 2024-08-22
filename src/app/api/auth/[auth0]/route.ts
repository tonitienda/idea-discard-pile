// app/api/auth/[auth0]/route.js
import { handleAuth } from "@auth0/nextjs-auth0";

const getAuth0BaseUrl = () => {
  if (
    process.env.VERCEL_ENV === "preview" ||
    process.env.VERCEL_ENV === "production"
  ) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return process.env.AUTH0_BASE_URL || "http://localhost:3000";
};

process.env.AUTH0_BASE_URL = getAuth0BaseUrl();

export const GET = handleAuth();
