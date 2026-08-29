import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

async function main() {
  console.log("FileFix database is ready.");
}

main().finally(() => db.$disconnect());
