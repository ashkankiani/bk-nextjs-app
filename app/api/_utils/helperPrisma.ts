import prisma from "@/prisma/client";

export async function findUserByCodeMeli(codeMeli: string) {
    return await prisma.users.findUnique({where: {codeMeli}});
}

export async function findUserByMobile(mobile: string) {
    return await prisma.users.findUnique({where: {mobile}});
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

export async function checkUserExistence(codeMeli: string, email: string, mobile: string) {
    return await prisma.users.count({
        where: {
            OR: [
                {codeMeli},
                {email},
                {mobile},
            ],
        },
    });
}


export async function checkUserExistenceForUpdate(email: string, mobile: string, codeMeli: string) {
    return await prisma.users.count({
        where: {
            OR: [
                {email},
                {mobile},
            ],
            NOT: {codeMeli},
        },
    });
}

