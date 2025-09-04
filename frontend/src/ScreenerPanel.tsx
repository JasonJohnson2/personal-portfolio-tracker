import { useState } from 'react'
import { runScreenerBasic } from './api'

export default function ScreenerPanel({ watchlistId }: { watchlistId?: string }) {
  const [minPrice, setMinPrice] = useState<number | undefined>(10)
  const [maxPrice, setMaxPrice] = useState<number | undefined>(100)
  const [hits, setHits] = useState<any[] | null>(null)
  const [loading, setLoading] = useState(false)

  async function run() {
    if (!watchlistId) return
    setLoading(true)
    try {
      const data = await runScreenerBasic({ watchlistId, minPrice, maxPrice })
      setHits(data)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <div className="flex"><h2>Screener (Price Band)</h2></div>
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr auto', gap:8}}>
        <input type="number" step="any" placeholder="Min price" value={minPrice ?? ''} onChange={e=>setMinPrice(e.target.value === '' ? undefined : Number(e.target.value))} />
        <input type="number" step="any" placeholder="Max price" value={maxPrice ?? ''} onChange={e=>setMaxPrice(e.target.value === '' ? undefined : Number(e.target.value))} />
        <button onClick={run} disabled={!watchlistId || loading}>{loading ? 'Running...' : 'Run'}</button>
      </div>
      {hits && (
        <div style={{marginTop:12}}>
          <table>
            <thead><tr><th>Symbol</th><th>Price</th></tr></thead>
            <tbody>{hits.map((h, i) => (<tr key={i}><td>{h.symbol}</td><td>${Number(h.price).toFixed(2)}</td></tr>))}</tbody>
          </table>
          {!hits.length && <div className="small" style={{marginTop:8}}>No matches.</div>}
        </div>
      )}
      {!watchlistId && <div className="small" style={{marginTop:8}}>Pick a watchlist above to enable the screener.</div>}
    </div>
  )
}
