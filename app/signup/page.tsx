import RegisterForm from '@/components/RegisterForm'
import { Card, CardContent,CardTitle,CardDescription,CardHeader,CardFooter } from '@/components/ui/card'
import Link from 'next/link'

export default function RegisterPage() {
  return (
<div className="min-h-screen bg- flex items-center justify-center bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 bg-black">
      <Card className="w-[350px] bg-white rounded-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-black text-center">Signup to EncypherX</CardTitle>
          <CardDescription className="text-slate-800/50 text-center">
            Please provide the below details for setup
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RegisterForm />
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-[#333333]">
            Already have an account?{' '}
            <Link href="/login" className="text-slate-500 hover:underline">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}