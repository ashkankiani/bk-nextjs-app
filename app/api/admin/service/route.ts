import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/client';

export async function GET(req: NextRequest) {
  try {
    const services = await prisma.services.findMany({
      include: {
        user: {
          select: {
            fullName: true,
            mobile: true,
            email: true,
          },
        },
      },
    });
    return NextResponse.json(services, { status: 200 });
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { type, condition, ...body } = await req.json();
    if (type === 'condition') {
      const services = await prisma.services.findMany(condition);
      return NextResponse.json(services, { status: 200 });
    } else {
      const newService = await prisma.services.create({ data: body });
      return NextResponse.json(newService, { status: 200 });
    }
  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json({ error: 'Failed to create service' }, { status: 500 });
  }
} 