import React from "react";
import { View, Text, Button, Alert, StyleSheet } from "react-native";
import { usePending } from "../../store/pending"; // was '../store/pending'
import { useRouter } from "expo-router";
import { saveHike } from "../../lib/storage"; // was '../lib/storage'

function formatDate(epoch?: number) {
  if (!epoch) return "-";
  const d = new Date(Number(epoch));
  if (isNaN(d.getTime())) return "-";
  return d.toISOString().slice(0, 10);
}

export default function Confirm() {
  const { pending, clear } = usePending();
  const router = useRouter();

  if (!pending) {
    return (
      <View style={styles.emptyWrap}>
        <Text>No data. Go back to Add Hike.</Text>
        <View style={styles.spacer} />
        <Button title="Back" onPress={() => router.back()} />
      </View>
    );
  }

  const onSave = async () => {
    try {
      await saveHike(pending);
      clear();
      Alert.alert("Saved", "Hike temporarily saved to device.");
      // quay về danh sách hikes (route group là /hikes)
      router.replace("/hikes");
    } catch (e) {
      Alert.alert("Error", String(e));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Confirm Hike</Text>

      <View style={styles.card}>
        <Text style={styles.row}>Name: {pending.name}</Text>
        <Text style={styles.row}>Location: {pending.location || "-"}</Text>
        <Text style={styles.row}>
          Date: {formatDate(pending.hikeDateEpoch)}
        </Text>
        <Text style={styles.row}>
          Parking: {pending.parking ? "Yes" : "No"}
        </Text>
        <Text style={styles.row}>Length: {pending.lengthKm ?? "-"} km</Text>
        <Text style={styles.row}>Difficulty: {pending.difficulty || "-"}</Text>
        {pending.description ? (
          <Text style={styles.row}>Description: {pending.description}</Text>
        ) : null}
        {typeof pending.elevationGainM === "number" ? (
          <Text style={styles.row}>
            Elevation gain: {pending.elevationGainM} m
          </Text>
        ) : null}
        {typeof pending.maxGroupSize === "number" ? (
          <Text style={styles.row}>Max group size: {pending.maxGroupSize}</Text>
        ) : null}
      </View>

      <View style={styles.actions}>
        <View style={styles.actionBtn}>
          <Button title="Back" onPress={() => router.back()} />
        </View>
        <View style={styles.actionBtn}>
          <Button title="Save" onPress={onSave} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 12 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  row: { marginBottom: 6, color: "#111" },
  actions: { flexDirection: "row", justifyContent: "space-between" },
  actionBtn: { flex: 1, marginHorizontal: 6 },
  spacer: { height: 12 },
  emptyWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
});
