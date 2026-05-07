import { prisma } from "./prisma";

export async function getActiveTheme(): Promise<{ themeId: string; message: string | null }> {
  try {
    const profile = await prisma.profile.findFirst({
      where: { id: "default-profile" },
      select: { theme: true, autoThemeEnabled: true },
    });

    if (!profile?.autoThemeEnabled) {
      return { themeId: profile?.theme || "default", message: null };
    }

    const now = new Date();
    const currentDay = now.getDate();
    const currentMonth = now.getMonth() + 1;

    const events = await prisma.eventTheme.findMany({
      where: { enabled: true },
      orderBy: { priority: "desc" },
    });

    for (const event of events) {
      const eventDate = new Date(now.getFullYear(), event.month - 1, event.day);
      const startDate = new Date(eventDate);
      startDate.setDate(eventDate.getDate() - event.activeDaysBefore);

      const endDate = new Date(eventDate);
      endDate.setDate(eventDate.getDate() + event.activeDaysAfter);

      if (now >= startDate && now <= endDate) {
        return { themeId: event.themeId, message: event.message };
      }
    }

    return { themeId: profile.theme || "default", message: null };
  } catch (error) {
    console.error("Erro ao obter tema ativo:", error);
    return { themeId: "default", message: null };
  }
}
