import { NextRequest, NextResponse } from "next/server";
import { getIdeaById, updateIdea } from "../../../../backend/db";

export async function GET(req: NextRequest, { params }) {
  const { id } = params;

  const idea = await getIdeaById(id);
  if (!idea) {
    return NextResponse.json({ message: "Idea not found" }, { status: 404 });
  }

  return NextResponse.json(idea, { status: 200 });
}

export async function PUT(req: NextRequest, { params }) {
  const { body } = req;
  const { id } = params;

  const idea = await getIdeaById(id);
  if (!idea) {
    return NextResponse.json({ message: "Idea not found" }, { status: 404 });
  }

  await updateIdea({
    ...idea,
    ...body,
  });

  return NextResponse.json({ id }, { status: 201 });
}

export async function DELETE(req: NextRequest, { params }) {
  const { id } = params;

  const idea = await getIdeaById(id);
  if (!idea) {
    return NextResponse.json({ message: "Idea not found" }, { status: 404 });
  }

  await updateIdea({
    ...idea,
    deletedAt: new Date().toISOString(),
  });

  return NextResponse.json({ id }, { status: 201 });
}
