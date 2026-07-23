// Mock product data for demonstration
const MOCK_PRODUCTS = [
  {
    id: 'prod_1',
    sku: 'ENGINE-2.4-ACCORD',
    category: 'Engines',
    name: 'Honda Accord 2.4L Engine (2008-2012)',
    price: '2499.99',
    warranty_days: 180,
    condition: 'used',
    make: 'Honda',
    model: 'Accord',
    year_from: 2008,
    year_to: 2012,
    isActive: true,
    inventory: { quantity_available: 5 },
  },
  {
    id: 'prod_2',
    sku: 'ENGINE-1.8-CIVIC',
    category: 'Engines',
    name: 'Honda Civic 1.8L Engine (2006-2011)',
    price: '1899.99',
    warranty_days: 180,
    condition: 'used',
    make: 'Honda',
    model: 'Civic',
    year_from: 2006,
    year_to: 2011,
    isActive: true,
    inventory: { quantity_available: 8 },
  },
  {
    id: 'prod_3',
    sku: 'ENGINE-4.0-F150',
    category: 'Engines',
    name: 'Ford F-150 4.0L Engine (2004-2008)',
    price: '1799.99',
    warranty_days: 180,
    condition: 'used',
    make: 'Ford',
    model: 'F-150',
    year_from: 2004,
    year_to: 2008,
    isActive: true,
    inventory: { quantity_available: 3 },
  },
  {
    id: 'prod_4',
    sku: 'TRANS-AUTO-5SPD',
    category: 'Transmissions',
    name: 'Automatic Transmission 5-Speed (2000-2015)',
    price: '1299.99',
    warranty_days: 90,
    condition: 'used',
    isActive: true,
    inventory: { quantity_available: 12 },
  },
  {
    id: 'prod_5',
    sku: 'TRANS-AUTO-6SPD',
    category: 'Transmissions',
    name: 'Automatic Transmission 6-Speed (2010-2020)',
    price: '1599.99',
    warranty_days: 90,
    condition: 'used',
    isActive: true,
    inventory: { quantity_available: 7 },
  },
  {
    id: 'prod_6',
    sku: 'STRUT-FRONT-ACCORD',
    category: 'Suspension & Steering',
    name: 'Front Strut Pair - Honda Accord (2008-2012)',
    price: '349.99',
    warranty_days: 180,
    condition: 'used',
    make: 'Honda',
    model: 'Accord',
    isActive: true,
    inventory: { quantity_available: 15 },
  },
  {
    id: 'prod_7',
    sku: 'AXLE-FRONT-F150',
    category: 'Suspension & Steering',
    name: 'Front Axle Assembly - Ford F-150 (2004-2008)',
    price: '749.99',
    warranty_days: 180,
    condition: 'used',
    make: 'Ford',
    model: 'F-150',
    isActive: true,
    inventory: { quantity_available: 2 },
  },
  {
    id: 'prod_8',
    sku: 'ALTERNATOR-120A',
    category: 'Electrical & Sensors',
    name: 'Alternator 120A',
    price: '299.99',
    warranty_days: 180,
    condition: 'used',
    isActive: true,
    inventory: { quantity_available: 22 },
  },
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const search = searchParams.get('search')
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')
  const offset = (page - 1) * limit

  try {
    // Filter mock products
    let filtered = MOCK_PRODUCTS

    if (category && category !== 'All') {
      filtered = filtered.filter((p) => p.category === category)
    }

    if (search) {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.sku.toLowerCase().includes(searchLower)
      )
    }

    // Paginate
    const result = filtered.slice(offset, offset + limit)

    return Response.json({
      data: result,
      page,
      limit,
      offset,
    })
  } catch (error) {
    console.error('[v0] Products API error:', error)
    return Response.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}
