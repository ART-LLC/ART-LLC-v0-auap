export type PartsSearchFilters = {
  make?: string
  model?: string
  year?: string
  partType?: string
  location?: string
  zipCode?: string
}

function isTransmissionPart(partType: string) {
  return /\btransmission\b/i.test(partType)
}

function isEnginePart(partType: string) {
  return /\bengine\b/i.test(partType) && !isTransmissionPart(partType)
}

export function getPartsSearchUrl(filters: PartsSearchFilters) {
  const partType = filters.partType?.trim() ?? ''
  const pathname = isTransmissionPart(partType)
    ? '/used-transmissions'
    : isEnginePart(partType)
      ? '/used-engines'
      : '/search'

  const params = new URLSearchParams()
  if (filters.make) params.set('make', filters.make)
  if (filters.model) params.set('model', filters.model)
  if (filters.year) params.set('year', filters.year)
  if (partType) params.set('part', partType)
  if (filters.location) params.set('location', filters.location)
  if (filters.zipCode) params.set('zip', filters.zipCode)

  const query = params.toString()
  return query ? `${pathname}?${query}` : pathname
}
