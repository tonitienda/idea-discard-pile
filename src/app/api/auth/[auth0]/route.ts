// app/api/auth/[auth0]/route.js
import { handleAuth } from "@auth0/nextjs-auth0";

// TODO - See how to create a new use in the internal DB
export const GET = handleAuth();
