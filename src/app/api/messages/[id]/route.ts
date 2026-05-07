import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const body = await req.json();
    const message = await prisma.message.update({
      where: { id },
      data: { read: body.read },
    });
    return NextResponse.json(message);
  } catch (error) {
    return NextResponse.json({ error: "Error updating message" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    await prisma.message.delete({
      where: { id },
    });
    return NextResponse.json({ message: "Message deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Error deleting message" }, { status: 500 });
  }
}
