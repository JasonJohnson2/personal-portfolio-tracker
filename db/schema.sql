CREATE TABLE IF NOT EXISTS accounts (id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))) ,name TEXT NOT NULL, base_ccy TEXT NOT NULL DEFAULT 'USD');
CREATE TABLE IF NOT EXISTS positions (id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))) ,account_id TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE, symbol TEXT NOT NULL, type TEXT NOT NULL CHECK (type IN ('equity','crypto')), qty REAL NOT NULL, avg_cost REAL NOT NULL, UNIQUE (account_id, symbol, type));
CREATE TABLE IF NOT EXISTS watchlists (id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))) ,name TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS watchlist_symbols (watchlist_id TEXT NOT NULL REFERENCES watchlists(id) ON DELETE CASCADE, symbol TEXT NOT NULL, UNIQUE (watchlist_id, symbol));
CREATE TABLE IF NOT EXISTS screeners (id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))) ,name TEXT NOT NULL, min_price REAL, max_price REAL);
