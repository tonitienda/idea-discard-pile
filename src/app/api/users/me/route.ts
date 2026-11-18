import { NextRequest, NextResponse } from "next/server";
import { getUser, HANDLE_PATTERN } from "../../../../backend/users";
import { isHandleTaken, updateUserProfile } from "../../../../backend/db";

export async function GET(req: NextRequest) {
  const user = await getUser(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json(user, { status: 200 });
}

// Only https URLs are accepted. The URL is not fetched server-side: the
// browser loads it like any other <img>, so the server never requests
// user-supplied addresses.
function isValidPictureUrl(value: unknown): value is string {
  if (typeof value !== "string" || value.length > 255) {
    return false;
  }
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

export async function PUT(req: NextRequest) {
  const user = await getUser(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let data: { handle?: unknown; picture?: unknown; name?: unknown };
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { handle, picture } = data;
  const name = typeof data.name === "string" ? data.name.trim() : "";

  if (!isValidPictureUrl(picture)) {
    return NextResponse.json(
      { error: "Picture must be an https URL" },
      { status: 400 }
    );
  }

  if (typeof handle !== "string" || !HANDLE_PATTERN.test(handle)) {
    return NextResponse.json(
      {
        error:
          "Handle must be 1-15 characters: letters, numbers or underscores",
      },
      { status: 400 }
    );
  }

  if (!name || name.length > 255) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  if (await isHandleTaken(handle, user.id)) {
    return NextResponse.json(
      { error: "That handle is already taken" },
      { status: 409 }
    );
  }

  const updated = await updateUserProfile(user.id, { handle, picture, name });

  return NextResponse.json(updated, { status: 200 });
}
