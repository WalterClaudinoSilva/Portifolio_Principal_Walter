import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      include: { technologies: { include: { technology: true } } },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json({ error: "Error fetching projects" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { title, description, content, image, link, github, featured, published, technologyIds } = body;

    const project = await prisma.project.create({
      data: {
        title,
        description,
        content,
        image,
        link,
        github,
        featured,
        published,
        technologies: {
          create: technologyIds?.map((id: string) => ({
            technology: { connect: { id } },
          })),
        },
      },
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error creating project" }, { status: 500 });
  }
}
