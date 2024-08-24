import { IdeasIndexById } from "../inmemorydb";
import { v4 as uuid } from "uuid";
import { Idea } from "../model";
import { NextRequest, NextResponse } from "next/server";
import { getAccessToken } from "@auth0/nextjs-auth0";
import jwt from "jsonwebtoken";
import jose from "node-jose";
import { getSession } from "@auth0/nextjs-auth0";

// TODO - Add logs
// TODO - Move this to a shared file
const getUser = async (req: NextRequest) => {
  const res = new NextResponse();

  const session = await getSession(req, res);

  console.log("session", session);
  console.log("session.user", session.user);

  return session.user;
};

const EmptyIdea: Idea = {
  id: "",
  title: "",
  description: "",
  discardedReason: "",
  tags: [],
  createdAt: "",
  updatedAt: "",
  owner: "",
};

export async function GET(req: NextRequest) {
  const user = await getUser(req);
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  console.log("GET", IdeasIndexById);
  const items = Object.values(IdeasIndexById).filter((i) => !i.deletedAt);
  return NextResponse.json({ items }, { status: 200 });
}

export async function POST(req: NextRequest) {
  const user = await getUser(req);
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const data = await req.json();

  const id = uuid();

  // FIXME: Add validation
  IdeasIndexById[id] = {
    ...EmptyIdea,
    ...data,
    id,
    owner: user.sub, // TODO - Use the internal id
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  console.log("POST", IdeasIndexById[id]);

  return NextResponse.json({ id }, { status: 201 });
}
