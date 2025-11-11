import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  Button,
  StyleSheet,
  Alert,
} from "react-native";
import Card from "../components/Card";
import { getHikes, deleteHike, searchHikes } from "../services/db";

type Hike = {
  id: number;
  name: string;
  location?: string;
  date?: string;
  difficulty?: string;
  notes?: string;
};

type Props = {
  onAdd: () => void;
  onEdit: (hike: Hike) => void;
};

export default function HikeList({ onAdd, onEdit }: Props) {
  const [hikes, setHikes] = useState<Hike[]>([]);
  const [query, setQuery] = useState("");

  async function load() {
    const list = await getHikes();
    setHikes(list);
  }

  useEffect(() => {
    load();
  }, []);

  async function onSearch(text: string) {
    setQuery(text);
    if (!text.trim()) {
      await load();
      return;
    }
    const list = await searchHikes(text);
    setHikes(list);
  }

  function confirmDelete(id: number) {
    Alert.alert("Delete", "Delete this hike?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deleteHike(id);
          await load();
        },
      },
    ]);
  }

  function renderItem({ item }: { item: Hike }) {
    return (
      <Card style={{ padding: 12 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.meta}>
              {item.location} • {item.date} • {item.difficulty}
            </Text>
          </View>
          <View style={{ marginLeft: 12 }}>
            <Button title="Edit" onPress={() => onEdit(item)} />
            <View style={{ height: 6 }} />
            <Button
              title="Delete"
              color="#d33"
              onPress={() => confirmDelete(item.id)}
            />
          </View>
        </View>
      </Card>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.searchRow}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or location"
          value={query}
          onChangeText={onSearch}
        />
        <Button title="Add" onPress={onAdd} />
      </View>

      <FlatList
        data={hikes}
        keyExtractor={(i) => String(i.id)}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 60 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  searchRow: { flexDirection: "row", padding: 12, alignItems: "center" },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginRight: 8,
    backgroundColor: "#fff",
  },
  name: { fontSize: 16, fontWeight: "700" },
  meta: { color: "#666", marginTop: 4 },
});
