import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const body = await req.json();
    const production = await prisma.production.update({
      where: { id },
      data: {
        ...body,
        date: new Date(body.date),
      },
    });
    return NextResponse.json(production);
  } catch (error) {
    return NextResponse.json({ error: "Error updating production" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    await prisma.production.delete({
      where: { id },
    });
    return NextResponse.json({ message: "Production deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Error deleting production" }, { status: 500 });
  }
}
