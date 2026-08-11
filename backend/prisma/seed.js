const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const seedDemo = process.env.SEED_DEMO === "true";

  await require("./seed/index.js")(prisma, { seedDemo });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
