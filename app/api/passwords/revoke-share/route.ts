import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  const userId = cookies().get('user_id')?.value
  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { passwordId, sharedWithUserId } = await request.json()

    if (!passwordId || !sharedWithUserId) {
      return NextResponse.json({ message: 'Missing required parameters: passwordId or sharedWithUserId' }, { status: 400 })
    }

    console.log(`Attempting to revoke access. PasswordId: ${passwordId}, SharedWithUserId: ${sharedWithUserId}, CurrentUserId: ${userId}`);

    // Check if the password belongs to the current user
    const password = await prisma.password.findUnique({
      where: { id: passwordId, userId: userId },
    })

    if (!password) {
      console.log(`Password not found. PasswordId: ${passwordId}, UserId: ${userId}`);
      return NextResponse.json({ message: 'Password not found' }, { status: 404 })
    }

    // Check if the shared password entry exists before attempting to delete
    const existingShare = await prisma.sharedPassword.findFirst({
      where: {
        passwordId: passwordId,
        userId: sharedWithUserId,
      },
    })

    if (!existingShare) {
      console.log(`No shared password entry found. PasswordId: ${passwordId}, SharedWithUserId: ${sharedWithUserId}`);
      return NextResponse.json({ message: 'No shared password entry found to revoke' }, { status: 404 })
    }

    // Delete the shared password entry
    const deletedShare = await prisma.sharedPassword.delete({
      where: {
        id: existingShare.id,
      },
    })

    console.log(`Shared password entry deleted. DeletedShare:`, deletedShare);

    return NextResponse.json({ message: 'Access revoked successfully' })
  } catch (error) {
    console.error('Failed to revoke access:', error)
    return NextResponse.json({ message: 'Failed to revoke access', error: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
}