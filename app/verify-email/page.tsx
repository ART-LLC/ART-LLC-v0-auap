'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { verifyEmailAction } from '@/app/actions/auth-actions'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import Link from 'next/link'

export default function VerifyEmailPage() {
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
      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-b from-background to-background/80">
        <Card className="w-full max-w-md p-6 border border-white/10 bg-white/5">
          {status === 'verifying' && (
            <div className="text-center">
              <div className="mb-6">
                <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-400 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
              </div>
              <h1 className="text-2xl font-semibold text-foreground mb-2">Verifying Email</h1>
              <p className="text-sm text-muted-foreground">Please wait while we verify your email...</p>
            </div>
          )}

          {status === 'success' && (
            <div className="text-center">
              <div className="mb-6">
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <h1 className="text-2xl font-semibold text-green-400 mb-2">Email Verified</h1>
              <p className="text-sm text-muted-foreground mb-6">{message}</p>
              
              <Link href="/sign-in">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium">
                  Sign In to Your Account
                </Button>
              </Link>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center">
              <div className="mb-6">
                <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <h1 className="text-2xl font-semibold text-red-400 mb-2">Verification Failed</h1>
              <p className="text-sm text-muted-foreground mb-6">{message}</p>
              
              <div className="space-y-3">
                <Link href="/sign-up">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium">
                    Try Signing Up Again
                  </Button>
                </Link>
                <Link href="/">
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
