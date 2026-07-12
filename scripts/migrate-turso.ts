import { createClient } from "@libsql/client";
import fs from "fs";
import path from "path";

const url = process.env.DATABASE_URL!;
const client = createClient({ url });

async function main() {
  const sql = fs.readFileSync(
    path.join(__dirname, "..", "prisma", "migrations", "20260707000232_init", "migration.sql"),
    "utf-8"
  );

  const statements = sql
    .replace(/^--.*$/gm, "")
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  for (const stmt of statements) {
    try {
      const fullSql = stmt + ";";
      console.log("Running:", fullSql.slice(0, 80));
      await client.execute(fullSql);
      console.log("  OK");
    } catch (e: any) {
      if (e.message?.includes("already exists")) {
        console.log("  SKIP (exists)");
      } else {
        console.error("  ERROR:", e.message);
        throw e;
      }
    }
  }

  console.log("Migration done!");
}

main().catch((e) => { console.error(e); process.exit(1); });
