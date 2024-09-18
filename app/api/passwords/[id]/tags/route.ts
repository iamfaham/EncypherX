import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { cookies } from 'next/headers'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const userId = cookies().get('user_id')?.value
  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const { id } = params
  const { name } = await request.json()

  try {
    const password = await prisma.password.findUnique({
      where: { id, userId },
    })

    if (!password) {
      return NextResponse.json({ message: 'Password not found' }, { status: 404 })
    }

    const tag = await prisma.tag.upsert({
      where: { name_userId: { name, userId } },
      update: {},
      create: { name, userId },
    })

    await prisma.password.update({
      where: { id },
      data: { tags: { connect: { id: tag.id } } },
    })

    return NextResponse.json({ message: 'Tag added successfully', tag })
  } catch (error) {
    console.error('Failed to add tag:', error)
    return NextResponse.json({ message: 'Failed to add tag' }, { status: 500 })
  }
}