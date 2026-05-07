import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const themes = await prisma.eventTheme.findMany({
      orderBy: { month: "asc" },
    });
    return NextResponse.json(themes);
  } catch (error) {
    console.error("Erro ao buscar temas de eventos:", error);
    return NextResponse.json({ error: "Erro ao buscar temas de eventos" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    try {
      const theme = await prisma.eventTheme.create({
        data: body,
      });
      return NextResponse.json(theme);
    } catch (prismaError: any) {
      // Se o erro for de campo desconhecido (message), tenta salvar sem ele
      if (prismaError.message?.includes("Unknown argument `message`")) {
        const { message, ...rest } = body;
        const theme = await prisma.eventTheme.create({
          data: rest,
        });
        return NextResponse.json(theme);
      }
      throw prismaError;
    }
  } catch (error) {
    console.error("Erro ao criar evento:", error);
    return NextResponse.json({ error: "Erro ao criar evento" }, { status: 500 });
  }
}
