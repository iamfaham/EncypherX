import { NextResponse } from 'next/server'
import prisma from '@/app/lib/prisma'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  const userId = cookies().get('user_id')?.value
  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { title, username, password, url } = await request.json()

    const newPassword = await prisma.password.create({
      data: {
        title,
        username,
        password,
        url,
        userId,
      },
    })

    return NextResponse.json({ message: 'Password added successfully', password: newPassword }, { status: 201 })
  } catch (error:any) {
    return NextResponse.json({ message: 'Something went wrong', error: error.message }, { status: 400 })
  }
}

export async function GET() {
  const userId = cookies().get('user_id')?.value
  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const passwords = await prisma.password.findMany({
      where: { userId },
      select: { id: true, title: true, username: true, url: true },
    })

    return NextResponse.json(passwords)
  } catch (error:any) {
    return NextResponse.json({ message: 'Something went wrong', error: error.message }, { status: 400 })
  }
}