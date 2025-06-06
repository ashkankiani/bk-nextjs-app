import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/client';
// import { fullStringToDateObjectP } from '@/libs/convertor';
// import { bkRequest } from '@/libs/api';

export async function GET(req: NextRequest) {
  try {
    const response = await prisma.reservations.findMany({
      include: {
        order: {
          include: {
            payment: true,
            user: true,
            provider: {
              include: {
                service: true,
                user: true,
              },
            },
          },
        },
      },
    });
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, condition } = body;
    if (type === 'condition') {
      const response = await prisma.reservations.findMany(condition);
      return NextResponse.json(response, { status: 200 });
    }
    // The rest of the POST logic (transaction, payment, order, reservation, draft) should be implemented as needed.
    return NextResponse.json({ message: 'Reservation POST logic not fully implemented.' }, { status: 501 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create reservation' }, { status: 500 });
  }
} 