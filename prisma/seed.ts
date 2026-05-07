import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("admin123", 10);
  
  const user = await prisma.user.upsert({
    where: { email: "admin@walterclaudino.com.br" },
    update: {},
    create: {
      email: "admin@walterclaudino.com.br",
      name: "Walter Claudino",
      password: hashedPassword,
    },
  });

  console.log({ user });

  const profile = await prisma.profile.upsert({
    where: { id: "default-profile" },
    update: {},
    create: {
      id: "default-profile",
      name: "Walter Claudino",
      title: "Professor EBTT do IFAM | Chefe do DEPEX | Especialista em IA, IoT e Visão Computacional",
      bio: "Professor do Instituto Federal do Amazonas (IFAM) - Campus Manacapuru. Especialista em Inteligência Artificial, Internet das Coisas e Visão Computacional.",
      location: "Manacapuru, AM",
      email: "walter.claudino@ifam.edu.br",
    },
  });

  console.log({ profile });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
