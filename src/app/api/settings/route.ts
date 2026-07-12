import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const DEFAULT_SETTINGS = {
  phone: "",
  email: "",
  address: "",
  workingHours: "همه روزه از ۹ صبح تا ۸ شب",
  instagram: "",
  telegram: "",
  whatsapp: "",
};

export async function GET() {
  try {
    let settings = await prisma.settings.findUnique({ where: { id: "main" } });
    if (!settings) {
      settings = await prisma.settings.create({ data: { id: "main", ...DEFAULT_SETTINGS } });
    }
    return NextResponse.json(settings);
  } catch {
    return NextResponse.json(DEFAULT_SETTINGS);
  }
}