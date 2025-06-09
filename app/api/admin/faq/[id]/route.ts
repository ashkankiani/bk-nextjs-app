// فایل حذف شود
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/client';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    const faq = await prisma.faqs.findUnique({
      where: { id: parseInt(id) },
    });
    return NextResponse.json(faq, { status: 200 });
  } catch (error) {
    console.error('Error fetching FAQ:', error);
    return NextResponse.json({ error: 'Failed to fetch FAQ' }, { status: 500 });
  }
}

async function updateFaq(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const body = await req.json();
    const updatedFaq = await prisma.faqs.update({
      data: body,
      where: { id: parseInt(id) },
    });
    return NextResponse.json(updatedFaq, { status: 200 });
  } catch (error) {
    console.error('Error updating FAQ:', error);
    return NextResponse.json({ error: 'Failed to update FAQ' }, { status: 500 });
  }
}

export const PUT = updateFaq;
export const PATCH = updateFaq;

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    await prisma.faqs.delete({
      where: { id: parseInt(id) },
    });
    return NextResponse.json({ message: 'Deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting FAQ:', error);
    return NextResponse.json({ error: 'Failed to delete FAQ' }, { status: 500 });
  }
} 