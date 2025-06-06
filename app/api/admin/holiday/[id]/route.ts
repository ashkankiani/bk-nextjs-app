import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/client';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    const holiday = await prisma.holidays.findUnique({
      where: { id: parseInt(id) },
    });
    return NextResponse.json(holiday, { status: 200 });
  } catch (error) {
    console.error('Error fetching holiday:', error);
    return NextResponse.json({ error: 'Failed to fetch holiday' }, { status: 500 });
  }
}

async function updateHoliday(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const body = await req.json();
    const updatedHoliday = await prisma.holidays.update({
      data: body,
      where: { id: parseInt(id) },
    });
    return NextResponse.json(updatedHoliday, { status: 200 });
  } catch (error) {
    console.error('Error updating holiday:', error);
    return NextResponse.json({ error: 'Failed to update holiday' }, { status: 500 });
  }
}

export const PUT = updateHoliday;
export const PATCH = updateHoliday;

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    await prisma.holidays.delete({
      where: { id: parseInt(id) },
    });
    return NextResponse.json({ message: 'Deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting holiday:', error);
    return NextResponse.json({ error: 'Failed to delete holiday' }, { status: 500 });
  }
} 