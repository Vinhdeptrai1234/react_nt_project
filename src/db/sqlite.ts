import * as SQLite from "expo-sqlite";
import { createTablesSQL } from "./schema";
import { Hike } from "../models/Hike";

// thay openDatabaseSync (không tồn tại) bằng openDatabase
const db = SQLite.openDatabase("mhike.db");

// execSqlAsync: đơn giản hóa kiểu tx và xử lý transaction error đúng
function execSqlAsync(
  sql: string,
  params: any[] = []
): Promise<{ rows: any; insertId?: number; rowsAffected?: number }> {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx: any) => {
        tx.executeSql(
          sql,
          params,
          (_tx: any, result: any) => {
            // map result thành object đơn giản để TypeScript không complain
            resolve({
              rows: result.rows,
              insertId: result.insertId,
              rowsAffected: result.rowsAffected,
            });
          },
          (_tx: any, error: any) => {
            reject(error);
            return false;
          }
        );
      },
      (txError: any) => {
        reject(txError);
      }
    );
  });
}

export async function initDB() {
  // Nếu createTablesSQL có nhiều câu lệnh, chia và chạy từng câu
  const parts = String(createTablesSQL)
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean);
  for (const p of parts) {
    // chạy từng câu lệnh; không cần openDatabaseSync
    await execSqlAsync(p);
  }
}

// --- CRUD
export async function insertHike(hike: Hike) {
  const {
    name,
    location,
    hikeDateEpoch,
    parking,
    lengthKm,
    difficulty,
    description,
    elevationGainM,
    maxGroupSize,
  } = hike;
  const res = await execSqlAsync(
    `INSERT INTO hikes
    (name, location, hike_date, parking, length_km, difficulty,
     description, elevation_gain_m, max_group_size)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      name,
      location,
      hikeDateEpoch,
      parking ? 1 : 0,
      lengthKm,
      difficulty,
      description,
      elevationGainM,
      maxGroupSize,
    ]
  );
  return res.insertId ?? null;
}

export async function getAllHikes() {
  const result: any = await execSqlAsync(
    "SELECT * FROM hikes ORDER BY id DESC",
    []
  );
  const rows = result.rows;
  const list: any[] = [];
  for (let i = 0; i < rows.length; i++) list.push(rows.item(i));
  return list;
}

export async function deleteHike(id: number) {
  await execSqlAsync("DELETE FROM hikes WHERE id = ?", [id]);
}
