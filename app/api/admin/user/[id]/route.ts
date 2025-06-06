import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/client';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    const user = await prisma.users.findUnique({
      where: { codeMeli: id },
    });
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}

async function updateUser(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const body = await req.json();
    const updateUser = await prisma.users.update({
      data: body,
      where: { codeMeli: id },
    });
    return NextResponse.json(updateUser, { status: 200 });
  } catch (error: any) {
    console.error('Error updating user:', error);
    let myError = error?.meta?.target;
    let message = '';
    switch (myError) {
      case 'Users_codeMeli_key':
        message = 'کاربری با این کدملی وجود دارد.';
        break;
      case 'Users_mobile_key':
        message = 'کاربری با این موبایل وجود دارد.';
        break;
      case 'Users_email_key':
        message = 'کاربری با این ایمیل وجود دارد.';
        break;
      default:
        message = 'Failed to update';
    }
    if (message !== 'Failed to update') {
      return NextResponse.json({ error: message }, { status: 400 });
    } else {
      return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
    }
  }
}

export const PUT = updateUser;
export const PATCH = updateUser;

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    await prisma.users.delete({
      where: { codeMeli: id },
    });
    return NextResponse.json({ message: 'Deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
} 