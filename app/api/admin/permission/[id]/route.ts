import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/client';

async function updatePermission(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const body = await req.json();
    const updatedPermission = await prisma.permissions.update({
      data: body,
      where: { id: parseInt(id) },
    });
    return NextResponse.json(updatedPermission, { status: 200 });
  } catch (error) {
    console.error('Error updating permission:', error);
    return NextResponse.json({ error: 'Failed to update permission' }, { status: 500 });
  }
}

export const PUT = updatePermission;
export const PATCH = updatePermission; 