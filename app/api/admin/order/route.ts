import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/client';

export async function GET(req: NextRequest) {
  try {
    const orders = await prisma.orders.findMany({
      include: {
        service: { select: { name: true, price: true } },
        user: { select: { fullName: true, codeMeli: true, mobile: true, email: true } },
        discount: { select: { title: true, code: true } },
        payment: { select: { paymentType: true } },
      },
    });
    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
} 