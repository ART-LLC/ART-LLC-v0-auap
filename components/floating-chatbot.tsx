'use client'

import { useState, useRef, useEffect } from 'react'
import { X, Send, Loader2, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  links?: Array<{ title: string; path: string }>
}

export function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content:
        'Hey there! 👋 I\'m AUAPW\'s automotive expert. Need help finding parts, decoding your VIN, or questions about warranty and returns? Just ask!',
      links: [
        { title: 'Decode My VIN', path: '/ai-search' },
        { title: 'Browse Parts', path: '/products' },
        { title: 'Chat Full Screen', path: '/chat' },
      ],
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            ...messages,
            userMessage,
          ].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      })

      if (!response.ok) throw new Error('Failed to get response')

      // For streaming responses, read the stream
      const reader = response.body?.getReader()
      if (!reader) throw new Error('No response body')

      let fullContent = ''
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        fullContent += decoder.decode(value, { stream: true })
      }

      // Parse the streaming JSON response
      const lines = fullContent.split('\n')
      let assistantContent = ''

      for (const line of lines) {
        if (line.includes('"text"')) {
          const match = line.match(/"text":"([^"]*)"/)
          if (match) {
            assistantContent += match[1]
          }
        }
      }

      if (!assistantContent) {
        assistantContent =
          'I had trouble processing that. Try asking about parts, warranty, returns, or shipping, or visit /support for help!'
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: assistantContent,
        links: extractLinks(assistantContent),
      }
      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error('[v0] Chatbot error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        role: 'assistant',
        content:
          'Sorry, I encountered an issue. Please try again or call us at (888) 818-5001.',
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 shadow-lg overflow-hidden"
        style={{
          background: 'radial-gradient(circle at 50% 35%, #3a3a42 0%, #1c1c22 70%, #0e0e12 100%)',
          border: '2px solid rgba(203, 213, 225, 0.35)',
          color: '#fff',
          boxShadow: '0 8px 24px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)',
        }}
        aria-label="Toggle chat"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Image
            src="/chatbot-mechanic-logo.jpg"
            alt="AUAPW automotive assistant"
            width={64}
            height={64}
            className="w-full h-full object-cover"
            priority
          />
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          className="fixed bottom-24 right-6 z-50 w-full max-w-sm rounded-xl shadow-2xl overflow-hidden flex flex-col"
          style={{
            height: '600px',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            border: '1px solid rgba(148, 163, 184, 0.2)',
          }}
        >
          {/* Header */}
          <div
            className="p-4 flex items-center justify-between"
            style={{
              background: 'linear-gradient(135deg, #2a4fa8 0%, #1a3580 100%)',
            }}
          >
            <div className="flex items-center gap-3">
              <span
                className="w-10 h-10 rounded-full overflow-hidden shrink-0 flex items-center justify-center"
                style={{
                  background: 'radial-gradient(circle at 50% 35%, #3a3a42 0%, #14141a 100%)',
                  border: '1.5px solid rgba(203, 213, 225, 0.4)',
                }}
              >
                <Image
                  src="/chatbot-mechanic-logo.jpg"
                  alt="AUAPW automotive assistant"
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              </span>
              <div>
                <h3 className="font-bold text-white text-sm">AUAPW Automotive</h3>
                <p className="text-xs text-blue-100 flex items-center gap-1.5">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400" />
                  Online · Always here to help
                </p>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-white/60 cursor-pointer" onClick={() => setIsOpen(false)} />
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-slate-700 text-slate-100 rounded-bl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                  {msg.links && msg.links.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {msg.links.map((link) => (
                        <Link
                          key={link.path}
                          href={link.path}
                          className="block text-xs font-semibold underline hover:opacity-80 transition"
                          style={{ color: msg.role === 'user' ? '#dbeafe' : '#93c5fd' }}
                          onClick={() => setIsOpen(false)}
                        >
                          → {link.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-700 text-slate-100 px-4 py-2 rounded-lg rounded-bl-none flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-slate-700 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about parts..."
              disabled={isLoading}
              className="flex-1 px-3 py-2 rounded-lg bg-slate-800 text-white text-sm placeholder-slate-500 border border-slate-600 focus:outline-none focus:border-blue-500 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  )
}

/**
 * Extract links from response text (looks for patterns like /path or URLs)
 */
function extractLinks(content: string): Array<{ title: string; path: string }> {
  const links: Array<{ title: string; path: string }> = []

  // Common page links
  const pageLinks: Record<string, string> = {
    '/ai-search': 'Decode My VIN',
    '/products': 'Browse Products',
    '/dashboard': 'View Dashboard',
    '/warranty': 'Warranty Info',
    '/returns': 'Returns Policy',
    '/support': 'Get Support',
    '/chat': 'Full Chat',
    '/wishlist': 'My Wishlist',
    '/checkout': 'Checkout',
  }

  for (const [path, title] of Object.entries(pageLinks)) {
    if (content.toLowerCase().includes(path.toLowerCase()) || content.includes(path)) {
      links.push({ title, path })
    }
  }

  return links.slice(0, 3) // Max 3 links per message
}
