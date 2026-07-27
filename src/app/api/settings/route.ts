import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { memoryStore } from "@/lib/store";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const settings = memoryStore.getBankSettings();
  return NextResponse.json(settings);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    memoryStore.updateBankSettings(body);
    const updated = memoryStore.getBankSettings();
    return NextResponse.json({ success: true, settings: updated });
  } catch {
    return NextResponse.json({ error: "Error updating settings" }, { status: 500 });
  }
}
