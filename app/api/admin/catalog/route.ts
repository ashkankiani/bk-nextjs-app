import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/client';

export async function GET(req: NextRequest) {
  try {
    const catalogs = await prisma.catalogs.findMany();
    return NextResponse.json(catalogs, { status: 200 });
  } catch (error) {
    console.error('Error fetching catalogs:', error);
    return NextResponse.json({ error: 'Failed to fetch catalogs' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newCatalog = await prisma.catalogs.create({
      data: body,
    });
    const newPermission = await prisma.permissions.create({
      data: { catalogId: newCatalog.id },
    });
    return NextResponse.json(newPermission, { status: 200 });
  } catch (error) {
    console.error('Error creating catalog or permission:', error);
    return NextResponse.json({ error: 'Failed to create catalog or permission' }, { status: 500 });
  }
} 