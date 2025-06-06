import prisma from "@/prisma/client";

export async function findUserByCodeMeli(codeMeli: string) {
    return await prisma.users.findUnique({where: {codeMeli}});
}

export async function findPermissions(catalogId: number) {
    return await prisma.permissions.findUnique({where: {catalogId}});
}

export async function upsertSession(userId: number, session: string, epoch: number) {
    return await prisma.sessions.upsert({
        where: {userId},
        update: {sessionToken: session, expires: epoch},
        create: {sessionToken: session, userId, expires: epoch},
    });
}
export async function findUserByMobile(mobile: string) {
    return await prisma.users.findUnique({where: {mobile}});
}


