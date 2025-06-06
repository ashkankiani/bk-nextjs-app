import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/client';

function parseQueryParams(url: string) {
  const params = new URL(url).searchParams;
  const query: Record<string, any> = {};
  params.forEach((value, key) => {
    query[key] = key === 'catalogId' ? Number(value) : value;
  });
  return query;
}

export async function GET(req: NextRequest) {
  try {
    const query = parseQueryParams(req.url);
    if (Object.keys(query).length !== 0) {
      const users = await prisma.users.findMany({ where: query });
      return NextResponse.json(users, { status: 200 });
    } else {
      const users = await prisma.users.findMany({ include: { catalog: {} } });
      return NextResponse.json(users, { status: 200 });
    }
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { type, condition, ...body } = await req.json();
    if (type === 'condition') {
      const users = await prisma.users.findMany(condition);
      return NextResponse.json(users, { status: 200 });
    } else {
      const userCount = await prisma.users.count({
        where: {
          OR: [
            { codeMeli: body.codeMeli },
            { email: body.email },
            { mobile: body.mobile },
          ],
        },
      });
      if (userCount) {
        return NextResponse.json({ error: 'کاربر با این مشخصات وجود دارد.' }, { status: 400 });
      } else {
        const newUsers = await prisma.users.create({ data: body });
        return NextResponse.json(newUsers, { status: 200 });
      }
    }
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
} 