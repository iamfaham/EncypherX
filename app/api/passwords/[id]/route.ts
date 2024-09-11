import { NextResponse } from 'next/server'
import prisma from '@/app/lib/prisma'
import { cookies } from 'next/headers'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const userId = cookies().get('user_id')?.value
  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const password = await prisma.password.findUnique({
      where: {
        id: params.id,
        userId: userId,
      },
      select: {
        password: true,
      },
    })

    if (!password) {
      return NextResponse.json({ message: 'Password not found' }, { status: 404 })
    }

    return NextResponse.json({ password: password.password })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: 'Something went wrong', error: error.message }, { status: 400 })
    }
    return NextResponse.json({ message: 'Something went wrong' }, { status: 400 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const userId = cookies().get('user_id')?.value
  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const password = await prisma.password.findUnique({
      where: { id: params.id },
    })

    if (!password || password.userId !== userId) {
      return NextResponse.json({ message: 'Password not found' }, { status: 404 })
    }

    await prisma.password.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Password deleted successfully' })
  } catch (error) {
    if (error instanceof Error) {
      console.error('Failed to delete password:', error.message)
      return NextResponse.json({ message: 'Failed to delete password', error: error.message }, { status: 500 })
    }
    console.error('Failed to delete password:', error)
    return NextResponse.json({ message: 'Failed to delete password' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const userId = cookies().get('user_id')?.value
  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { title, username, password, url } = await request.json()

    const existingPassword = await prisma.password.findUnique({
      where: { id: params.id },
    })

    if (!existingPassword || existingPassword.userId !== userId) {
      return NextResponse.json({ message: 'Password not found' }, { status: 404 })
    }

    const updatedPassword = await prisma.password.update({
      where: { id: params.id },
      data: { title, username, password, url },
    })

    return NextResponse.json(updatedPassword)
  } catch (error) {
    if (error instanceof Error) {
      console.error('Failed to update password:', error.message)
      return NextResponse.json({ message: 'Failed to update password', error: error.message }, { status: 500 })
    }
    console.error('Failed to update password:', error)
    return NextResponse.json({ message: 'Failed to update password' }, { status: 500 })
  }
}
