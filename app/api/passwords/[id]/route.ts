import { NextResponse } from 'next/server'
import prisma from '@/app/lib/prisma'
import { cookies } from 'next/headers'
import { encrypt, decrypt } from '@/app/lib/encryption'

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
    })

    if (!password) {
      return NextResponse.json({ message: 'Password not found' }, { status: 404 })
    }

    let decryptedPassword = password.password;
    try {
      decryptedPassword = decrypt(password.password);
    } catch (decryptError) {
      console.error('Failed to decrypt password:', decryptError);
      // We're not returning an error here, instead we'll send the original password
      // This allows the frontend to still display something, even if decryption failed
    }

    return NextResponse.json({ 
      ...password, 
      password: decryptedPassword
    })
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error retrieving password:', error);
      return NextResponse.json({ message: 'Something went wrong', error: error.message }, { status: 500 })
    }
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
      include: { sharedWith: { select: { userId: true } } }
    })

    // If the password is shared, update the SharedPassword entries
    if (updatedPassword.sharedWith.length > 0) {
      await prisma.sharedPassword.updateMany({
        where: { passwordId: params.id },
        data: { updatedAt: new Date() }
      })
    }

    return NextResponse.json({
      ...updatedPassword,
      password: decrypt(updatedPassword.password)
    })
  } catch (error) {
    if (error instanceof Error) {
      console.error('Failed to update password:', error);
      return NextResponse.json({ message: 'Failed to update password', error: error.message }, { status: 500 })
    }
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
    // First, delete all related SharedPassword entries
    await prisma.sharedPassword.deleteMany({
      where: {
        passwordId: id,
      },
    })

    // Then, delete the password
    const deletedPassword = await prisma.password.delete({
      where: {
        id: id,
        userId: userId, // Ensure the password belongs to the current user
      },
    })

    if (!deletedPassword) {
      return NextResponse.json({ message: 'Password not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Password deleted successfully' })
  } catch (error) {
    if (error instanceof Error) {
      console.error('Failed to delete password:', error)
      return NextResponse.json({ message: 'Failed to delete password', error: error.message }, { status: 500 })
    }
  }
}