import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/client';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    let countSuccess = 0;
    let countError = 0;
    for (let key in body) {
      const { codeMeli, fullName, mobile, email } = body[key];
      const users = await prisma.users.count({
        where: {
          OR: [
            { codeMeli: codeMeli },
            { email: email },
            { mobile: mobile },
          ],
        },
      });
      if (users === 0) {
        countSuccess++;
        await prisma.users.create({
          data: {
            codeMeli: codeMeli,
            fullName: fullName,
            mobile: mobile,
            email: email,
            password: codeMeli,
            catalogId: 1,
          },
        });
      } else {
        countError++;
      }
    }
    return NextResponse.json({
      message: 'کاربران با موفقیت درون ریزی شدند.',
      countSuccess: countSuccess,
      countError: countError,
    }, { status: 200 });
  } catch (error) {
    console.error('Error importing users:', error);
    return NextResponse.json({ error: 'Failed to import users' }, { status: 500 });
  }
} 