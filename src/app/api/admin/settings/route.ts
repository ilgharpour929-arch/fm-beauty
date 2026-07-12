import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

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
    const session = await auth();
    const user = session?.user as any;
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "غیرمجاز" }, { status: 403 });
    }

    let settings = await prisma.settings.findUnique({ where: { id: "main" } });
    if (!settings) {
      settings = await prisma.settings.create({ data: { id: "main", ...DEFAULT_SETTINGS } });
    }
    return NextResponse.json(settings);
  } catch {
    return NextResponse.json(DEFAULT_SETTINGS);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await auth();
    const user = session?.user as any;
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "غیرمجاز" }, { status: 403 });
    }

    const body = await req.json();
    const settings = await prisma.settings.upsert({
      where: { id: "main" },
      update: body,
      create: { id: "main", ...DEFAULT_SETTINGS, ...body },
    });
    return NextResponse.json(settings);
  } catch {
    return NextResponse.json({ error: "خطا در ذخیره" }, { status: 500 });
  }
}