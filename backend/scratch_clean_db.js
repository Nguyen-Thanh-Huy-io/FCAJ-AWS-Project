const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const redisClient = require('./src/config/redis');

async function main() {
  console.log('Starting DB cleanup...');
  
  // Deleting in correct order to respect foreign key constraints
  const deletedPosts = await prisma.post.deleteMany({});
  console.log(`Deleted ${deletedPosts.count} posts`);

  const deletedAutoLists = await prisma.autoList.deleteMany({});
  console.log(`Deleted ${deletedAutoLists.count} autoLists`);

  console.log('Starting Redis cleanup...');
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
  try {
    await redisClient.flushDb();
    console.log('Redis database flushed successfully!');
  } catch (redisErr) {
    console.error('Failed to flush Redis:', redisErr.message);
  }

  console.log('DB & Redis cleanup completed successfully!');
}

main()
  .catch(e => {
    console.error('Error cleaning DB & Redis:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    try {
      if (redisClient.isOpen) {
        await redisClient.disconnect();
      }
    } catch (err) {}
  });
