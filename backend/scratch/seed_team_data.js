const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

async function main() {
  console.log('Finding owner user and brand...');
  const owner = await prisma.user.findUnique({
    where: { email: 'vothanhnha26@gmail.com' }
  });
  if (!owner) {
    throw new Error('Owner user vothanhnha26@gmail.com not found. Please run prisma db seed first.');
  }

  const brand = await prisma.brand.findFirst({
    where: { ownerId: owner.id }
  });
  if (!brand) {
    throw new Error('Brand not found for owner user.');
  }

  // 1. Clear existing team members (except the owner) and custom roles
  console.log('Clearing old team members and custom roles...');
  await prisma.team.deleteMany({
    where: {
      brandId: brand.id,
      NOT: { userId: owner.id }
    }
  });

  // Clear custom roles associated with this brand
  await prisma.customRole.deleteMany({
    where: { brandId: brand.id }
  });

  // 2. Create Custom Roles with permissions
  console.log('Creating Custom Roles...');
  
  // Custom Role 1: Content Editor
  const roleEditor = await prisma.customRole.create({
    data: {
      brandId: brand.id,
      name: 'Content Editor',
      description: 'Biên tập nội dung bài đăng, quản lý media và lịch đăng bài.',
      colorHex: '#3B82F6',
      permissions: {
        createMany: {
          data: [
            { permissionKey: 'CREATE_POSTS', isAllowed: true },
            { permissionKey: 'APPROVE_POSTS', isAllowed: false },
            { permissionKey: 'MANAGE_MEDIA', isAllowed: true },
            { permissionKey: 'CREATE_LIVESTREAM', isAllowed: false },
            { permissionKey: 'MANAGE_CONNECTIONS', isAllowed: false },
            { permissionKey: 'MANAGE_TEAM', isAllowed: false },
            { permissionKey: 'MANAGE_ROLES', isAllowed: false },
            { permissionKey: 'VIEW_ANALYTICS', isAllowed: true }
          ]
        }
      }
    }
  });

  // Custom Role 2: Stream Operator
  const roleStreamer = await prisma.customRole.create({
    data: {
      brandId: brand.id,
      name: 'Stream Operator',
      description: 'Vận hành phát trực tiếp, quản lý livestream và luồng stream.',
      colorHex: '#EF4444',
      permissions: {
        createMany: {
          data: [
            { permissionKey: 'CREATE_POSTS', isAllowed: false },
            { permissionKey: 'APPROVE_POSTS', isAllowed: false },
            { permissionKey: 'MANAGE_MEDIA', isAllowed: false },
            { permissionKey: 'CREATE_LIVESTREAM', isAllowed: true },
            { permissionKey: 'MANAGE_CONNECTIONS', isAllowed: false },
            { permissionKey: 'MANAGE_TEAM', isAllowed: false },
            { permissionKey: 'MANAGE_ROLES', isAllowed: false },
            { permissionKey: 'VIEW_ANALYTICS', isAllowed: true }
          ]
        }
      }
    }
  });

  // Custom Role 3: Brand Analyst
  const roleAnalyst = await prisma.customRole.create({
    data: {
      brandId: brand.id,
      name: 'Brand Analyst',
      description: 'Chuyên viên xem báo cáo số liệu phân tích và tương tác mạng xã hội.',
      colorHex: '#F59E0B',
      permissions: {
        createMany: {
          data: [
            { permissionKey: 'CREATE_POSTS', isAllowed: false },
            { permissionKey: 'APPROVE_POSTS', isAllowed: false },
            { permissionKey: 'MANAGE_MEDIA', isAllowed: false },
            { permissionKey: 'CREATE_LIVESTREAM', isAllowed: false },
            { permissionKey: 'MANAGE_CONNECTIONS', isAllowed: false },
            { permissionKey: 'MANAGE_TEAM', isAllowed: false },
            { permissionKey: 'MANAGE_ROLES', isAllowed: false },
            { permissionKey: 'VIEW_ANALYTICS', isAllowed: true }
          ]
        }
      }
    }
  });

  console.log('Custom Roles created successfully.');

  // 3. Create or Update team member users in database
  console.log('Upserting user accounts for team members...');
  const defaultPasswordHash = await bcrypt.hash('Password123', 10);

  // User 1: vtn26xn@gmail.com
  let user1 = await prisma.user.findUnique({ where: { email: 'vtn26xn@gmail.com' } });
  if (!user1) {
    user1 = await prisma.user.create({
      data: {
        email: 'vtn26xn@gmail.com',
        passwordHash: defaultPasswordHash,
        name: 'Nha Vo (Editor)',
        isEmailVerified: true,
        isActive: true,
        role: 'EDITOR'
      }
    });
  } else {
    user1 = await prisma.user.update({
      where: { id: user1.id },
      data: {
        name: 'Nha Vo (Editor)',
        isActive: true,
        role: 'EDITOR'
      }
    });
  }

  // User 2: nhavothanh420@gmail.com
  let user2 = await prisma.user.findUnique({ where: { email: 'nhavothanh420@gmail.com' } });
  if (!user2) {
    user2 = await prisma.user.create({
      data: {
        email: 'nhavothanh420@gmail.com',
        passwordHash: defaultPasswordHash,
        name: 'Thanh Nha (Streamer)',
        isEmailVerified: true,
        isActive: true,
        role: 'STREAM_OPERATOR'
      }
    });
  } else {
    user2 = await prisma.user.update({
      where: { id: user2.id },
      data: {
        name: 'Thanh Nha (Streamer)',
        isActive: true,
        role: 'STREAM_OPERATOR'
      }
    });
  }

  // User 3 (Optional extra to show PENDING state): guest@gmail.com
  let user3 = await prisma.user.findUnique({ where: { email: 'guest@gmail.com' } });
  if (!user3) {
    user3 = await prisma.user.create({
      data: {
        email: 'guest@gmail.com',
        passwordHash: defaultPasswordHash,
        name: 'Guest Analyst',
        isEmailVerified: true,
        isActive: true,
        role: 'ANALYST'
      }
    });
  }

  // 4. Add users to the Team of Brand
  console.log('Adding users to the team...');
  
  // Add Nha Vo as ACTIVE Editor with Custom Role: Content Editor
  await prisma.team.create({
    data: {
      brandId: brand.id,
      userId: user1.id,
      role: 'EDITOR',
      customRoleId: roleEditor.id,
      invitedByUserId: owner.id,
      status: 'ACTIVE',
      acceptedAt: new Date()
    }
  });

  // Add Thanh Nha as ACTIVE Streamer with Custom Role: Stream Operator
  await prisma.team.create({
    data: {
      brandId: brand.id,
      userId: user2.id,
      role: 'STREAM_OPERATOR',
      customRoleId: roleStreamer.id,
      invitedByUserId: owner.id,
      status: 'ACTIVE',
      acceptedAt: new Date()
    }
  });

  // Add Guest as PENDING member with Custom Role: Brand Analyst
  await prisma.team.create({
    data: {
      brandId: brand.id,
      userId: user3.id,
      role: 'ANALYST',
      customRoleId: roleAnalyst.id,
      invitedByUserId: owner.id,
      status: 'PENDING'
    }
  });

  console.log('Team members added successfully!');
  console.log('Data Seeding Completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
