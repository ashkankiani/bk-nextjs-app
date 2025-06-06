import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/client';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const timeSheets = await prisma.timeSheets.create({
      data: body,
    });
    return NextResponse.json(timeSheets, { status: 200 });
  } catch (error) {
    console.error('Error creating timeSheets:', error);
    return NextResponse.json({ error: 'Failed to create timeSheets' }, { status: 500 });
  }
} 