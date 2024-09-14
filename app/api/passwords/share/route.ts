import { NextResponse } from 'next/server'
import prisma from '@/app/lib/prisma'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  const userId = cookies().get('user_id')?.value
  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { passwordId, email } = await request.json()

    // Check if the password belongs to the current user
    const password = await prisma.password.findUnique({
      where: { id: passwordId, userId: userId },
    })

    if (!password) {
      return NextResponse.json({ message: 'Password not found' }, { status: 404 })
    }

    // Find the user to share with
    const userToShareWith = await prisma.user.findUnique({
      where: { email },
    })

    if (!userToShareWith) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    // Check if the password is already shared with this user
    const existingShare = await prisma.sharedPassword.findUnique({
      where: {
        passwordId_userId: {
          passwordId: passwordId,
          userId: userToShareWith.id,
        },
      },
    })

    if (existingShare) {
      return NextResponse.json({ message: 'Password already shared with this user' }, { status: 400 })
    }

    // Create the shared password entry
    const sharedPassword = await prisma.sharedPassword.create({
      data: {
        passwordId,
        userId: userToShareWith.id,
      },
    })

    return NextResponse.json({ message: 'Password shared successfully', sharedPassword })
  } catch (error) {
    if (error instanceof Error) {
      console.error('Failed to share password:', error)
      return NextResponse.json({ message: 'Failed to share password', error: error.message }, { status: 500 })
    }
  }
}