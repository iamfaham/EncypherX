
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import LoginForm from '@/components/LoginForm'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg- flex items-center justify-center bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 bg-black">
      <Card className="w-[350px] bg-white rounded-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-black text-center">Login to EncypherX</CardTitle>
          <CardDescription className="text-slate-800/50 text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Link href="/forgot-password" className="text-sm text-slate-500 hover:underline">
            Forgot your password?
          </Link>
          <div className="text-sm text-[#333333]">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-slate-500 hover:underline">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}