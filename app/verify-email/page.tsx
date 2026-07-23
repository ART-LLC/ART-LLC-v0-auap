'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { verifyEmailAction } from '@/app/actions/auth-actions'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import Link from 'next/link'
import { CheckCircle, AlertCircle } from 'lucide-react'

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')

  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying')
  const [message, setMessage] = useState<string>('')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setMessage('No verification token provided')
      return
    }

    const verify = async () => {
      try {
        const result = await verifyEmailAction({ token })
        setStatus('success')
        setMessage('Email verified successfully! You can now sign in to your account.')
      } catch (error) {
        setStatus('error')
        setMessage(error instanceof Error ? error.message : 'Verification failed')
      }
    }

    verify()
  }, [token])

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-background px-4 py-20">
        <Card className="w-full max-w-md p-8 border border-white/10 bg-white/5">
          {status === 'verifying' && (
            <div className="text-center space-y-4">
              <div className="flex justify-center mb-4">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-400"></div>
              </div>
              <h1 className="text-2xl font-bold text-foreground">Verifying...</h1>
              <p className="text-foreground/60">Please wait while we verify your email</p>
            </div>
          )}

          {status === 'success' && (
            <div className="text-center space-y-4">
              <CheckCircle className="w-12 h-12 text-green-400 mx-auto" />
              <h1 className="text-2xl font-bold text-foreground">Email Verified!</h1>
              <p className="text-foreground/60">{message}</p>
              <Link href="/sign-in" className="block mt-6">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Sign In to Your Account
                </Button>
              </Link>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center space-y-4">
              <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
              <h1 className="text-2xl font-bold text-foreground">Verification Failed</h1>
              <p className="text-foreground/60">{message}</p>
              <div className="space-y-2 mt-6">
                <Link href="/sign-up" className="block">
                  <Button variant="outline" className="w-full">
                    Try Signing Up Again
                  </Button>
                </Link>
                <Link href="/" className="block">
                  <Button variant="outline" className="w-full">
                    Back to Home
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </Card>
      </div>
      <Footer />
    </>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <Card className="w-full max-w-md p-8 border border-white/10 bg-white/5">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-4"></div>
              <p className="text-foreground/60">Loading...</p>
            </div>
          </Card>
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  )
}
