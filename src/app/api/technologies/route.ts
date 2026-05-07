import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const techs = await prisma.technology.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json(techs);
  } catch (error) {
    return NextResponse.json({ error: "Error fetching technologies" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const tech = await prisma.technology.create({
      data: body,
    });
    return NextResponse.json(tech);
  } catch (error) {
    return NextResponse.json({ error: "Error creating technology" }, { status: 500 });
  }
}
