import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const productions = await prisma.production.findMany({
      orderBy: { date: "desc" },
    });
    return NextResponse.json(productions);
  } catch (error) {
    return NextResponse.json({ error: "Error fetching productions" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const production = await prisma.production.create({
      data: {
        ...body,
        date: new Date(body.date),
      },
    });
    return NextResponse.json(production);
  } catch (error) {
    return NextResponse.json({ error: "Error creating production" }, { status: 500 });
  }
}
