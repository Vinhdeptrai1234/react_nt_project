import AsyncStorage from "@react-native-async-storage/async-storage";
import { Hike } from "../types/hike";

const KEY = "hikes";

/** Load all hikes from storage */
export async function loadHikes(): Promise<Hike[]> {
  const raw = await AsyncStorage.getItem(KEY);
  return raw ? (JSON.parse(raw) as Hike[]) : [];
}

/** Save a new hike */
export async function saveHike(h: Hike) {
  const list = await loadHikes();
  const id = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
  const item = { ...h, id, createdAt: Date.now() };
  await AsyncStorage.setItem(KEY, JSON.stringify([item, ...list]));
  return item;
}

/** Update an existing hike (by id) */
export async function updateHike(updated: Hike) {
  const list = await loadHikes();
  const newList = list.map((item) =>
    item.id === updated.id ? { ...item, ...updated } : item
  );
  await AsyncStorage.setItem(KEY, JSON.stringify(newList));
  return updated;
}

/** Delete one hike by id */
export async function deleteHike(id: string | number) {
  const list = await loadHikes();
  const newList = list.filter((item) => String(item.id) !== String(id));
  await AsyncStorage.setItem(KEY, JSON.stringify(newList));
}

/** Delete all hikes */
export async function clearAllHikes() {
  await AsyncStorage.removeItem(KEY);
}
