import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, phone, password } = await request.json();

    if (!firstName || !lastName || !phone || !password) {
      return NextResponse.json({ error: "همه فیلدها الزامی هستند" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "رمز عبور باید حداقل ۶ کاراکتر باشد" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { phone } });
    if (existing) {
      return NextResponse.json({ error: "این شماره تلفن قبلاً ثبت‌نام کرده است" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        phone,
        password: hashedPassword,
        role: "CUSTOMER",
      },
    });

    return NextResponse.json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "خطا در ثبت‌نام" }, { status: 500 });
  }
}
