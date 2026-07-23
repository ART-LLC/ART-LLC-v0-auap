export interface Product {
  id: string
  name: string
  description: string
  priceInCents: number
  category: string
  warranty: number
}

export const PRODUCTS: Product[] = [
  {
    id: 'prod_1',
    name: 'Honda Accord 2.4L Engine (2008-2012)',
    description: 'High-quality used Honda Accord engine, fully tested and inspected',
    priceInCents: 249999,
    category: 'Engines',
    warranty: 180,
  },
  {
    id: 'prod_2',
    name: 'Honda Civic 1.8L Engine (2006-2011)',
    description: 'Well-maintained Honda Civic 1.8L engine with compression test',
    priceInCents: 189999,
    category: 'Engines',
    warranty: 180,
  },
  {
    id: 'prod_3',
    name: 'Ford F-150 4.0L Engine (2004-2008)',
    description: 'Powerful Ford F-150 V6 engine, extensively tested for durability',
    priceInCents: 179999,
    category: 'Engines',
    warranty: 180,
  },
  {
    id: 'prod_4',
    name: 'Automatic Transmission 5-Speed',
    description: 'Reliable 5-speed automatic transmission with fresh fluid',
    priceInCents: 129999,
    category: 'Transmissions',
    warranty: 90,
  },
  {
    id: 'prod_5',
    name: 'Automatic Transmission 6-Speed',
    description: 'Modern 6-speed automatic transmission for improved fuel efficiency',
    priceInCents: 159999,
    category: 'Transmissions',
    warranty: 90,
  },
  {
    id: 'prod_6',
    name: 'Front Strut Pair - Honda Accord',
    description: 'Professional-grade front strut pair with coil springs included',
    priceInCents: 34999,
    category: 'Suspension & Steering',
    warranty: 180,
  },
  {
    id: 'prod_7',
    name: 'Front Axle Assembly - Ford F-150',
    description: 'Heavy-duty front axle with new seals and inspected bearings',
    priceInCents: 74999,
    category: 'Suspension & Steering',
    warranty: 180,
  },
  {
    id: 'prod_8',
    name: 'Alternator 120A',
    description: 'Heavy-duty 120-amp alternator with tested charging output',
    priceInCents: 29999,
    category: 'Electrical & Sensors',
    warranty: 180,
  },
]
