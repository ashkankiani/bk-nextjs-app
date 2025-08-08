import prisma from '@/prisma/client'

// پیدا کردن کاربر با کد ملی
export async function findUserByCodeMeli(codeMeli: string) {
  return await prisma.users.findUnique({ where: { codeMeli } })
}

// پیدا کردن کاربر با موبایل
export async function findUserByMobile(mobile: string) {
  return await prisma.users.findUnique({ where: { mobile } })
}

// پیدا کردن مجوزهای یک نقش
export async function findPermissions(catalogId: number) {
  return await prisma.permissions.findUnique({ where: { catalogId } })
}

// آپدیت کردن توکن یک کاربر
export async function upsertSession(userId: string, session: string, epoch: number) {
  return await prisma.sessions.upsert({
    where: { userId },
    update: { sessionToken: session, expires: epoch },
    create: { sessionToken: session, userId, expires: epoch },
  })
}

// بررسی آیا کاربر قبلا وجود دارد یا خیر
export async function checkUserExistence(codeMeli: string, email: string, mobile: string) {
  return await prisma.users.count({
    where: {
      OR: [{ codeMeli }, { email }, { mobile }],
    },
  })
}

// بررسی آیا کاربر برای آپدیت وجود دارد یا خیر

export async function checkUserExistenceForUpdate(codeMeli: string, email: string, mobile: string) {
  return await prisma.users.count({
    where: {
      OR: [{ email }, { mobile }],
      NOT: { codeMeli },
    },
  })
}
