import { NextResponse } from 'next/server'
import { authenticate } from '@/app/lib/auth'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  const { email, password } = await request.json()

  const user = await authenticate(email, password)

  if (user) {
    // Set a cookie to maintain the session
    cookies().set('user_id', user.id, { httpOnly: true, secure: true })
    return NextResponse.json({ success: true })
  } else {
    return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 })
  }
}