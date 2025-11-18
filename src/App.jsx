import { useEffect, useMemo, useState } from 'react'
import { LayoutGrid, List, Plus, Search, Loader2 } from 'lucide-react'
import NoticeModal from './components/NoticeModal'
import NoticeCard from './components/NoticeCard'
import NoticeListItem from './components/NoticeListItem'

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function App() {
  const [notices, setNotices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [view, setView] = useState('grid') // grid | list
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  const filtered = useMemo(() => {
    if (!query.trim()) return notices
    return notices.filter(n =>
      n.title.toLowerCase().includes(query.toLowerCase()) ||
      n.content.toLowerCase().includes(query.toLowerCase())
    )
  }, [query, notices])

  const loadNotices = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${BACKEND}/api/notices`)
      if (!res.ok) throw new Error('Failed to load notices')
      const data = await res.json()
      setNotices(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadNotices()
  }, [])

  const onCreate = () => {
    setEditing(null)
    setModalOpen(true)
  }

  const handleSubmit = async (payload) => {
    if (editing) {
      const res = await fetch(`${BACKEND}/api/notices/${editing.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (!res.ok) throw new Error('Failed to update')
      const upd = await res.json()
      setNotices(prev => prev.map(n => n.id === upd.id ? upd : n))
    } else {
      const res = await fetch(`${BACKEND}/api/notices`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (!res.ok) throw new Error('Failed to create')
      const created = await res.json()
      setNotices(prev => [created, ...prev])
    }
  }

  const onEdit = (notice) => {
    setEditing(notice)
    setModalOpen(true)
  }

  const onDelete = async (notice) => {
    if (!confirm('Delete this notice?')) return
    const res = await fetch(`${BACKEND}/api/notices/${notice.id}`, { method: 'DELETE' })
    if (res.status === 204) {
      setNotices(prev => prev.filter(n => n.id !== notice.id))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="relative max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Notice Management</h1>
            <p className="text-blue-200/80">Create, edit, and organize notices with attachments</p>
          </div>
          <button onClick={onCreate} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500 text-white hover:bg-blue-600 transition shadow">
            <Plus size={18} /> New Notice
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-200/50" size={18} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search notices..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 text-white border border-blue-500/20 focus:border-blue-500/60 outline-none"
            />
          </div>
          <div className="inline-flex bg-slate-900 rounded-xl border border-blue-500/20 p-1">
            <button onClick={() => setView('grid')} className={`px-3 py-2 rounded-lg inline-flex items-center gap-2 ${view==='grid' ? 'bg-blue-500 text-white' : 'text-blue-200/80 hover:text-white hover:bg-blue-500/10'}`}>
              <LayoutGrid size={18} /> Grid
            </button>
            <button onClick={() => setView('list')} className={`px-3 py-2 rounded-lg inline-flex items-center gap-2 ${view==='list' ? 'bg-blue-500 text-white' : 'text-blue-200/80 hover:text-white hover:bg-blue-500/10'}`}>
              <List size={18} /> List
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20 text-blue-200/80">
            <Loader2 className="animate-spin mr-2" /> Loading notices...
          </div>
        ) : error ? (
          <div className="text-red-300 bg-red-500/10 border border-red-500/30 p-4 rounded-xl">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="text-blue-200/80 bg-slate-900/60 border border-blue-500/20 p-8 rounded-2xl text-center">No notices found.</div>
        ) : view === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(n => (
              <NoticeCard key={n.id} notice={n} onEdit={onEdit} onDelete={onDelete} />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(n => (
              <NoticeListItem key={n.id} notice={n} onEdit={onEdit} onDelete={onDelete} />
            ))}
          </div>
        )}
      </div>

      <NoticeModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={editing}
      />
    </div>
  )
}
