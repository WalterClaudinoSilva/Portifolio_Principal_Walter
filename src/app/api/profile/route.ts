import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const profile = await prisma.profile.findFirst({
      where: { id: "default-profile" },
    });
    return NextResponse.json(profile);
  } catch (error) {
    return NextResponse.json({ error: "Error fetching profile" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const profile = await prisma.profile.upsert({
      where: { id: "default-profile" },
      update: body,
      create: { ...body, id: "default-profile" },
    });
    return NextResponse.json(profile);
  } catch (error) {
    return NextResponse.json({ error: "Error updating profile" }, { status: 500 });
  }
}
