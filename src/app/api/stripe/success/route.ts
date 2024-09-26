import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  console.log("Stripe Transaction was successful");
  console.log("POST", req.url);
}
