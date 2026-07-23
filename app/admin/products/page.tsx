'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Plus, Edit2, Trash2 } from 'lucide-react'

const SAMPLE_PRODUCTS = [
  {
    id: 'prod_1',
    sku: 'ENGINE-2.4-ACCORD',
    name: 'Honda Accord 2.4L Engine',
    category: 'Engines',
    price: 2499.99,
    warranty: 180,
    stock: 5,
  },
  {
    id: 'prod_2',
    sku: 'ENGINE-1.8-CIVIC',
    name: 'Honda Civic 1.8L Engine',
    category: 'Engines',
    price: 1899.99,
    warranty: 180,
    stock: 8,
  },
  {
    id: 'prod_3',
    sku: 'TRANS-AUTO-5SPD',
    name: 'Automatic Transmission 5-Speed',
    category: 'Transmissions',
    price: 1299.99,
    warranty: 90,
    stock: 12,
  },
]

export default function AdminProductsPage() {
  const [products, setProducts] = useState(SAMPLE_PRODUCTS)
  const [isAddingProduct, setIsAddingProduct] = useState(false)
  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    category: '',
    price: '',
    warranty: '',
    description: '',
    stock: '',
  })
  const [editingId, setEditingId] = useState<string | null>(null)

  const handleAddProduct = () => {
    if (!formData.sku || !formData.name || !formData.category || !formData.price) {
      alert('Please fill in all required fields')
      return
    }

    if (editingId) {
      setProducts(
        products.map((p) =>
          p.id === editingId
            ? {
                ...p,
                sku: formData.sku,
                name: formData.name,
                category: formData.category,
                price: parseFloat(formData.price),
                warranty: parseInt(formData.warranty) || 0,
                stock: parseInt(formData.stock) || 0,
              }
            : p
        )
      )
      setEditingId(null)
    } else {
      setProducts([
        ...products,
        {
          id: `prod_${Date.now()}`,
          sku: formData.sku,
          name: formData.name,
          category: formData.category,
          price: parseFloat(formData.price),
          warranty: parseInt(formData.warranty) || 0,
          stock: parseInt(formData.stock) || 0,
        },
      ])
    }

    setFormData({
      sku: '',
      name: '',
      category: '',
      price: '',
      warranty: '',
      description: '',
      stock: '',
    })
    setIsAddingProduct(false)
  }

  const handleEdit = (product: any) => {
    setFormData({
      sku: product.sku,
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      warranty: product.warranty.toString(),
      description: '',
      stock: product.stock.toString(),
    })
    setEditingId(product.id)
    setIsAddingProduct(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter((p) => p.id !== id))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Product Management</h2>
        <Button onClick={() => setIsAddingProduct(!isAddingProduct)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      {isAddingProduct && (
        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <h3 className="font-semibold">
            {editingId ? 'Edit Product' : 'Add New Product'}
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <Input
              placeholder="SKU"
              value={formData.sku}
              onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
            />
            <Input
              placeholder="Product Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <Input
              placeholder="Category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            />
            <Input
              placeholder="Price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            />
            <Input
              placeholder="Warranty Days"
              type="number"
              value={formData.warranty}
              onChange={(e) => setFormData({ ...formData, warranty: e.target.value })}
            />
            <Input
              placeholder="Stock"
              type="number"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
            />
          </div>

          <Textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />

          <div className="flex gap-2">
            <Button onClick={handleAddProduct}>
              {editingId ? 'Update Product' : 'Add Product'}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddingProduct(false)
                setEditingId(null)
                setFormData({
                  sku: '',
                  name: '',
                  category: '',
                  price: '',
                  warranty: '',
                  description: '',
                  stock: '',
                })
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      <div className="border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>SKU</TableHead>
              <TableHead>Product Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Warranty</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-mono text-sm">{product.sku}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>${product.price.toFixed(2)}</TableCell>
                <TableCell>{product.warranty} days</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      product.stock > 5
                        ? 'bg-green-500/20 text-green-600'
                        : product.stock > 0
                          ? 'bg-yellow-500/20 text-yellow-600'
                          : 'bg-red-500/20 text-red-600'
                    }`}
                  >
                    {product.stock}
                  </span>
                </TableCell>
                <TableCell className="text-right flex gap-2 justify-end">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEdit(product)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                    onClick={() => handleDelete(product.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
