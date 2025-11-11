export const createTablesSQL = `
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS hikes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  hike_date INTEGER NOT NULL,
  parking INTEGER NOT NULL DEFAULT 0,
  length_km REAL NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('Easy','Moderate','Hard')),
  description TEXT,
  elevation_gain_m INTEGER,
  max_group_size INTEGER,
  created_at INTEGER DEFAULT (CAST(strftime('%s','now') AS INTEGER) * 1000)
);
`;
