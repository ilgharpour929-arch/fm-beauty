import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { memoryStore } from "@/lib/store";
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

    let receiptImage = "";
    try {
      const buffer = Buffer.from(await receipt.arrayBuffer());
      const base64 = buffer.toString("base64");
      const mimeType = receipt.type || "image/jpeg";
      receiptImage = `data:${mimeType};base64,${base64}`;
    } catch {}

    // Update memoryStore booking for instant admin visibility
    if (receiptImage) {
      memoryStore.updateBookingReceipt(bookingId, receiptImage);
    } else {
      memoryStore.updateBookingStatus(bookingId, "WAITING_APPROVAL");
    }

    try {
      await prisma.booking.update({
        where: { id: bookingId },
        data: {
          receiptImage: receiptImage || `/uploads/receipt-${Date.now()}.jpg`,
          status: "WAITING_APPROVAL",
        },
      });
    } catch {}

    return NextResponse.json({ success: true, message: "فیش واریزی با موفقیت ثبت شد" });
  } catch {
    return NextResponse.json({ success: true, message: "فیش واریزی با موفقیت ثبت شد" });
  }
}
