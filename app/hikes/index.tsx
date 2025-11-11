import React, { useCallback, useState } from "react";
import {
  FlatList,
  Pressable,
  View,
  Text,
  StyleSheet,
  Alert,
  TextInput,
  Button,
} from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { loadHikes, deleteHike, clearAllHikes } from "../../lib/storage";

export default function Home() {
  const router = useRouter();
  const [data, setData] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [kmFilter, setKmFilter] = useState("");

  const loadData = useCallback(async () => {
    const list = await loadHikes();
    setData(list);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  // Hàm xử lý xóa 1 item
  const handleDelete = (id: string) => {
    console.log("Delete pressed", id);
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this hike?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await deleteHike(id);
            await loadData();
          },
        },
      ]
    );
  };

  // Hàm xóa tất cả
  const handleClearAll = () => {
    Alert.alert("Delete All", "Are you sure you want to delete all hikes?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete All",
        style: "destructive",
        onPress: async () => {
          await clearAllHikes();
          await loadData();
        },
      },
    ]);
  };

  // Lọc dữ liệu theo search và km
  const filtered = data.filter((item) => {
    const matchesName = item.name
      ?.toLowerCase()
      .includes(search.toLowerCase().trim());
    const matchesKm =
      kmFilter.trim() === "" || Number(item.lengthKm) >= Number(kmFilter);
    return matchesName && matchesKm;
  });

  return (
    <View style={styles.container}>
      {/* Thanh tìm kiếm */}
      <View style={styles.searchRow}>
        <TextInput
          placeholder="Search by name..."
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
        />
        <TextInput
          placeholder="Min km"
          style={styles.kmInput}
          value={kmFilter}
          keyboardType="numeric"
          onChangeText={setKmFilter}
        />
        <Button title="Clear All" onPress={handleClearAll} />
      </View>

      {/* Danh sách */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={<Text>No hikes yet. Tap + to add.</Text>}
        renderItem={({ item }) => (
          <View
            style={[styles.card, styles.cardSpacing]}
            pointerEvents="box-none"
          >
            <Pressable
              onPress={() => router.push(`/hikes/${item.id}`)}
              style={{ flex: 1 }}
            >
              <Text style={styles.title}>{item.name}</Text>
              <Text>
                {item.location} • {item.lengthKm} km • {item.difficulty}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => handleDelete(item.id)}
              style={styles.deleteBtn}
            >
              <Text style={{ color: "white", fontWeight: "600" }}>Delete</Text>
            </Pressable>
          </View>
        )}
      />

      {/* Nút thêm */}
      <Pressable style={styles.fab} onPress={() => router.push("/hikes/add")}>
        <Text style={{ color: "white", fontWeight: "bold", fontSize: 20 }}>
          ＋
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    marginTop: 8,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#fff",
  },
  kmInput: {
    width: 80,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#fff",
  },
  card: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    elevation: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardSpacing: { marginBottom: 10 },
  title: { fontWeight: "600", fontSize: 16, marginBottom: 4 },
  deleteBtn: {
    backgroundColor: "#e53935",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 30,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#5E4AE3",
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },
});
