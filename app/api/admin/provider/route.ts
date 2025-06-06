import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/client';

function parseQueryParams(url: string) {
  const params = new URL(url).searchParams;
  const query: Record<string, any> = {};
  params.forEach((value, key) => {
    query[key] = Number(value);
  });
  return query;
}

export async function GET(req: NextRequest) {
  try {
    const query = parseQueryParams(req.url);
    const where = Object.keys(query).length ? { where: query } : {};
    const providers = await prisma.providers.findMany({
      ...where,
      include: {
        service: { select: { id: true, name: true, price: true } },
        user: { select: { fullName: true } },
      },
    });
    return NextResponse.json(providers, { status: 200 });
  } catch (error) {
    console.error('Error fetching providers:', error);
    return NextResponse.json({ error: 'Failed to fetch providers' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { type, how, condition, ...body } = await req.json();
    if (type === 'condition') {
      if (how === 'findMany') {
        const providers = await prisma.providers.findMany(condition);
        return NextResponse.json(providers, { status: 200 });
      } else {
        const provider = await prisma.providers.findUnique(condition);
        return NextResponse.json(provider, { status: 200 });
      }
    } else {
      const newProvider = await prisma.providers.create({ data: body });
      return NextResponse.json(newProvider, { status: 200 });
    }
  } catch (error) {
    console.error('Error creating/finding provider:', error);
    return NextResponse.json({ error: 'Failed to process provider request' }, { status: 500 });
  }
} 