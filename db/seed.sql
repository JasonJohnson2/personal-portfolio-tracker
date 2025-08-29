INSERT INTO accounts (id, name, base_ccy) VALUES ('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa','Main','USD') ON CONFLICT(id) DO NOTHING;
INSERT INTO positions (account_id, symbol, type, qty, avg_cost) VALUES ('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa','AAPL','equity',10,170),('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa','BTC-USD','crypto',0.1,30000) ON CONFLICT(account_id, symbol, type) DO UPDATE SET qty=excluded.qty, avg_cost=excluded.avg_cost;
INSERT INTO watchlists (id, name) VALUES ('bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb','Default') ON CONFLICT(id) DO NOTHING;
INSERT INTO watchlist_symbols (watchlist_id, symbol) VALUES ('bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb','AAPL'),('bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb','MSFT'),('bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb','NVDA'),('bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb','BTC-USD') ON CONFLICT(watchlist_id, symbol) DO NOTHING;
INSERT INTO screeners (id, name, min_price, max_price) VALUES ('cccccccccccccccccccccccccccccccc','Price Band $10-$100',10,100) ON CONFLICT(id) DO NOTHING;
