import Link from 'next/link'

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-center mb-4">Password Manager</h1>
      <div className="flex justify-center space-x-4">
        <Link href="/register" className="text-blue-500 hover:underline">Register</Link>
        <Link href="/login" className="text-blue-500 hover:underline">Login</Link>
      </div>
    </main>
  )
}