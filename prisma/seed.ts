import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL || "file:./dev.db",
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminPassword = await bcrypt.hash("admin123", 12);

  await prisma.user.upsert({
    where: { phone: "09120000000" },
    update: {},
    create: {
      firstName: "فاطمه",
      lastName: "محمدی",
      phone: "09120000000",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  console.log("Admin created: 09120000000");

  const services = [
    { id: "volume", name: "اکستنشن مژه والیوم", description: "مژه‌های حجیم و پرپشت با تکنیک والیوم", price: 1800000, image: "/images/gallery/valyum.jpg" },
    { id: "spiky", name: "اکستنشن مژه اسپایکی", description: "مژه‌های فرچه‌ای با ظاهری جذاب و چشمگیر", price: 1500000, image: "/images/gallery/spayki.jpg" },
    { id: "natural", name: "اکستنشن مژه نچرال", description: "مژه‌های طبیعی و ظریف برای روزمره", price: 1100000, image: "/images/services/nacral.jpg" },
    { id: "repair", name: "ترمیم مژه", description: "ترمیم مژه‌های قبلی (نیاز به هماهنگی)", price: 1500000, image: "/images/gallery/nemune-1.jpg" },
    { id: "lash-lift", name: "لیفت مژه و لمینیت", description: "فر طبیعی و ماندگار مژه‌ها بدون اکستنشن", price: 1200000, image: "/images/services/lift-moje.jpg" },
    { id: "brow-lift", name: "لیفت ابرو", description: "مرتب‌سازی و فرم‌دهی ابروها", price: 1200000, image: "/images/services/lift-abru.jpg" },
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: { id: service.id },
      update: service,
      create: service,
    });
  }

  console.log("Services seeded:", services.length);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
