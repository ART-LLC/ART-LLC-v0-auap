'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signInAction } from '@/app/actions/auth-actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

export default function SignInPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    if (!formData.email || !formData.password) {
      setError('Email and password are required')
      setLoading(false)
      return
    }

    try {
      const result = await signInAction({
        email: formData.email,
        password: formData.password,
      })

      // Store session token in localStorage (in real app would use secure httpOnly cookies)
      if (result.sessionToken) {
        localStorage.setItem('auth-token', result.sessionToken)
        localStorage.setItem('user', JSON.stringify(result.user))
      }

      // Redirect to checkout or dashboard
      const redirectTo = new URLSearchParams(window.location.search).get('redirect') || '/'
      router.push(redirectTo)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-b from-background to-background/80">
        <Card className="w-full max-w-md p-6 border border-white/10 bg-white/5">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-foreground mb-1">Sign In</h1>
            <p className="text-sm text-muted-foreground">Access your AUAPW account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="text-sm font-medium text-foreground block mb-1">Email</label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="text-sm font-medium text-foreground block mb-1">Password</label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 flex gap-2">
                <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-red-300">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-white/10"></div>
            <span className="text-xs text-foreground/40">OR</span>
            <div className="flex-1 h-px bg-white/10"></div>
          </div>

          <Button variant="outline" className="w-full mb-2">
            Guest Checkout
          </Button>

          <p className="text-center text-sm text-foreground/60 mt-6">
            Don't have an account?{' '}
            <Link href="/sign-up" className="text-blue-400 hover:text-blue-300 font-medium">
              Create one
            </Link>
          </p>
        </Card>
      </div>
      <Footer />
    </>
  )
}
