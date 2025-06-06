import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/client';

export async function GET(req: NextRequest) {
  try {
    const connections = await prisma.connections.findMany();
    return NextResponse.json(connections, { status: 200 });
  } catch (error) {
    console.error('Error fetching connections:', error);
    return NextResponse.json({ error: 'Failed to fetch connections' }, { status: 500 });
  }
}

async function upsertConnection(req: NextRequest) {
  try {
    const body = await req.json();
    const connection = await prisma.connections.upsert({
      where: { id: 1 },
      update: body,
      create: body,
    });
    return NextResponse.json(connection, { status: 200 });
  } catch (error) {
    console.error('Error updating connection:', error);
    return NextResponse.json({ error: 'Failed to update connection' }, { status: 500 });
  }
}

export const PUT = upsertConnection;
export const PATCH = upsertConnection; 