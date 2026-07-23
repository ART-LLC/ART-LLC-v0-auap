'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send, Loader2, MessageCircle, AlertCircle } from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export default function ChatPage() {
  const [mounted, setMounted] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Welcome to AUAPW Automotive Support! 👋 I\'m your dedicated chatbot assistant, ready to help you find the perfect used auto parts. How can I assist you today? You can ask me about:\n\n• Finding specific engine or transmission parts\n• Vehicle compatibility questions\n• Warranty information\n• Shipping and pricing\n• Return policies\n• VIN decoding\n• Installation tips',
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

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
      // Call the support chat API
      const response = await fetch('/api/support/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          conversationHistory: messages,
        }),
      })

      const data = await response.json()
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || 'I apologize, but I encountered an issue processing your request. Please try again.',
      }
      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again or contact support at (888) 818-5001.',
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 pt-32 pb-8">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <MessageCircle className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold">AUAPW Automotive Chatbot</h1>
          </div>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Instant answers to your automotive parts questions. Ask about engines, transmissions, compatibility, pricing, and more.
          </p>
        </div>

        {/* Chat Container */}
        <div className="bg-card border border-border rounded-lg shadow-xl overflow-hidden flex flex-col h-[600px]">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-center">
                <div className="text-muted-foreground">
                  <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-30" />
                  <p>Start a conversation with the chatbot</p>
                </div>
              </div>
            ) : (
              <>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-3 rounded-lg ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-foreground'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap break-words">
                        {message.content}
                      </p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-muted text-foreground px-4 py-3 rounded-lg flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm">Thinking...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t border-border p-4 bg-background/50">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about parts, compatibility, pricing..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="gap-2"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Send</span>
              </Button>
            </form>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-100">
            <p className="font-semibold mb-1">💡 Chatbot Tips:</p>
            <ul className="space-y-1 text-xs opacity-90">
              <li>• Provide your vehicle year/make/model for better recommendations</li>
              <li>• Ask about part compatibility before ordering</li>
              <li>• Inquire about warranty coverage and shipping options</li>
              <li>• Request quotes for bulk orders</li>
            </ul>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card border border-border rounded-lg p-4 hover:border-primary/50 transition-colors cursor-pointer" onClick={() => document.querySelector('input')?.focus()}>
            <h3 className="font-semibold mb-2">Find Parts by Year/Make/Model</h3>
            <p className="text-sm text-muted-foreground">Ask the chatbot to help you find compatible parts for your vehicle</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4 hover:border-primary/50 transition-colors cursor-pointer" onClick={() => document.querySelector('input')?.focus()}>
            <h3 className="font-semibold mb-2">Check Availability & Pricing</h3>
            <p className="text-sm text-muted-foreground">Get instant quotes and availability information for specific parts</p>
          </div>
        </div>
      </div>
    </div>
  )
}
