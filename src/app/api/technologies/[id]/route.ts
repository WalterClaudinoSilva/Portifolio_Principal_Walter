import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    await prisma.technology.delete({
      where: { id },
    });
    return NextResponse.json({ message: "Technology deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Error deleting technology" }, { status: 500 });
  }
}
