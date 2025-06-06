import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/client';

export async function GET(req: NextRequest) {
  try {
    const discounts = await prisma.discounts.findMany();
    return NextResponse.json(discounts, { status: 200 });
  } catch (error) {
    console.error('Error fetching discounts:', error);
    return NextResponse.json({ error: 'Failed to fetch discounts' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newDiscount = await prisma.discounts.create({
      data: body,
    });
    return NextResponse.json(newDiscount, { status: 200 });
  } catch (error) {
    console.error('Error creating discount:', error);
    return NextResponse.json({ error: 'Failed to create discount' }, { status: 500 });
  }
} 