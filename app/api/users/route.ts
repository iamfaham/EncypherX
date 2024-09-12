import { NextResponse } from 'next/server'
import prisma from '@/app/lib/prisma'
import bcrypt from 'bcrypt'

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json()

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })

    return NextResponse.json({ 
      message: 'User created successfully', 
      user: { id: user.id, name: user.name, email: user.email } 
    }, { status: 201 })
  } catch (error) {
    if (error instanceof Error) {
      console.error('Failed to update password:', error.message)
      return NextResponse.json({ message: 'Something went wrong', error: error.message }, { status: 400 })
    }
  }
}