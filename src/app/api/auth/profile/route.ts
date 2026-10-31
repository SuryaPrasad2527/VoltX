import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser, hashPassword, comparePassword } from '@/lib/auth';
import { findUserById, updateUser, findUserByEmail } from '@/lib/db';

export async function PUT(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, phone, addresses, currentPassword, newPassword } = await req.json();

    const updatePayload: any = {};
    if (name) updatePayload.name = name;
    if (phone !== undefined) updatePayload.phone = phone;
    if (addresses) updatePayload.addresses = addresses;

    // Handle password change if requested
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json({ error: 'Current password is required to change password' }, { status: 400 });
      }
      const fullUser = await findUserByEmail(session.email);
      if (!fullUser) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      const match = await comparePassword(currentPassword, fullUser.passwordHash);
      if (!match) {
        return NextResponse.json({ error: 'Incorrect current password' }, { status: 400 });
      }

      if (newPassword.length < 6) {
        return NextResponse.json({ error: 'New password must be at least 6 characters' }, { status: 400 });
      }

      updatePayload.passwordHash = await hashPassword(newPassword);
    }

    const updatedUser = await updateUser(session.id, updatePayload);

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Profile update failed' }, { status: 500 });
  }
}
