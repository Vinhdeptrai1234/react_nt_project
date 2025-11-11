import SQLite from "react-native-sqlite-storage";

SQLite.DEBUG(true);
SQLite.enablePromise(true);

const DB_NAME = "mhike.db";
let db: SQLite.SQLiteDatabase | null = null;

export async function initDB() {
  if (db) return db;
  db = await SQLite.openDatabase({ name: DB_NAME, location: "default" });
  await db.executeSql(
    `CREATE TABLE IF NOT EXISTS hikes (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			name TEXT NOT NULL,
			location TEXT,
			date TEXT,
			difficulty TEXT,
			notes TEXT
		);`
  );
  return db;
}

export async function getHikes() {
  const database = await initDB();
  const [results] = await database.executeSql(
    "SELECT * FROM hikes ORDER BY id DESC;"
  );
  const rows = results.rows;
  const list: any[] = [];
  for (let i = 0; i < rows.length; i++) list.push(rows.item(i));
  return list;
}

export async function insertHike(hike: {
  name: string;
  location?: string;
  date?: string;
  difficulty?: string;
  notes?: string;
}) {
  const database = await initDB();
  const result = await database.executeSql(
    `INSERT INTO hikes (name, location, date, difficulty, notes) VALUES (?, ?, ?, ?, ?);`,
    [
      hike.name,
      hike.location || "",
      hike.date || "",
      hike.difficulty || "",
      hike.notes || "",
    ]
  );
  // result[0].insertId may be available
  return result;
}

export async function updateHike(
  id: number,
  hike: Partial<{
    name: string;
    location: string;
    date: string;
    difficulty: string;
    notes: string;
  }>
) {
  const database = await initDB();
  await database.executeSql(
    `UPDATE hikes SET name = ?, location = ?, date = ?, difficulty = ?, notes = ? WHERE id = ?;`,
    [
      hike.name || "",
      hike.location || "",
      hike.date || "",
      hike.difficulty || "",
      hike.notes || "",
      id,
    ]
  );
}

export async function deleteHike(id: number) {
  const database = await initDB();
  await database.executeSql(`DELETE FROM hikes WHERE id = ?;`, [id]);
}

export async function searchHikes(q: string) {
  const database = await initDB();
  const like = `%${q}%`;
  const [results] = await database.executeSql(
    `SELECT * FROM hikes WHERE name LIKE ? OR location LIKE ? ORDER BY id DESC;`,
    [like, like]
  );
  const rows = results.rows;
  const list: any[] = [];
  for (let i = 0; i < rows.length; i++) list.push(rows.item(i));
  return list;
}
