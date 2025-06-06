import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/client';

export async function POST(req: NextRequest) {
  try {
    const { condition } = await req.json();
    const permissions = await prisma.permissions.findMany(condition);
    return NextResponse.json(permissions, { status: 200 });
  } catch (error) {
    console.error('Error fetching permissions:', error);
    return NextResponse.json({ error: 'Failed to fetch permission' }, { status: 500 });
  }
} 