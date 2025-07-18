import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/prisma/client'

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params
  try {
    await prisma.payments.delete({
      where: { id: parseInt(id) },
    })
    return NextResponse.json({ message: 'Deleted successfully' }, { status: 200 })
  } catch (error) {
    console.error('Error deleting payment:', error)
    return NextResponse.json({ error: 'Failed to delete payment' }, { status: 500 })
  }
}
