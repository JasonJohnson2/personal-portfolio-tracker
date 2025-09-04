import { useEffect, useState } from 'react'
import { getWatchlists, createWatchlist, addSymbolToWatchlist } from './api'

export default function WatchlistsPanel({ onPick }: { onPick: (id: string) => void }) {
  const [lists, setLists] = useState<any[]>([])
  const [name, setName] = useState('')
  const [symbol, setSymbol] = useState('')
  const [targetList, setTargetList] = useState<string>('')

  async function refresh() {
    const data = await getWatchlists()
    setLists(data)
    if (!targetList && data[0]?.id) setTargetList(data[0].id)
  }

  useEffect(() => { refresh() }, [])

  return (
    <div className="card">
      <div className="flex"><h2>Watchlists</h2></div>

      <div style={{display:'grid', gridTemplateColumns:'1fr auto', gap:8}}>
        <input placeholder="New watchlist name" value={name} onChange={e=>setName(e.target.value)} />
        <button onClick={async ()=>{ if(!name.trim()) return; await createWatchlist(name.trim()); setName(''); await refresh(); }}>
          Create
        </button>
      </div>

      <div style={{marginTop:12}}>
        {lists.map(w => (
          <div key={w.id} style={{display:'flex', alignItems:'center', justifyContent:'space-between', padding:'6px 0', borderBottom:'1px solid #eee'}}>
            <div><strong>{w.name}</strong> <span className="small">({w.symbols} symbols)</span></div>
            <div style={{display:'flex', gap:8}}>
              <button onClick={()=>onPick(w.id)}>Use</button>
            </div>
          </div>
        ))}
        {!lists.length && <div className="small" style={{marginTop:8}}>No watchlists yet.</div>}
      </div>

      <div style={{marginTop:12, display:'grid', gridTemplateColumns:'1fr 1fr auto', gap:8}}>
        <select value={targetList} onChange={e=>setTargetList(e.target.value)}>
          {lists.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
        </select>
        <input placeholder="Add symbol (e.g. NVDA)" value={symbol} onChange={e=>setSymbol(e.target.value)} />
        <button onClick={async ()=>{ if(!targetList || !symbol.trim()) return; await addSymbolToWatchlist(targetList, symbol.trim().toUpperCase()); setSymbol(''); await refresh(); }}>
          Add
        </button>
      </div>
    </div>
  )
}
