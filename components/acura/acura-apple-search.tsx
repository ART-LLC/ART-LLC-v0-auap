'use client'

import { useMemo, useState } from 'react'
import { acuraProducts, type AcuraProduct } from '@/lib/acura-data'

interface AppleSearchProps {
  onSearch?: (query: string) => void
  activeQuery?: string
}

export function AppleStyleSearch({ onSearch, activeQuery = '' }: AppleSearchProps) {
  const [make, setMake] = useState('')
  const [model, setModel] = useState('')
  const [year, setYear] = useState('')
  const [partType, setPartType] = useState('')

  // Extract unique values for dropdowns
  const makes = useMemo(() => {
    const set = new Set(acuraProducts.map((p) => p.model?.split(' ')[0] || 'Acura').filter(Boolean))
    return Array.from(set).sort()
  }, [])

  const models = useMemo(() => {
    if (!make) return []
    const set = new Set(
      acuraProducts
        .filter((p) => p.model?.includes(make))
        .map((p) => p.model)
        .filter(Boolean),
    )
    return Array.from(set).sort()
  }, [make])

  const years = useMemo(() => {
    const set = new Set(acuraProducts.map((p) => p.year).filter(Boolean))
    return Array.from(set).sort((a, b) => Number(b) - Number(a))
  }, [])

  const partTypes = useMemo(() => {
    const set = new Set(acuraProducts.map((p: AcuraProduct) => p.category).filter(Boolean))
    return Array.from(set).sort()
  }, [])

  function handleSearch() {
    const query = [make, model, year, partType].filter(Boolean).join(' ')
    if (query.trim() && onSearch) {
      onSearch(query)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="w-full">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Grid layout with 2 rows and responsive columns */}
        <div className="space-y-4">
          {/* Row 1: Make and Model */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Make *
              </label>
              <select
                value={make}
                onChange={(e) => {
                  setMake(e.target.value)
                  setModel('')
                }}
                className="w-full rounded-lg border border-border/50 bg-card px-4 py-3 text-base font-semibold text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="">Select Make</option>
                {makes.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Model
              </label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                disabled={!make}
                className="w-full rounded-lg border border-border/50 bg-card px-4 py-3 text-base font-semibold text-foreground placeholder:text-muted-foreground disabled:opacity-50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="">{make ? 'Select Model' : 'Select Make First'}</option>
                {models.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2: Year and Part Needed */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Year
              </label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full rounded-lg border border-border/50 bg-card px-4 py-3 text-base font-semibold text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="">Select Year</option>
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Part Needed
              </label>
              <select
                value={partType}
                onChange={(e) => setPartType(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full rounded-lg border border-border/50 bg-card px-4 py-3 text-base font-semibold text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="">Select Part Type</option>
                {partTypes.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Search Button */}
          <div className="flex justify-center pt-2">
            <button
              onClick={handleSearch}
              disabled={!make}
              className="rounded-lg bg-primary px-8 py-3 text-sm font-bold uppercase tracking-wide text-primary-foreground transition-opacity disabled:opacity-50 hover:opacity-90"
            >
              Search Parts
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
