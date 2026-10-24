import { execSync } from "child_process";
import fs from "fs";
import path from "path";

console.log("--------------------------------------------------");
console.log("⚠️  TRIAGEAI DEVELOPMENT DATABASE RESET");
console.log("This will delete local development data and re-seed demo accounts.");
console.log("--------------------------------------------------");

const dbPath = path.join(process.cwd(), "dev.db");
const journalPath = path.join(process.cwd(), "dev.db-journal");

if (fs.existsSync(dbPath)) {
  try {
    fs.unlinkSync(dbPath);
    console.log("Removed existing dev.db");
  } catch (err) {
    console.warn("Could not delete dev.db directly, will push over it:", err);
  }
}

if (fs.existsSync(journalPath)) {
  try {
    fs.unlinkSync(journalPath);
  } catch {
    // ignore
  }
}

try {
  console.log("1. Pushing Prisma schema to SQLite...");
  execSync("npx prisma db push --skip-generate", { stdio: "inherit" });

  console.log("2. Seeding initial accounts and future slots...");
  execSync("npx tsx prisma/seed.ts", { stdio: "inherit" });

  console.log("\n✅ Database reset & seeding complete!");
} catch (error) {
  console.error("Failed to reset database:", error);
  process.exit(1);
}
