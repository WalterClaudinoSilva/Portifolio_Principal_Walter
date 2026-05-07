import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [projects, technologies, experiences, messages, views] = await Promise.all([
      prisma.project.count(),
      prisma.technology.count(),
      prisma.experience.count(),
      prisma.message.count(),
      prisma.pageView.count(),
    ]);

    // Buscar dados dos últimos 6 meses para o gráfico
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const rawViews = await prisma.pageView.findMany({
      where: { createdAt: { gte: sixMonthsAgo } },
      select: { createdAt: true },
    });

    const rawMessages = await prisma.message.findMany({
      where: { createdAt: { gte: sixMonthsAgo } },
      select: { createdAt: true },
    });

    // Processar dados para o formato do gráfico
    const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    const chartData = [];

    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const monthLabel = months[d.getMonth()];
      const year = d.getFullYear();
      const month = d.getMonth();

      const monthViews = rawViews.filter(v => 
        v.createdAt.getMonth() === month && v.createdAt.getFullYear() === year
      ).length;

      const monthMessages = rawMessages.filter(m => 
        m.createdAt.getMonth() === month && m.createdAt.getFullYear() === year
      ).length;

      chartData.push({
        name: monthLabel,
        views: monthViews,
        messages: monthMessages
      });
    }

    return NextResponse.json({
      projects,
      technologies,
      experiences,
      messages,
      views,
      chartData
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
