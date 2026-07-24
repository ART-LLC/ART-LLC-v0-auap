'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { ArrowRight, MessageSquare, X, Send, Clock, CheckCircle } from 'lucide-react'
import { useChat } from '@ai-sdk/react'

interface WebsiteLink {
  title: string
  description: string
  url: string
  category: 'product' | 'guide' | 'policy' | 'service' | 'tool' | 'category'
}

const SUGGESTIONS = [
  "What parts do you have for Acura?",
  "How much does shipping cost?",
  "Tell me about your warranty",
  "Can you help me find an engine?",
  "Show me your return policy",
  "Browse transmission parts",
]

function MessageBubble({ message }: { message: any }) {
  const isUser = message.role === 'user'

  // Collect website links from tool outputs
  const websiteLinks: WebsiteLink[] = []

  for (const part of message.parts ?? []) {
    if (
      typeof part.type === 'string' &&
      part.type.startsWith('tool-') &&
      part.state === 'output-available' &&
      part.output
    ) {
      if (part.type === 'tool-searchWebsite' && part.output.pages) {
        for (const page of part.output.pages) {
          websiteLinks.push(page)
        }
      } else if (part.output.parts) {
        for (const p of part.output.parts) {
          websiteLinks.push({
            title: p.name,
            description: p.category ? `${p.category}${p.year ? ` - ${p.year}` : ''}` : undefined || '',
            url: p.url,
            category: 'product',
          })
        }
      }
    }
  }

  const textContent = (message.parts ?? [])
    .filter((p: any) => p.type === 'text')
    .map((p: any) => p.text)
    .join('')

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[85%] flex-col gap-2 ${isUser ? 'items-end' : 'items-start'}`}>
        {textContent && (
          <div
            className={`rounded-lg px-4 py-2.5 text-sm leading-relaxed ${
              isUser
                ? 'bg-primary text-primary-foreground rounded-br-none'
                : 'bg-card text-card-foreground border border-border rounded-bl-none'
            }`}
          >
            {textContent}
          </div>
        )}

        {/* Website links */}
        {websiteLinks.length > 0 && (
          <div className='flex w-full flex-col gap-1.5'>
            {websiteLinks.slice(0, 3).map((link, idx) => (
              <Link
                key={`website-${idx}`}
                href={link.url}
                className='group flex items-start justify-between gap-2 rounded-lg border border-border bg-card/50 px-3 py-2 text-left transition-all hover:border-primary hover:bg-primary/5'
              >
                <div className='min-w-0 flex-1'>
                  <div className='flex items-center gap-1.5'>
                    <p className='truncate text-xs font-semibold text-card-foreground'>{link.title}</p>
                    <span className='text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium flex-shrink-0'>
                      {link.category}
                    </span>
                  </div>
                  <p className='text-[11px] text-muted-foreground line-clamp-1 mt-0.5'>{link.description}</p>
                </div>
                <ArrowRight className='h-3 w-3 shrink-0 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:text-primary mt-0.5' />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function EmailForm({ onSubmit }: { onSubmit: (email: string) => void }) {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [verifying, setVerifying] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes('@')) return

    setVerifying(true)
    try {
      // Verify email before sending
      const res = await fetch('/api/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (res.ok) {
        setSubmitted(true)
        onSubmit(email)
        setTimeout(() => {
          setSubmitted(false)
          setEmail('')
          setVerifying(false)
        }, 3000)
      }
    } catch (error) {
      console.error('Email verification failed:', error)
      setVerifying(false)
    }
  }

  if (submitted) {
    return (
      <div className='flex items-center gap-2 px-4 py-3 bg-green-500/10 border border-green-500/20 rounded-lg text-sm text-green-600'>
        <CheckCircle className='h-4 w-4 flex-shrink-0' />
        <span className='font-medium'>Email verified! Support team will follow up.</span>
      </div>
    )
  }

  return (
    <div className='px-4 py-3 bg-card border-t border-border'>
      <p className='text-xs text-muted-foreground mb-2 font-medium'>Continue the conversation via email:</p>
      <form onSubmit={handleSubmit} className='flex gap-2'>
        <input
          type='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder='your@email.com'
          className='flex-1 bg-input border border-border rounded px-2 py-1.5 text-xs placeholder:text-muted-foreground focus:outline-none focus:border-primary'
          required
        />
        <button
          type='submit'
          disabled={verifying || !email.includes('@')}
          className='px-3 py-1.5 bg-primary text-primary-foreground rounded text-xs font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors'
        >
          {verifying ? 'Verifying...' : 'Send'}
        </button>
      </form>
    </div>
  )
}

export function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [showEmailForm, setShowEmailForm] = useState(false)
  const [emailSubmitted, setEmailSubmitted] = useState(false)
  const chatBoxRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const messageCountRef = useRef(0)

  const { messages, input, handleInputChange, handleSubmit: handleChatSubmit, isLoading } = useChat({
    api: '/api/chat',
  })

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Show email form after 30 seconds or after 3 messages
  useEffect(() => {
    if (!isOpen || emailSubmitted || showEmailForm) return

    messageCountRef.current = messages.filter((m) => m.role === 'user').length

    // Start 30-second timer on first message
    if (messageCountRef.current === 1 && !timerRef.current) {
      timerRef.current = setTimeout(() => {
        setShowEmailForm(true)
        timerRef.current = null
      }, 30000)
    }

    // Show after 3 user messages
    if (messageCountRef.current >= 3) {
      setShowEmailForm(true)
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [messages, isOpen, emailSubmitted, showEmailForm])

  const handleEmailSubmit = (email: string) => {
    setEmailSubmitted(true)
    // Send conversation to support email
    fetch('/api/send-conversation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        messages: messages.map((m) => ({ role: m.role, content: m.content })),
      }),
    }).catch((error) => console.error('Failed to send conversation:', error))
  }

  const handleChatSubmit2 = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    handleChatSubmit(e)
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 rounded-full font-medium transition-all duration-300 shadow-lg hover:shadow-xl ${
          isOpen
            ? 'bg-primary text-primary-foreground'
            : 'bg-primary text-primary-foreground hover:scale-105 hover:bg-primary/90'
        }`}
      >
        <MessageSquare className='h-5 w-5' />
        <span className='hidden sm:inline'>AUAPW Support</span>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          ref={chatBoxRef}
          className='fixed bottom-24 right-6 z-50 w-96 max-h-[600px] flex flex-col bg-background border border-border rounded-xl shadow-2xl overflow-hidden'
        >
          {/* Header */}
          <div className='bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-4 py-4 flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <MessageSquare className='h-5 w-5' />
              <div>
                <h3 className='font-bold text-sm'>AUAPW Support Chat</h3>
                <p className='text-xs text-primary-foreground/80'>AI-Powered Assistant</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className='hover:bg-primary-foreground/20 p-1 rounded transition-colors'
            >
              <X className='h-5 w-5' />
            </button>
          </div>

          {/* Messages Area */}
          <div className='flex-1 overflow-y-auto p-4 space-y-3 bg-card/30'>
            {messages.length === 0 ? (
              <div className='flex flex-col items-center justify-center h-full gap-3 text-center'>
                <MessageSquare className='h-12 w-12 text-muted-foreground/30' />
                <div>
                  <p className='text-sm font-medium text-card-foreground'>Welcome to AUAPW Support!</p>
                  <p className='text-xs text-muted-foreground mt-1'>
                    Ask about parts, shipping, warranty, or browse our catalog
                  </p>
                </div>
              </div>
            ) : (
              <>
                {messages.map((message, idx) => (
                  <MessageBubble key={idx} message={message} />
                ))}
                {isLoading && (
                  <div className='flex gap-1'>
                    <div className='w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce' style={{ animationDelay: '0ms' }} />
                    <div className='w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce' style={{ animationDelay: '150ms' }} />
                    <div className='w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce' style={{ animationDelay: '300ms' }} />
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Email Form */}
          {showEmailForm && !emailSubmitted && <EmailForm onSubmit={handleEmailSubmit} />}

          {/* Suggestions or Input */}
          {messages.length === 0 ? (
            <div className='px-4 py-3 border-t border-border bg-card/50 space-y-2'>
              {SUGGESTIONS.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    const form = new FormData()
                    form.append('input', suggestion)
                    handleChatSubmit2({ target: { elements: { input: { value: suggestion } } } } as any)
                  }}
                  className='w-full text-left px-3 py-2 text-xs rounded bg-primary/10 hover:bg-primary/20 text-card-foreground transition-colors border border-primary/20 hover:border-primary/40'
                >
                  {suggestion}
                </button>
              ))}
            </div>
          ) : (
            <form onSubmit={handleChatSubmit2} className='px-4 py-3 border-t border-border bg-card flex gap-2'>
              <input
                value={input}
                onChange={handleInputChange}
                placeholder='Ask anything...'
                className='flex-1 bg-input border border-border rounded px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary'
                disabled={isLoading}
              />
              <button
                type='submit'
                disabled={isLoading || !input.trim()}
                className='px-3 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50 transition-colors'
              >
                <Send className='h-4 w-4' />
              </button>
            </form>
          )}
        </div>
      )}
    </>
  )
}
