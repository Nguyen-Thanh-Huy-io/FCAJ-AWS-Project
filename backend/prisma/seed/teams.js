/**
 * Seed Teams & Custom Roles - Idempotent
 *
 * Team: @@unique([brandId, userId]) → upsert bằng brandId_userId
 * CustomRole: không có unique constraint ngoài id → dùng findFirst + create
 * CustomRolePermission: @@unique([roleId, permissionKey]) → upsert
 */
module.exports = async function (prisma, context) {
  console.log('Seeding Teams and Roles...');
  const { customerUser, specialistUser, managerUser, testUser } = context.users;
  const { brand1, testBrand } = context.brands;

  // Helper: upsert custom role bằng tên + brandId (business logic unique)
  async function upsertCustomRole({ brandId, name, description, colorHex, permissions }) {
    let role = await prisma.customRole.findFirst({
      where: { brandId, name }
    });

    if (!role) {
      role = await prisma.customRole.create({
        data: { brandId, name, description, colorHex }
      });
    } else {
      role = await prisma.customRole.update({
        where: { id: role.id },
        data: { description, colorHex }
      });
    }

    // Upsert permissions
    for (const perm of permissions) {
      await prisma.customRolePermission.upsert({
        where: { roleId_permissionKey: { roleId: role.id, permissionKey: perm.permissionKey } },
        update: { isAllowed: perm.isAllowed },
        create: { roleId: role.id, permissionKey: perm.permissionKey, isAllowed: perm.isAllowed }
      });
    }

    return role;
  }

  const specialistRole = await upsertCustomRole({
    brandId: brand1.id, name: 'Social Media Specialist',
    description: 'Chuyên viên biên soạn và tối ưu bài viết mạng xã hội', colorHex: '#3B82F6',
    permissions: [
      { permissionKey: 'CREATE_POSTS', isAllowed: true },
      { permissionKey: 'PUBLISH_POSTS', isAllowed: false },
      { permissionKey: 'APPROVE_POSTS', isAllowed: false },
      { permissionKey: 'DELETE_POSTS', isAllowed: true }
    ]
  });

  const managerRole = await upsertCustomRole({
    brandId: brand1.id, name: 'Content Manager',
    description: 'Quản lý duyệt bài viết', colorHex: '#8B5CF6',
    permissions: [
      { permissionKey: 'CREATE_POSTS', isAllowed: true },
      { permissionKey: 'PUBLISH_POSTS', isAllowed: true },
      { permissionKey: 'APPROVE_POSTS', isAllowed: true },
      { permissionKey: 'DELETE_POSTS', isAllowed: true }
    ]
  });

  // Helper: upsert team member bằng composite unique [brandId, userId]
  async function upsertTeam({ brandId, userId, role, customRoleId, invitedByUserId }) {
    await prisma.team.upsert({
      where: { brandId_userId: { brandId, userId } },
      update: { role, customRoleId: customRoleId || null },
      create: { brandId, userId, role, customRoleId: customRoleId || null, invitedByUserId, status: 'ACTIVE', acceptedAt: new Date() }
    });
  }

  await upsertTeam({ brandId: brand1.id, userId: customerUser.id, role: 'OWNER', invitedByUserId: customerUser.id });
  await upsertTeam({ brandId: brand1.id, userId: specialistUser.id, role: 'USER', customRoleId: specialistRole.id, invitedByUserId: customerUser.id });
  await upsertTeam({ brandId: brand1.id, userId: managerUser.id, role: 'MANAGER', customRoleId: managerRole.id, invitedByUserId: customerUser.id });

  // Test User team
  await upsertTeam({ brandId: testBrand.id, userId: testUser.id, role: 'OWNER', invitedByUserId: testUser.id });
};
