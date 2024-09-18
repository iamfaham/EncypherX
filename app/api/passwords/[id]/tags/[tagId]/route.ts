import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { cookies } from 'next/headers'

export async function DELETE(
  request: Request,
  { params }: { params: { id: string; tagId: string } }
) {
  const userId = cookies().get('user_id')?.value
  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const { id, tagId } = params

  try {
    const password = await prisma.password.findUnique({
      where: { id, userId },
    })

    if (!password) {
      return NextResponse.json({ message: 'Password not found' }, { status: 404 })
    }

    await prisma.password.update({
      where: { id },
      data: { tags: { disconnect: { id: tagId } } },
    })

    return NextResponse.json({ message: 'Tag removed successfully' })
  } catch (error) {
    console.error('Failed to remove tag:', error)
    return NextResponse.json({ message: 'Failed to remove tag' }, { status: 500 })
  }
}