import { createClient } from "@libsql/client";

const url = process.env.DATABASE_URL!;
const client = createClient({ url });

async function main() {
  const tables = await client.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name");
  console.log("Tables:", tables.rows.map((r) => r.name));
}

main().catch(console.error);
