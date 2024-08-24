import { IdeasIndexById } from "../../inmemorydb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }) {
  const { id } = params;

  const idea = IdeasIndexById[id];
  if (!idea) {
    return NextResponse.json({ message: "Idea not found" }, { status: 404 });
  }

  return NextResponse.json(idea, { status: 200 });
}

export async function PUT(req: NextRequest, { params }) {
  const { body } = req;
  const { id } = params;

  const idea = IdeasIndexById[id];
  if (!idea) {
    return NextResponse.json({ message: "Idea not found" }, { status: 404 });
  }

  IdeasIndexById[id] = {
    ...idea,
    ...body,
    updatedAt: new Date().toISOString(),
  };

  return NextResponse.json({ id }, { status: 201 });
}

export async function DELETE(req: NextRequest, { params }) {
  const { id } = params;

  const idea = IdeasIndexById[id];
  if (!idea) {
    return NextResponse.json({ message: "Idea not found" }, { status: 404 });
  }

  IdeasIndexById[id] = {
    ...idea,
    deletedAt: new Date().toISOString(),
  };

  return NextResponse.json({ id }, { status: 201 });
}
