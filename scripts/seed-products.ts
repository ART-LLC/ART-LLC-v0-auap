import { db } from '../lib/db'
import { products, inventory } from '../lib/db/schema'
import { v4 as uuid } from 'uuid'

const SEED_PRODUCTS = [
  // Engines
  {
    sku: 'ENGINE-2.4-ACCORD',
    category: 'Engines',
    name: 'Honda Accord 2.4L Engine (2008-2012)',
    price: 2499.99,
    warranty_days: 180,
    condition: 'used',
    make: 'Honda',
    model: 'Accord',
    year_from: 2008,
    year_to: 2012,
    quantity: 5,
  },
  {
    sku: 'ENGINE-3.5-CIVIC',
    category: 'Engines',
    name: 'Honda Civic 1.8L Engine (2006-2011)',
    price: 1899.99,
    warranty_days: 180,
    condition: 'used',
    make: 'Honda',
    model: 'Civic',
    year_from: 2006,
    year_to: 2011,
    quantity: 8,
  },
  {
    sku: 'ENGINE-4.0-F150',
    category: 'Engines',
    name: 'Ford F-150 4.0L Engine (2004-2008)',
    price: 1799.99,
    warranty_days: 180,
    condition: 'used',
    make: 'Ford',
    model: 'F-150',
    year_from: 2004,
    year_to: 2008,
    quantity: 3,
  },
  // Transmissions
  {
    sku: 'TRANS-AUTO-5SPD',
    category: 'Transmissions',
    name: 'Automatic Transmission 5-Speed (2000-2015)',
    price: 1299.99,
    warranty_days: 90,
    condition: 'used',
    quantity: 12,
  },
  {
    sku: 'TRANS-AUTO-6SPD',
    category: 'Transmissions',
    name: 'Automatic Transmission 6-Speed (2010-2020)',
    price: 1599.99,
    warranty_days: 90,
    condition: 'used',
    quantity: 7,
  },
  {
    sku: 'TRANS-MANUAL-5SPD',
    category: 'Transmissions',
    name: 'Manual Transmission 5-Speed',
    price: 899.99,
    warranty_days: 90,
    condition: 'used',
    quantity: 4,
  },
  // Suspension
  {
    sku: 'STRUT-FRONT-ACCORD',
    category: 'Suspension & Steering',
    name: 'Front Strut Pair - Honda Accord (2008-2012)',
    price: 349.99,
    warranty_days: 180,
    condition: 'used',
    make: 'Honda',
    model: 'Accord',
    quantity: 15,
  },
  {
    sku: 'AXLE-FRONT-F150',
    category: 'Suspension & Steering',
    name: 'Front Axle Assembly - Ford F-150 (2004-2008)',
    price: 749.99,
    warranty_days: 180,
    condition: 'used',
    make: 'Ford',
    model: 'F-150',
    quantity: 2,
  },
  // Electrical
  {
    sku: 'ALTERNATOR-120A',
    category: 'Electrical & Sensors',
    name: 'Alternator 120A',
    price: 299.99,
    warranty_days: 180,
    condition: 'used',
    quantity: 22,
  },
  {
    sku: 'STARTER-MOTOR',
    category: 'Electrical & Sensors',
    name: 'Starter Motor Assembly',
    price: 199.99,
    warranty_days: 180,
    condition: 'used',
    quantity: 18,
  },
]

async function seedProducts() {
  console.log('Seeding products...')

  for (const p of SEED_PRODUCTS) {
    const productId = `prod_${uuid()}`
    const inventoryId = `inv_${uuid()}`

    try {
      // Insert product
      await db.insert(products).values({
        id: productId,
        sku: p.sku,
        category: p.category,
        name: p.name,
        price: p.price.toString(),
        warranty_days: p.warranty_days,
        condition: p.condition,
        make: p.make,
        model: p.model,
        year_from: p.year_from,
        year_to: p.year_to,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any)

      // Insert inventory
      await db.insert(inventory).values({
        id: inventoryId,
        productId: productId,
        quantity_on_hand: p.quantity,
        quantity_reserved: 0,
        quantity_available: p.quantity,
        reorder_point: 3,
        reorder_quantity: 5,
        last_updated: new Date(),
      } as any)

      console.log(`✓ Created ${p.name}`)
    } catch (error) {
      console.error(`✗ Failed to create ${p.name}:`, error)
    }
  }

  console.log('Done seeding products!')
}

seedProducts().catch(console.error)
