export const onRequestGet: PagesFunction = async (ctx) => {
  const url = new URL(ctx.request.url);
  const wl = url.searchParams.get('watchlistId') || 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb';
  const min = url.searchParams.get('minPrice');
  const max = url.searchParams.get('maxPrice');
  const body = { watchlistId: wl, minPrice: min ? Number(min) : undefined, maxPrice: max ? Number(max) : undefined };
  const res = await fetch(new URL('/api/screeners/basic', ctx.request.url).toString(), {
    method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body)
  });
  const hits = await res.json();
  return new Response(JSON.stringify({ ts: new Date().toISOString(), hits }), {
    headers: { 'content-type': 'application/json; charset=utf-8', 'access-control-allow-origin': '*' }
  });
};
