import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    try {
      const theme = await prisma.eventTheme.update({
        where: { id: id },
        data: body,
      });
      return NextResponse.json(theme);
    } catch (prismaError: any) {
      if (prismaError.message?.includes("Unknown argument `message`")) {
        const { message, ...rest } = body;
        const theme = await prisma.eventTheme.update({
          where: { id: id },
          data: rest,
        });
        return NextResponse.json(theme);
      }
      throw prismaError;
    }
  } catch (error) {
    console.error("Erro ao atualizar evento:", error);
    return NextResponse.json({ error: "Erro ao atualizar evento" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await prisma.eventTheme.delete({
      where: { id: id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao deletar evento:", error);
    return NextResponse.json({ error: "Erro ao deletar evento" }, { status: 500 });
  }
}
