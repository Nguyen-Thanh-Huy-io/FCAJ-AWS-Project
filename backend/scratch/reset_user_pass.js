const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('Password123', 10);
  const updatedUser = await prisma.user.update({
    where: { email: 'vothanhnha26@gmail.com' },
    data: { passwordHash }
  });
  console.log('Successfully reset password for', updatedUser.email);
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
