import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "لطفاً ابتدا وارد شوید" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const receipt = formData.get("receipt") as File;
    const bookingId = formData.get("bookingId") as string;

    if (!receipt || !bookingId) {
      return NextResponse.json({ error: "فیش و شناسه رزرو الزامی است" }, { status: 400 });
    }

    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) {
      return NextResponse.json({ error: "رزرو یافت نشد" }, { status: 404 });
    }

    if (booking.userId !== (session.user as any).id) {
      return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
    }

    const ext = receipt.name.split(".").pop() || "jpg";
    const fileName = `receipt-${uuidv4()}.${ext}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads");

    try {
      await mkdir(uploadDir, { recursive: true });
    } catch {}

    const buffer = Buffer.from(await receipt.arrayBuffer());
    await writeFile(path.join(uploadDir, fileName), buffer);

    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        receiptImage: `/uploads/${fileName}`,
        status: "WAITING_APPROVAL",
      },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "خطا در آپلود فیش" }, { status: 500 });
  }
}
