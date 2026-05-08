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
    const { title, description, content, image, link, github, featured, published, technologyIds } = body;

    // First, delete existing technology relations
    await prisma.projectTechnology.deleteMany({
      where: { projectId: id },
    });

    const project = await prisma.project.update({
      where: { id },
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
    return NextResponse.json({ error: "Error updating project" }, { status: 500 });
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
    await prisma.project.delete({
      where: { id },
    });
    return NextResponse.json({ message: "Project deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Error deleting project" }, { status: 500 });
  }
}
