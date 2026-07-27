'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createListing } from '@/app/actions/seller-actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2 } from 'lucide-react'

const CONDITIONS = [
  { value: 'new', label: 'New' },
  { value: 'excellent', label: 'Excellent' },
  { value: 'good', label: 'Good' },
  { value: 'fair', label: 'Fair' },
]

export function NewListingForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    partName: '',
    partNumber: '',
    make: '',
    model: '',
    year: '',
    mileage: '',
    condition: '',
    description: '',
    quantity: '1',
    price: '',
  })

  function field(key: keyof typeof form) {
    return {
      value: form[key],
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setForm((f) => ({ ...f, [key]: e.target.value })),
    }
  }

  async function handleSubmit() {
    setLoading(true)
    setError(null)
    try {
      const result = await createListing({
        partName: form.partName,
        partNumber: form.partNumber || undefined,
        make: form.make,
        model: form.model,
        year: form.year || undefined,
        mileage: form.mileage ? parseInt(form.mileage) : undefined,
        condition: form.condition,
        description: form.description || undefined,
        quantity: parseInt(form.quantity),
        price: parseFloat(form.price),
      })
      if ('error' in result && result.error) {
        setError(result.error as string)
      } else {
        router.push('/seller/listings')
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-card border border-border rounded-2xl p-6 flex flex-col gap-5">
      {error && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/30 px-4 py-3 text-sm text-destructive font-semibold">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label htmlFor="partName">Part Name *</Label>
          <Input id="partName" placeholder="e.g. Engine Assembly" {...field('partName')} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="partNumber">Part Number</Label>
          <Input id="partNumber" placeholder="OEM-12345" {...field('partNumber')} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="condition">Condition *</Label>
          <Select
            value={form.condition}
            onValueChange={(v) => setForm((f) => ({ ...f, condition: v }))}
          >
            <SelectTrigger id="condition">
              <SelectValue placeholder="Select condition" />
            </SelectTrigger>
            <SelectContent>
              {CONDITIONS.map(({ value, label }) => (
                <SelectItem key={value} value={value}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="make">Make *</Label>
          <Input id="make" placeholder="Ford" {...field('make')} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="model">Model *</Label>
          <Input id="model" placeholder="F-150" {...field('model')} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="year">Year</Label>
          <Input id="year" placeholder="2018" {...field('year')} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="mileage">Mileage</Label>
          <Input id="mileage" type="number" placeholder="85000" {...field('mileage')} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="price">Price ($) *</Label>
          <Input id="price" type="number" step="0.01" placeholder="199.99" {...field('price')} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="quantity">Quantity *</Label>
          <Input id="quantity" type="number" min="1" {...field('quantity')} />
        </div>
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Describe the part condition, fitment notes, etc."
            rows={4}
            {...field('description')}
          />
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button
          onClick={handleSubmit}
          disabled={
            loading ||
            !form.partName ||
            !form.make ||
            !form.model ||
            !form.condition ||
            !form.price ||
            !form.quantity
          }
          className="flex-1"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
          Create Listing
        </Button>
        <Button
          variant="outline"
          onClick={() => router.push('/seller/listings')}
          disabled={loading}
        >
          Cancel
        </Button>
      </div>
    </div>
  )
}
