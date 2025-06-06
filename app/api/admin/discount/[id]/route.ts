import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/client';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    const discount = await prisma.discounts.findUnique({
      where: { id: parseInt(id) },
    });
    return NextResponse.json(discount, { status: 200 });
  } catch (error) {
    console.error('Error fetching discount:', error);
    return NextResponse.json({ error: 'Failed to fetch discount' }, { status: 500 });
  }
}

async function updateDiscount(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const body = await req.json();
    const updatedDiscount = await prisma.discounts.update({
      data: body,
      where: { id: parseInt(id) },
    });
    return NextResponse.json(updatedDiscount, { status: 200 });
  } catch (error) {
    console.error('Error updating discount:', error);
    return NextResponse.json({ error: 'Failed to update discount' }, { status: 500 });
  }
}

export const PUT = updateDiscount;
export const PATCH = updateDiscount;

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    await prisma.discounts.delete({
      where: { id: parseInt(id) },
    });
    return NextResponse.json({ message: 'Deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting discount:', error);
    return NextResponse.json({ error: 'Failed to delete discount' }, { status: 500 });
  }
} 