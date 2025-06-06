import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/client';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    const timeSheet = await prisma.timeSheets.findMany({
      where: { providerId: parseInt(id) },
    });
    return NextResponse.json(timeSheet, { status: 200 });
  } catch (error) {
    console.error('Error fetching timeSheets:', error);
    return NextResponse.json({ error: 'Failed to fetch timeSheet' }, { status: 500 });
  }
}

async function updateTimeSheet(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const body = await req.json();
    const updateTimeSheet = await prisma.timeSheets.update({
      data: body,
      where: { id: parseInt(id) },
    });
    return NextResponse.json(updateTimeSheet, { status: 200 });
  } catch (error) {
    console.error('Error updating timeSheet:', error);
    return NextResponse.json({ error: 'Failed to update timeSheet' }, { status: 500 });
  }
}

export const PUT = updateTimeSheet;
export const PATCH = updateTimeSheet;

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    await prisma.timeSheets.delete({
      where: { id: parseInt(id) },
    });
    return NextResponse.json({ message: 'Deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting timeSheet:', error);
    return NextResponse.json({ error: 'Failed to delete timeSheet' }, { status: 500 });
  }
} 