import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/client';

export async function GET(req: NextRequest) {
  try {
    const drafts = await prisma.draft.findMany({
      include: {
        service: true,
        provider: { include: { user: true } },
        user: true,
      },
    });
    return NextResponse.json(drafts, { status: 200 });
  } catch (error) {
    console.error('Error fetching drafts:', error);
    return NextResponse.json({ error: 'Failed to fetch drafts' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await prisma.draft.deleteMany();
    return NextResponse.json({ message: 'Deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting drafts:', error);
    return NextResponse.json({ error: 'Failed to delete drafts' }, { status: 500 });
  }
} 