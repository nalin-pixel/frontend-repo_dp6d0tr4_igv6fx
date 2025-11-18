import { memo } from 'react'

function StatusBadge({ status }) {
  const map = {
    draft: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40',
    published: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    archived: 'bg-slate-500/20 text-slate-300 border-slate-500/40',
  }
  return (
    <span className={`text-xs px-2 py-1 rounded border ${map[status] || map.draft}`}>{status}</span>
  )
}

export default memo(function NoticeListItem({ notice, onEdit, onDelete }) {
  return (
    <div className="flex items-start gap-4 bg-slate-900/70 border border-blue-500/20 rounded-2xl p-4">
      {notice.attachment && (
        <img src={notice.attachment} alt="attachment" className="w-24 h-24 object-cover rounded-xl border border-blue-500/20" />
      )}
      <div className="flex-1">
        <div className="flex items-center justify-between gap-3">
          <h4 className="text-white font-semibold">{notice.title}</h4>
          <StatusBadge status={notice.status} />
        </div>
        <p className="text-blue-200/80 text-sm mt-1">{notice.content}</p>
        <div className="flex items-center justify-end gap-2 mt-3">
          <button onClick={() => onEdit(notice)} className="text-blue-300 hover:text-white px-3 py-1 rounded bg-blue-500/10 hover:bg-blue-500/20 transition">Edit</button>
          <button onClick={() => onDelete(notice)} className="text-red-300 hover:text-white px-3 py-1 rounded bg-red-500/10 hover:bg-red-500/20 transition">Delete</button>
        </div>
      </div>
    </div>
  )
})
