import { NextResponse } from 'next/server'
import prisma from '@/app/lib/prisma'
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
    const passwords = await prisma.password.findMany({
      where: { userId },
      select: {
        id: true,
        title: true,
        username: true,
        url: true,
        sharedWith: {
          select: {
            id: true,
            passwordId: true,
            userId: true,
            createdAt: true,
            updatedAt: true,
          }
        },
        tags: {
          select: {
            id: true,
            name: true,
          }
        }
      },
    })

    // Fetch emails for all shared users
    const sharedUserIds = passwords.flatMap(password => 
      password.sharedWith.map(share => share.userId)
    )
    const userEmails = await prisma.user.findMany({
      where: { id: { in: sharedUserIds } },
      select: { id: true, email: true }
    })

    // Create a map of user IDs to emails for quick lookup
    const emailMap = new Map(userEmails.map(user => [user.id, user.email]))

    // Format the passwords with shared user emails
    const formattedPasswords = passwords.map(password => ({
      ...password,
      sharedWith: password.sharedWith.map(share => ({
        ...share,
        email: emailMap.get(share.userId) || null
      }))
    }))

    return NextResponse.json(formattedPasswords)
  } catch (error) {
    if (error instanceof Error) {
      console.error('Failed to fetch passwords:', error.message)
      return NextResponse.json({ message: 'Something went wrong', error: error.message }, { status: 400 })
    }
  }
}

    // export async function POST(request: Request) {
    //   const userId = cookies().get('user_id')?.value
    //   if (!userId) {
    //     return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    //   }
    
    //   try {
    //     const { passwordId, email } = await request.json()
    
    //     // Check if the password belongs to the current user
    //     const password = await prisma.password.findUnique({
    //       where: { id: passwordId, userId: userId },
    //     })
    
    //     if (!password) {
    //       return NextResponse.json({ message: 'Password not found' }, { status: 404 })
    //     }
    
    //     // Find the user to share with
    //     const userToShareWith = await prisma.user.findUnique({
    //       where: { email },
    //     })
    
    //     if (!userToShareWith) {
    //       return NextResponse.json({ message: 'User not found' }, { status: 404 })
    //     }
    
    //     // Check if the password is already shared with this user
    //     const existingShare = await prisma.sharedPassword.findUnique({
    //       where: {
    //         passwordId_userId: {
    //           passwordId: passwordId,
    //           userId: userToShareWith.id,
    //         },
    //       },
    //     })
    
    //     if (existingShare) {
    //       return NextResponse.json({ message: 'Password already shared with this user' }, { status: 400 })
    //     }
    
    //     // Create the shared password entry
    //     const sharedPassword = await prisma.sharedPassword.create({
    //       data: {
    //         passwordId,
    //         userId: userToShareWith.id,
    //       },
    //     })
    
    //     return NextResponse.json({ message: 'Password shared successfully', sharedPassword })
    //   } catch (error) {
    //     if (error instanceof Error) {
    //       console.error('Failed to share password:', error)
    //       return NextResponse.json({ message: 'Failed to share password', error: error.message }, { status: 500 })
    //     }
    //   }
    // }