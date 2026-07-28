'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import useSWR from 'swr'
import { Plus, Edit2, Trash2, Eye, EyeOff, Save } from 'lucide-react'

export function CMSDashboard() {
  const router = useRouter()
  const [showNewPageForm, setShowNewPageForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    slug: '',
    title: '',
    description: '',
    content: '',
    contentType: 'page',
    category: '',
    seoTitle: '',
    seoDescription: '',
    metaKeywords: '',
  })

  const fetcher = async (url: string) => {
    const res = await fetch(url, { credentials: 'include' })
    if (!res.ok) throw new Error('Failed to fetch pages')
    return res.json()
  }

  const { data: { pages = [] } = {}, mutate } = useSWR('/api/admin/cms/pages', fetcher)

  const handleSave = async () => {
    try {
      const res = await fetch('/api/admin/cms/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      })

      if (!res.ok) throw new Error('Failed to save page')
      
      setFormData({
        slug: '',
        title: '',
        description: '',
        content: '',
        contentType: 'page',
        category: '',
        seoTitle: '',
        seoDescription: '',
        metaKeywords: '',
      })
      setShowNewPageForm(false)
      mutate()
    } catch (error) {
      console.error('[v0] Save error:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return
    try {
      const res = await fetch(`/api/admin/cms/pages/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Failed to delete')
      mutate()
    } catch (error) {
      console.error('[v0] Delete error:', error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Content Management</h2>
        <button
          onClick={() => setShowNewPageForm(!showNewPageForm)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
        >
          <Plus className="w-4 h-4" />
          New Page
        </button>
      </div>

      {showNewPageForm && (
        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-semibold">Create New Page</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Slug (URL-friendly name)"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="px-3 py-2 border border-border rounded-lg bg-background"
            />
            <input
              type="text"
              placeholder="Page Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="px-3 py-2 border border-border rounded-lg bg-background"
            />
          </div>

          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background h-20"
          />

          <textarea
            placeholder="Main Content"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background h-40"
          />

          <div className="grid grid-cols-3 gap-4">
            <select
              value={formData.contentType}
              onChange={(e) => setFormData({ ...formData, contentType: e.target.value })}
              className="px-3 py-2 border border-border rounded-lg bg-background"
            >
              <option value="page">Page</option>
              <option value="blog">Blog</option>
              <option value="policy">Policy</option>
              <option value="guide">Guide</option>
            </select>

            <input
              type="text"
              placeholder="Category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="px-3 py-2 border border-border rounded-lg bg-background"
            />

            <input
              type="text"
              placeholder="SEO Title"
              value={formData.seoTitle}
              onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
              className="px-3 py-2 border border-border rounded-lg bg-background"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-success text-white rounded-lg hover:bg-success/90"
            >
              <Save className="w-4 h-4" />
              Save Page
            </button>
            <button
              onClick={() => setShowNewPageForm(false)}
              className="px-4 py-2 border border-border rounded-lg hover:bg-muted"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {pages.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No pages yet. Create one to get started.</p>
        ) : (
          pages.map((page: any) => (
            <div key={page.id} className="bg-card border border-border rounded-lg p-4 flex items-center justify-between">
              <div className="flex-1">
                <h4 className="font-semibold">{page.title}</h4>
                <p className="text-sm text-muted-foreground">/{page.slug}</p>
                <div className="flex gap-2 mt-2">
                  <span className="text-xs bg-muted px-2 py-1 rounded">{page.contentType}</span>
                  <span className={`text-xs px-2 py-1 rounded ${page.published ? 'bg-success/20 text-success' : 'bg-muted text-muted-foreground'}`}>
                    {page.published ? 'Published' : 'Draft'}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => window.open(`/${page.slug}`, '_blank')}
                  className="p-2 hover:bg-muted rounded-lg"
                  title="View"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setEditingId(page.id)}
                  className="p-2 hover:bg-muted rounded-lg"
                  title="Edit"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(page.id)}
                  className="p-2 hover:bg-destructive/10 rounded-lg text-destructive"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
