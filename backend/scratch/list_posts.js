const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const posts = await prisma.post.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' }
  });
  console.log(`Total posts: ${await prisma.post.count()}`);
  console.log('Latest 10 posts:');
  console.log(JSON.stringify(posts, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
