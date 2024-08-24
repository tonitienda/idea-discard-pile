import { IdeasIndexById } from "../inmemorydb";
import { v4 as uuid } from "uuid";
import { Idea } from "../model";
import { NextRequest, NextResponse } from "next/server";
import { getAccessToken } from "@auth0/nextjs-auth0";

// TODO - Add logs
// TODO - Move this to a shared file
const getUser = async (req: NextRequest) => {
  const res = new NextResponse();

  const token = await getAccessToken(req, res);
  if (!token || !token.accessToken) {
    return null;
  }
  console.log("token", token);
  const cookies = req.headers.get("cookie") || "";

  if (!cookies) {
    return null;
  }

  console.log("cookies", cookies);

  const userInfoResponse = await fetch(
    `${process.env.AUTH0_BASE_URL}/api/auth/me`,
    {
      headers: {
        Cookie: cookies, // Forward the cookies to the API
      },
    }
  );
  console.log("userInfoResponse", userInfoResponse);
  if (userInfoResponse.status === 204) {
    return null;
  }
  if (!userInfoResponse.ok) {
    return null;
  }

  const userInfo = await userInfoResponse.json();
  console.log("userInfo", userInfo);

  return userInfo;
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
