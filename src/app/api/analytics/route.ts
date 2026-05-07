import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { path } = await req.json();
    
    await prisma.pageView.create({
      data: { path },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to track view" }, { status: 500 });
  }
}
