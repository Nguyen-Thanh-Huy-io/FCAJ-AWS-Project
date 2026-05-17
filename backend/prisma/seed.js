const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const roles = [
    { name: 'ADMIN', description: 'System Administrator with full access' },
    { name: 'MANAGER', description: 'Workspace Owner who can manage brands and invite members' },
    { name: 'STAFF', description: 'Workspace Member with limited permissions' },
  ];

  console.log('Seeding roles...');

  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: {},
      create: role,
    });
  }

  console.log('Seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
