import { NextRequest, NextResponse } from "next/server";
import { getUser } from "../../../../backend/users";
import { updateUserProfile } from "../../../../backend/db";

export async function GET(req: NextRequest) {
  console.error("GET2", req.url);
  const user = await getUser(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json(user, { status: 200 });
}

function isValidUrl(url: string) {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
}

async function checkIfImageUrl(url: string): Promise<boolean> {
  if (!isValidUrl(url)) {
    return false;
  }

  try {
    const response = await fetch(url, { method: "HEAD" });

    // Check if the response is ok and if the content type is an image
    if (response.ok) {
      const contentType = response.headers.get("Content-Type");

      return contentType && contentType.startsWith("image/");
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error fetching the URL:", error);
    return false;
  }
}

function isValidHandle(handle: string) {
  return /^[a-zA-Z0-9_]{1,15}$/.test(handle);
}
export async function PUT(req: NextRequest) {
  const user = await getUser(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await req.json();
  const { handle, picture } = data;

  const isValidImageUrl = await checkIfImageUrl(picture);
  if (!isValidImageUrl) {
    return NextResponse.json({ error: "Invalid picture URL" }, { status: 400 });
  }

  if (!isValidHandle(handle)) {
    return NextResponse.json({ error: "Invalid handle" }, { status: 400 });
  }

  await updateUserProfile(user.id, { handle, picture });

  return NextResponse.json(user, { status: 200 });
}
