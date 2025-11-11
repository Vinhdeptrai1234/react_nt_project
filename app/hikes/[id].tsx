import React, { useEffect, useState } from "react";
import { View, Text, Button, Alert, StyleSheet, TextInput } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { loadHikes, updateHike, deleteHike } from "../../lib/storage";

export default function HikeDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [hike, setHike] = useState<any | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [edited, setEdited] = useState<any>({});

  useEffect(() => {
    (async () => {
      const all = await loadHikes();
      const found = all.find((x) => String(x.id) === String(id));
      setHike(found);
      setEdited(found);
    })();
  }, [id]);

  if (!hike) {
    return (
      <View style={styles.center}>
        <Text>No hike found.</Text>
        <Button title="Back" onPress={() => router.back()} />
      </View>
    );
  }

  const handleSave = async () => {
    await updateHike(edited);
    Alert.alert("Updated!", "Hike details saved.");
    setEditMode(false);
  };

  const handleDelete = () => {
    Alert.alert("Confirm", "Delete this hike?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deleteHike(String(id));
          router.replace("/hikes");
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Hike Details</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          editable={editMode}
          style={styles.input}
          value={edited.name}
          onChangeText={(t) => setEdited({ ...edited, name: t })}
        />
        <Text style={styles.label}>Location</Text>
        <TextInput
          editable={editMode}
          style={styles.input}
          value={edited.location}
          onChangeText={(t) => setEdited({ ...edited, location: t })}
        />
        <Text style={styles.label}>Length (km)</Text>
        <TextInput
          editable={editMode}
          style={styles.input}
          keyboardType="decimal-pad"
          value={String(edited.lengthKm)}
          onChangeText={(t) =>
            setEdited({ ...edited, lengthKm: Number(t) || 0 })
          }
        />
        <Text style={styles.label}>Difficulty</Text>
        <TextInput
          editable={editMode}
          style={styles.input}
          value={edited.difficulty}
          onChangeText={(t) => setEdited({ ...edited, difficulty: t })}
        />
      </View>

      <View style={styles.row}>
        {!editMode ? (
          <Button title="Edit" onPress={() => setEditMode(true)} />
        ) : (
          <Button title="Save" onPress={handleSave} />
        )}
        <View style={{ width: 12 }} />
        <Button title="Delete" color="#c00" onPress={handleDelete} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { fontSize: 20, fontWeight: "700", marginBottom: 12 },
  card: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    marginBottom: 10,
  },
  label: { fontWeight: "600", color: "#333", marginBottom: 4 },
  row: { flexDirection: "row", justifyContent: "space-between" },
});
