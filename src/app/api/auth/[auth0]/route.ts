// app/api/auth/[auth0]/route.js
import { handleAuth } from "@auth0/nextjs-auth0";

process.env.AUTH0_BASE_URL =
  process.env.AUTH0_BASE_URL || `https://${process.env.VERCEL_URL}`;

export const GET = handleAuth();
