// functions/api/prices.js

function corsHeaders() {
  return {
    "content-type": "application/json; charset=utf-8",
    "access-control-allow-origin": "*",
    "access-control-allow-headers": "content-type, authorization",
    "access-control-allow-methods": "GET, POST, OPTIONS",
  };
}

export const onRequestOptions = async () =>
  new Response(null, { headers: corsHeaders() });

async function getEquityPrice(symbol, env) {
  if (!env.ALPACA_KEY_ID || !env.ALPACA_SECRET_KEY) return null;

  const url = `https://data.alpaca.markets/v2/stocks/${encodeURIComponent(
    symbol
  )}/snapshot`;

  const res = await fetch(url, {
    headers: {
      "APCA-API-KEY-ID": env.ALPACA_KEY_ID,
      "APCA-API-SECRET-KEY": env.ALPACA_SECRET_KEY,
    },
  });

  if (!res.ok) return null;
  const data = await res.json();
  return data?.latestTrade?.p ?? null;
}

const COIN_ID_MAP = { BTC: "bitcoin", ETH: "ethereum", SOL: "solana" };

async function getCryptoPrice(pair) {
  const [asset, fiat = "USD"] = pair.split("-");
  const id = COIN_ID_MAP[(asset || "").toUpperCase()] || null;
  if (!id) return null;

  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=${fiat.toLowerCase()}`;
  const res = await fetch(url);
  if (!res.ok) return null;

  const data = await res.json();
  return data?.[id]?.[fiat.toLowerCase()] ?? null;
}

export const onRequestGet = async (ctx) => {
  const headers = corsHeaders();

  try {
    const url = new URL(ctx.request.url);
    const symbols = (url.searchParams.get("symbols") || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const out = {};
    for (const s of symbols) {
      out[s] = s.includes("-")
        ? await getCryptoPrice(s)
        : await getEquityPrice(s, ctx.env);
    }

    return new Response(JSON.stringify(out), { headers });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers,
    });
  }
};
