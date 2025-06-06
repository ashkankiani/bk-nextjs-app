import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/client';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    const service = await prisma.services.findUnique({
      where: { id: parseInt(id) },
    });
    return NextResponse.json(service, { status: 200 });
  } catch (error) {
    console.error('Error fetching service:', error);
    return NextResponse.json({ error: 'Failed to fetch service' }, { status: 500 });
  }
}

async function updateService(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const body = await req.json();
    const updateService = await prisma.services.update({
      data: body,
      where: { id: parseInt(id) },
    });
    return NextResponse.json(updateService, { status: 200 });
  } catch (error) {
    console.error('Error updating service:', error);
    return NextResponse.json({ error: 'Failed to update service' }, { status: 500 });
  }
}

export const PUT = updateService;
export const PATCH = updateService;

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    await prisma.services.delete({
      where: { id: parseInt(id) },
    });
    return NextResponse.json({ message: 'Deleted successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Error deleting service:', error);
    if (error.meta && error.meta.field_name === 'serviceId') {
      return NextResponse.json({ error: 'ابتدا ارائه دهنده متصل به سرویس را حذف کنید.' }, { status: 400 });
    } else {
      return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 });
    }
  }
} 