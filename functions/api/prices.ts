// functions/api/trade/place.ts

function corsHeaders() {
  return {
    "content-type": "application/json; charset=utf-8",
    "access-control-allow-origin": "*",
    "access-control-allow-headers": "content-type, authorization",
    "access-control-allow-methods": "GET, POST, OPTIONS",
  };
}

type Env = { ALPACA_KEY_ID: string; ALPACA_SECRET_KEY: string };

export const onRequestOptions: PagesFunction<Env> = async () =>
  new Response(null, { headers: corsHeaders() });

export const onRequestPost: PagesFunction<Env> = async (ctx) => {
  const headers = corsHeaders();
  try {
    const b = await ctx.request.json();
    const { symbol, side, qty, type = "market", limit_price } = b || {};
    if (!symbol || !side || !qty) {
      return new Response(JSON.stringify({ error: "Missing fields" }), {
        status: 400,
        headers,
      });
    }

    // Build the payload cleanly (no fancy spread)
    const payload: Record<string, any> = {
      symbol,
      qty,
      side,
      type,
      time_in_force: "day",
    };
    if (type === "limit" && typeof limit_price === "number") {
      payload.limit_price = limit_price;
    }

    const res = await fetch("https://paper-api.alpaca.markets/v2/orders", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "APCA-API-KEY-ID": ctx.env.ALPACA_KEY_ID,
        "APCA-API-SECRET-KEY": ctx.env.ALPACA_SECRET_KEY,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      return new Response(JSON.stringify({ error: data }), {
        status: res.status,
        headers,
      });
    }
    return new Response(JSON.stringify({ ok: true, order: data }), { headers });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers,
    });
  }
};
