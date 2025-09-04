import { useEffect, useMemo, useState } from 'react'
import { getPositions, getPrices, upsertPosition, placePaperOrder, listPaperOrders } from './api'

import WatchlistsPanel from './WatchlistsPanel'
import ScreenerPanel from './ScreenerPanel'

function TradeControls({ symbol }: { symbol: string }){
  const [qty, setQty] = useState(1)
  const [busy, setBusy] = useState<'buy'|'sell'|null>(null)
  async function go(side:'buy'|'sell'){ try{ setBusy(side); await placePaperOrder({ symbol, side, qty, type:'market' }); alert(`Placed ${side} ${qty} ${symbol}`) } finally { setBusy(null) } }
  return (<div style={{display:'flex',gap:6}}>
    <input type="number" min={1} step="1" value={qty} onChange={e=>setQty(Number(e.target.value))} style={{width:70}}/>
    <button onClick={()=>go('buy')} disabled={busy!==null}>{busy==='buy'?'Buying…':'Buy'}</button>
    <button onClick={()=>go('sell')} disabled={busy!==null}>{busy==='sell'?'Selling…':'Sell'}</button>
  </div>)
}

function OrdersPanel(){
  const [orders, setOrders] = useState<any[]|null>(null)
  const [status, setStatus] = useState<'all'|'open'|'closed'|'canceled'>('all')
  async function refresh(s=status){ const data = await listPaperOrders(s); setOrders(data) }
  useEffect(()=>{ refresh() }, [])
  return (<div className="card"><div className="flex"><h2>Paper Orders</h2>
    <div className="small"><select value={status} onChange={async e=>{const s=e.target.value as any; setStatus(s); await refresh(s)}}>
      <option value="all">all</option><option value="open">open</option><option value="closed">closed</option><option value="canceled">canceled</option></select></div></div>
    {!orders && <div className="small">Loading…</div>}
    {orders && <table><thead><tr><th>Time</th><th>Symbol</th><th>Side</th><th>Qty</th><th>Type</th><th>Status</th></tr></thead><tbody>
      {orders.map((o:any)=>(<tr key={o.id}><td>{new Date(o.created_at).toLocaleString()}</td><td>{o.symbol}</td><td>{o.side}</td><td>{o.qty}</td><td>{o.type}</td><td>{o.status}</td></tr>))}
    </tbody></table>}
  </div>)
}

export default function App(){
  const [rows,setRows]=useState<any[]>([])
  const [priceMap,setPriceMap]=useState<Record<string, number|null>>({})
  useEffect(()=>{(async()=>{const data=await getPositions(); setRows(data); const syms=Array.from(new Set(data.map((r:any)=>r.symbol))); if(syms.length){const pm=await getPrices(syms); setPriceMap(pm)}})()},[])
  const enriched=useMemo(()=>rows.map(r=>{const mkt=priceMap[r.symbol]??null; const value=mkt?Number(mkt)*Number(r.qty):null; const cost=Number(r.avg_cost)*Number(r.qty); const upnl=value!==null? value-cost:null; const upnlPct=value!==null? (upnl!/cost)*100:null; return {...r,mkt,value,cost,upnl,upnlPct}}),[rows,priceMap])
  const total=useMemo(()=>enriched.reduce((a,r)=>a+(r.value??0),0),[enriched])
  const [activeWatchlistId, setActiveWatchlistId] = useState<string | undefined>(undefined)

  return (<div className="container">
    <h1>Portfolio Tracker</h1>
    <AddPosition/>
    <div className='card'><div className='flex'><h2>Positions</h2><div className='small'>Total value: {total?`$${total.toFixed(2)}`:'—'}</div></div>
    <table><thead><tr><th>Symbol</th><th>Type</th><th>Qty</th><th>Avg Cost</th><th>Last</th><th>Value</th><th>U/PnL</th><th>Trade</th></tr></thead><tbody>
      {enriched.map((r:any)=>(<tr key={r.id}><td>{r.symbol}</td><td>{r.type}</td><td>{Number(r.qty)}</td><td>${Number(r.avg_cost).toFixed(2)}</td><td>{r.mkt?`$${Number(r.mkt).toFixed(2)}`:'—'}</td><td>{r.value?`$${r.value.toFixed(2)}`:'—'}</td><td className={r.upnl>=0?'positive':'negative'}>{r.upnl!==null?`$${r.upnl.toFixed(2)} (${r.upnlPct!.toFixed(2)}%)`:'—'}</td><td><TradeControls symbol={r.symbol}/></td></tr>))}
    </tbody></table></div>
    <OrdersPanel/>
  </div>)

  // inside your default App() component's return:
<div className='container'>
  <h1>Portfolio Tracker</h1>

  <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:16}}>
    <WatchlistsPanel onPick={setActiveWatchlistId} />
    <ScreenerPanel watchlistId={activeWatchlistId} />
  </div>

  {/* existing AddPosition, Positions table, OrdersPanel ... */}
</div>

}

function AddPosition(){
  const [accountId,setAccountId]=useState('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
  const [symbol,setSymbol]=useState('AAPL')
  const [type,setType]=useState<'equity'|'crypto'>('equity')
  const [qty,setQty]=useState(1)
  const [avgCost,setAvgCost]=useState(100)
  return (<form className='card' onSubmit={async e=>{e.preventDefault(); await upsertPosition({accountId, symbol:symbol.toUpperCase(), type, qty, avgCost}); location.reload();}}>
    <h2>Add / Update Position</h2>
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
      <input placeholder='Account ID (UUID)' value={accountId} onChange={e=>setAccountId(e.target.value)} required/>
      <input placeholder='Symbol (e.g. AAPL or BTC-USD)' value={symbol} onChange={e=>setSymbol(e.target.value)} required/>
      <select value={type} onChange={e=>setType(e.target.value as any)}><option value='equity'>Equity</option><option value='crypto'>Crypto</option></select>
      <input type='number' step='any' placeholder='Quantity' value={qty} onChange={e=>setQty(Number(e.target.value))} required/>
      <input style={{gridColumn:'1/3'}} type='number' step='any' placeholder='Avg Cost' value={avgCost} onChange={e=>setAvgCost(Number(e.target.value))} required/>
    </div><div style={{marginTop:8}}><button>Save</button></div>
  </form>)
}
