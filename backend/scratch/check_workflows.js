const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const workflows = await prisma.approvalWorkflow.findMany({
    include: {
      post: true,
      requester: { select: { name: true } }
    }
  });

  console.log(`Found ${workflows.length} workflows:`);
  workflows.forEach(w => {
    console.log(`- ID: ${w.id}, Post: "${w.post?.title}", Status: ${w.status}, BrandId: ${w.brandId}, Requester: ${w.requester?.name}, RequestedAt: ${w.requestedAt}`);
  });
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
