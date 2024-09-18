import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { cookies } from 'next/headers'


export async function POST(request: Request) {
  const userId = cookies().get('user_id')?.value
  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { title, username, password, url, notes } = await request.json()
    
    // Validate required fields
    if (!title || !username || !password) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 })
    }

    // Create the new password entry
    const newPassword = await prisma.password.create({
      data: {
        title,
        username,
        password,
        url,
        notes,
        userId,
      },
    })

    return NextResponse.json({ message: 'Password added successfully', password: newPassword })
  } catch (error) {
    console.error('Failed to add password:', error)
    return NextResponse.json({ message: 'Failed to add password', error: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
}

export async function GET() {
  const userId = cookies().get('user_id')?.value
  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const ownedPasswords = await prisma.password.findMany({
      where: { userId },
      include: {
        tags: true,
        sharedWith: {
          include: {
            sharedWith: {
              select: {
                id: true,
                email: true,
              }
            }
          }
        }
      }
    })

    const sharedPasswords = await prisma.sharedPassword.findMany({
      where: { userId },
      include: {
        password: {
          include: {
            tags: true,
            user: {
              select: {
                id: true,
                email: true,
              }
            }
          }
        }
      }
    })

    const formattedOwnedPasswords = ownedPasswords.map(p => ({
      ...p,
      isShared: false,
      sharedBy: null
    }))

    const formattedSharedPasswords = sharedPasswords.map(sp => ({
      ...sp.password,
      isShared: true,
      sharedBy: sp.password.user
    }))

    const allPasswords = [...formattedOwnedPasswords, ...formattedSharedPasswords]

    return NextResponse.json(allPasswords)
  } catch (error) {
    console.error('Failed to fetch passwords:', error)
    return NextResponse.json({ message: 'Failed to fetch passwords' }, { status: 500 })
  }
}
  