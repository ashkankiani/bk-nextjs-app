import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/client';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    const userId = parseInt(id);
    const reservations = await prisma.reservations.findMany({ where: { userId } });
    if (reservations.length === 0) {
      return NextResponse.json({ message: 'کاربر دارای رزرو نمی باشد و میتوانید کاربر را حذف نمایید.' }, { status: 200 });
    }
    let userIds = reservations.map(item => item.userId);
    let orderIds = reservations.map(item => item.orderId);
    let paymentIds = reservations.map(item => item.paymentId);
    let transactionIds = reservations.filter(item => item.transactionId !== null).map(item => item.transactionId);
    const transactionOperations: any[] = [
      prisma.reservations.deleteMany({ where: { id: { in: userIds } } }),
      prisma.orders.deleteMany({ where: { id: { in: orderIds } } }),
      prisma.payments.deleteMany({ where: { id: { in: paymentIds } } }),
    ];
    if (transactionIds.length > 0) {
      transactionOperations.push(prisma.transaction.deleteMany({ where: { id: { in: transactionIds } } }));
    }
    await prisma.$transaction(transactionOperations);
    return NextResponse.json({ message: 'رزروهای کاربر با موفقیت حذف شدند.' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete reservation' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    const reserveId = parseInt(id);
    const reservation = await prisma.reservations.findUnique({ where: { id: reserveId } });
    if (!reservation) return NextResponse.json({ error: 'Reservation not found' }, { status: 404 });
    const { orderId, paymentId, transactionId } = reservation;
    const transactionOperations: any[] = [
      prisma.reservations.delete({ where: { id: reserveId } }),
      prisma.orders.delete({ where: { id: orderId } }),
      prisma.payments.delete({ where: { id: paymentId } }),
    ];
    if (transactionId) {
      transactionOperations.push(prisma.transaction.delete({ where: { id: transactionId } }));
    }
    await prisma.$transaction(transactionOperations);
    return NextResponse.json({ message: 'رزرو با موفقیت حذف شدند.' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete reservation' }, { status: 500 });
  }
} 