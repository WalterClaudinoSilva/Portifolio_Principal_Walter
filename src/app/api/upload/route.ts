import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { writeFile, mkdir, unlink } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import { randomUUID } from "crypto";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const oldUrl = formData.get("oldUrl") as string;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Definir diretório de upload
    const uploadDir = join(process.cwd(), "public", "uploads");
    
    // Criar diretório se não existir
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // 1. Apagar o arquivo antigo se for fornecido e se existir
    if (oldUrl && oldUrl.startsWith("/uploads/")) {
      try {
        const oldFilename = oldUrl.replace("/uploads/", "");
        const oldPath = join(uploadDir, oldFilename);
        if (existsSync(oldPath)) {
          await unlink(oldPath);
          console.log(`Arquivo antigo removido: ${oldFilename}`);
        }
      } catch (err) {
        console.error("Erro ao remover arquivo antigo:", err);
        // Não travamos o upload se a deleção falhar
      }
    }

    // 2. Gerar nome de arquivo único com UUID
    const fileExtension = file.name.split(".").pop();
    const uniqueId = randomUUID();
    const filename = `${uniqueId}.${fileExtension}`;
    const path = join(uploadDir, filename);

    // 3. Salvar o novo arquivo no servidor
    await writeFile(path, buffer);
    
    const imageUrl = `/uploads/${filename}`;

    return NextResponse.json({ url: imageUrl });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Error uploading file" }, { status: 500 });
  }
}
