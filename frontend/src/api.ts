export async function getPositions(){const r=await fetch('/api/positions'); if(!r.ok) throw new Error('Failed'); return r.json();}
export async function upsertPosition(p:{accountId:string;symbol:string;type:'equity'|'crypto';qty:number;avgCost:number;}){const r=await fetch('/api/positions',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(p)}); if(!r.ok) throw new Error('Failed');}
export async function getPrices(symbols:string[]){const q=symbols.join(','); const r=await fetch(`/api/prices?symbols=${encodeURIComponent(q)}`); if(!r.ok) throw new Error('Failed'); return r.json();}
export async function placePaperOrder(p:{symbol:string; side:'buy'|'sell'; qty:number; type?:'market'|'limit'; limit_price?:number}){ const r = await fetch('/api/trade/place', { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify(p)}); if(!r.ok) throw new Error('Failed to place order'); return r.json(); }
export async function listPaperOrders(status:string='all'){ const r = await fetch(`/api/trade/orders?status=${encodeURIComponent(status)}`); if(!r.ok) throw new Error('Failed to list orders'); return r.json(); }
export async function getWatchlists(){
  const r = await fetch('/api/watchlists');
  if(!r.ok) throw new Error('Failed to load watchlists');
  return r.json();
}

export async function createWatchlist(name: string){
  const r = await fetch('/api/watchlists', {
    method:'POST', headers:{'content-type':'application/json'},
    body: JSON.stringify({ name })
  });
  if(!r.ok) throw new Error('Failed to create watchlist');
}

export async function addSymbolToWatchlist(watchlistId: string, symbol: string){
  const r = await fetch('/api/watchlists/add-symbol', {
    method:'POST', headers:{'content-type':'application/json'},
    body: JSON.stringify({ watchlistId, symbol })
  });
  if(!r.ok) throw new Error('Failed to add symbol');
}

export async function runScreenerBasic(params:{watchlistId:string; minPrice?:number; maxPrice?:number}){
  const r = await fetch('/api/screeners/basic', {
    method:'POST', headers:{'content-type':'application/json'},
    body: JSON.stringify(params)
  });
  if(!r.ok) throw new Error('Screener failed');
  return r.json();
}
