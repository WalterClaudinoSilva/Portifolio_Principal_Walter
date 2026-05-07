import { Metadata } from "next";

export function constructMetadata({
  title = "Walter Claudino | Portfólio Profissional",
  description = "Professor EBTT do IFAM, Especialista em IA, IoT e Visão Computacional.",
  image = "/og-image.png",
  icons = "/favicon.ico",
  noIndex = false,
}: {
  title?: string;
  description?: string;
  image?: string;
  icons?: string;
  noIndex?: boolean;
} = {}): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: image }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "@walterclaudino",
    },
    icons,
    metadataBase: new URL("https://www.walterclaudino.com.br"),
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}
