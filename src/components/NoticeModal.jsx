import { useEffect, useState } from 'react'

const statuses = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'archived', label: 'Archived' },
]

export default function NoticeModal({ open, onClose, onSubmit, initialData }) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [status, setStatus] = useState('draft')
  const [attachment, setAttachment] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '')
      setContent(initialData.content || '')
      setStatus(initialData.status || 'draft')
      setAttachment(initialData.attachment || '')
    } else {
      setTitle('')
      setContent('')
      setStatus('draft')
      setAttachment('')
    }
    setError('')
    setSaving(false)
  }, [initialData, open])

  if (!open) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!title.trim() || !content.trim()) {
      setError('Please provide both title and content')
      return
    }

    setSaving(true)
    try {
      await onSubmit({ title: title.trim(), content: content.trim(), status, attachment: attachment.trim() || null })
      onClose()
    } catch (err) {
      setError(err?.message || 'Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-slate-900 border border-blue-500/20 rounded-2xl p-6 shadow-2xl mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white">{initialData ? 'Edit Notice' : 'Create Notice'}</h3>
          <button onClick={onClose} className="text-blue-200/70 hover:text-white transition">✕</button>
        </div>

        {error && (
          <div className="mb-4 text-sm text-red-300 bg-red-500/10 border border-red-500/30 rounded-lg p-3">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-blue-200/80 mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-800 text-white rounded-lg border border-blue-500/20 focus:border-blue-500/60 outline-none px-3 py-2"
              placeholder="Enter a clear, concise title"
            />
          </div>

          <div>
            <label className="block text-sm text-blue-200/80 mb-1">Content</label>
            <textarea
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-slate-800 text-white rounded-lg border border-blue-500/20 focus:border-blue-500/60 outline-none px-3 py-2"
              placeholder="Write the notice details..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-blue-200/80 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-slate-800 text-white rounded-lg border border-blue-500/20 focus:border-blue-500/60 outline-none px-3 py-2"
              >
                {statuses.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-blue-200/80 mb-1">Attachment URL</label>
              <input
                type="url"
                value={attachment}
                onChange={(e) => setAttachment(e.target.value)}
                className="w-full bg-slate-800 text-white rounded-lg border border-blue-500/20 focus:border-blue-500/60 outline-none px-3 py-2"
                placeholder="https://... (image or file URL)"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 text-blue-200/90 border border-blue-500/20 hover:bg-slate-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition disabled:opacity-60"
            >
              {saving ? 'Saving...' : (initialData ? 'Save Changes' : 'Create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
