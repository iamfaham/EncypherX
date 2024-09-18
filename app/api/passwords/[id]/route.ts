import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { cookies } from 'next/headers'
import { encrypt, decrypt } from '@/lib/encryption'
import { Prisma } from '@prisma/client'

type PasswordWithSharedStatus = {
  isShared: boolean
  sharedBy?: { id: string; email: string } // Optional since it's only present if shared
} & Awaited<ReturnType<typeof prisma.password.findFirst>> // Extends the Prisma model
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const userId = cookies().get('user_id')?.value;

  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;

  try {
    // First, try to find the password owned by the user
    const password = await prisma.password.findFirst({
      where: {
        id: id,
        userId: userId,
      },
      include: {
        tags: true,
        sharedWith: {
          include: {
            sharedWith: {
              select: {
                id: true,
                email: true,
              },
            },
          },
        },
      },
    });

    let passwordWithSharedStatus: PasswordWithSharedStatus | null = null;

    // If not found, check if it's a shared password
    if (!password) {
      const sharedPassword = await prisma.sharedPassword.findFirst({
        where: {
          passwordId: id,
          userId: userId,
        },
        include: {
          password: {
            include: {
              tags: true,
              user: {
                select: {
                  id: true,
                  email: true,
                },
              },
            },
          },
        },
      });

      if (sharedPassword) {
        passwordWithSharedStatus = {
          ...sharedPassword.password,
          isShared: true,
          sharedBy: sharedPassword.password.user, // Added sharedBy
        };
      }
    } else {
      passwordWithSharedStatus = {
        ...password,
        isShared: false, // If password is found directly
      };
    }

    if (!passwordWithSharedStatus) {
      return NextResponse.json({ message: 'Password not found' }, { status: 404 });
    }

    // Decrypt the password before sending it to the client
    const decryptedPassword = {
      ...passwordWithSharedStatus,
      password: decrypt(passwordWithSharedStatus.password), // Ensure decrypt is correctly typed
    };

    return NextResponse.json(decryptedPassword);
  } catch (error) {
    console.error('Failed to fetch password:', error);
    return NextResponse.json({ message: 'Failed to fetch password' }, { status: 500 });
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
    // Check if the user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    const { title, username, password, url } = await request.json()

    const existingPassword = await prisma.password.findUnique({
      where: { id: params.id },
      include: { sharedWith: true }
    })

    if (!existingPassword || existingPassword.userId !== userId) {
      return NextResponse.json({ message: 'Password not found' }, { status: 404 })
    }

    let encryptedPassword;
    try {
      encryptedPassword = encrypt(password);
      console.log('encrypted', encryptedPassword)
    } catch (encryptError) {
      console.error('Encryption error:', encryptError);
      return NextResponse.json({ message: 'Failed to encrypt password' }, { status: 500 })
    }

    const updatedPassword = await prisma.password.update({
      where: { id: params.id },
      data: { 
        title, 
        username, 
        password: encryptedPassword,
        url 
      },
      include: { 
        sharedWith: { 
          select: { 
            userId: true,
            sharedWith: {
              select: {
                email: true
              }
            }
          } 
        },
        tags: true
      }
    })

    // If the password is shared, update the SharedPassword entries
    if (updatedPassword.sharedWith.length > 0) {
      await prisma.sharedPassword.updateMany({
        where: { passwordId: params.id },
        data: { updatedAt: new Date() }
      })
    }

    // Prepare the response data
    const responseData = {
      ...updatedPassword,
      password: decrypt(updatedPassword.password),
      sharedWith: updatedPassword.sharedWith.map(share => ({
        id: share.userId,
        email: share.sharedWith.email
      }))
    }

    return NextResponse.json(responseData)
  } catch (error) {
    if (error instanceof Error) {
      console.error('Failed to update password:', error);
      return NextResponse.json({ message: 'Failed to update password', error: error.message }, { status: 500 })
    }
    return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 })
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

  const { id } = params

  try {
    // First, check if the password exists and belongs to the user
    const password = await prisma.password.findUnique({
      where: {
        id: id,
        userId: userId,
      },
    })

    if (!password) {
      return NextResponse.json({ message: 'Password not found or does not belong to the user' }, { status: 404 })
    }

    // Delete all related SharedPassword entries
    await prisma.sharedPassword.deleteMany({
      where: {
        passwordId: id,
      },
    })

    // Delete the password
    await prisma.password.delete({
      where: {
        id: id,
      },
    })

    return NextResponse.json({ message: 'Password deleted successfully' })
  } catch (error) {
    console.error('Failed to delete password:', error)

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json({ message: 'Password not found' }, { status: 404 })
      }
      return NextResponse.json({ message: 'Database error', error: error.message }, { status: 500 })
    }

    if (error instanceof Prisma.PrismaClientValidationError) {
      return NextResponse.json({ message: 'Invalid data provided', error: error.message }, { status: 400 })
    }

    return NextResponse.json({ message: 'An unexpected error occurred', error: 'Internal server error' }, { status: 500 })
  }
}