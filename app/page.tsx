'use client'

import Link from 'next/link'
import React from "react";
import FeatureCard from '@/components/FeatureCard';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Key, Share2, RefreshCw } from 'lucide-react'
import { TextHoverEffect } from '@/components/ui/text-hover-effect';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
      <header className="container mx-auto px-4 py-4">
        <nav className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">EncypherX</h1>
          <div className="space-x-4">
            <Button variant="ghost" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Sign Up</Link>
            </Button>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-4">
        <section>
          <div className="h-[40rem] flex items-center justify-center -z-10">
            <div className='bg-slate-100/10 absolute text-center top-[18rem] rounded-2xl px-3 pb-3 backdrop-blur-sm border backdrop-opacity-85'>
              <h2 className=' text-6xl rounded-3xl p-2 text-slate-700'>Secure Your Digital Life</h2>
              <p className=' text-xl text-gray-400 '>Manage all your passwords in one secure place. Easy to use, not so easy to crack.</p>
            </div>
            <TextHoverEffect text="ENCYX" />
          </div>
        </section>

        <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <FeatureCard
            icon={<Shield className="h-12 w-12 text-primary" />}
            title="Bank-Level Security"
            description="Your data is encrypted with AES-256, the same standard used by banks and governments."
          />
          <FeatureCard
            icon={<Key className="h-12 w-12 text-primary" />}
            title="Password Generator"
            description="Create strong, unique passwords for all your accounts with our built-in generator."
          />
          <FeatureCard
            icon={<Share2 className="h-12 w-12 text-primary" />}
            title="Secure Sharing"
            description="Safely share passwords with family or team members without compromising security."
          />
          <FeatureCard
            icon={<RefreshCw className="h-12 w-12 text-primary" />}
            title="Auto-Sync"
            description="Your passwords are automatically synced across all your devices in real-time."
          />
        </section>

        <section className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Your Security is Our Priority</h2>
          <p className="text-lg mb-8 text-muted-foreground max-w-2xl mx-auto">
            We use state-of-the-art encryption to ensure your data remains private and secure.
            Your master password is never stored or transmitted, giving you complete control.
          </p>
          {/* <Button variant="outline" size="lg" disabled={isDisabled} asChild>
            <Link href="/security">
              Learn More About Our Security
            </Link>
          </Button> */}
        </section>

        <section className="text-center">
          <Card className="max-w-2xl mx-auto border-2 border-slate-300 rounded-xl">
            <CardHeader>
              <CardTitle>Ready to Secure Your Passwords?</CardTitle>
              <CardDescription>Join thousands of users who trust SecurePass</CardDescription>
            </CardHeader>
            <CardContent>
              <Button size="lg" className=" rounded-2xl bg-slate-300/50" asChild>
                <Link href="/signup">Create Your Account</Link>
              </Button>
            </CardContent>
          </Card>
        </section>
      </main>

      <footer className="container mx-auto px-4 py-8 mt-16 dark:border-slate-700 border-t-2 border-slate-300">
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">© 2024 EncypherX. Project by <Link href={'https://iamfaham.netlify.app'} className='hover:text-blue-400'>@iamfaham</Link></p>
          <nav className="space-x-4">
            <Link href="/" className="text-sm text-muted-foreground hover:text-primary">Github</Link>
            <Link href="/" className="text-sm text-muted-foreground hover:text-primary">LinkedIn</Link>
            <Link href="/" className="text-sm text-muted-foreground hover:text-primary">X</Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}

