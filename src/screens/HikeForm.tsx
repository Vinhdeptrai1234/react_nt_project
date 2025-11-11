import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  Alert,
  ScrollView,
} from "react-native";
import Card from "../components/Card";
import { insertHike, updateHike } from "../services/db";

type Hike = {
  id?: number;
  name: string;
  location?: string;
  date?: string;
  difficulty?: string;
  notes?: string;
};

type Props = {
  initial?: Hike | null;
  onSaved: () => void;
  onCancel?: () => void;
};

export default function HikeForm({ initial, onSaved, onCancel }: Props) {
  const [name, setName] = useState(initial?.name || "");
  const [location, setLocation] = useState(initial?.location || "");
  const [date, setDate] = useState(initial?.date || "");
  const [difficulty, setDifficulty] = useState(initial?.difficulty || "");
  const [notes, setNotes] = useState(initial?.notes || "");

  useEffect(() => {
    if (initial) {
      setName(initial.name || "");
      setLocation(initial.location || "");
      setDate(initial.date || "");
      setDifficulty(initial.difficulty || "");
      setNotes(initial.notes || "");
    }
  }, [initial]);

  function validate() {
    if (!name.trim()) {
      Alert.alert("Validation", "Name is required");
      return false;
    }
    if (!date.trim()) {
      Alert.alert("Validation", "Date is required");
      return false;
    }
    if (!difficulty.trim()) {
      Alert.alert("Validation", "Difficulty is required");
      return false;
    }
    return true;
  }

  function onSubmit() {
    if (!validate()) return;
    Alert.alert(
      "Confirm",
      initial ? "Save changes to this hike?" : "Create new hike?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "OK",
          onPress: async () => {
            try {
              if (initial && initial.id) {
                await updateHike(initial.id, {
                  name,
                  location,
                  date,
                  difficulty,
                  notes,
                });
              } else {
                await insertHike({ name, location, date, difficulty, notes });
              }
              onSaved();
            } catch (e) {
              Alert.alert("Error", String(e));
            }
          },
        },
      ]
    );
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 12 }}>
      <Card>
        <View style={styles.row}>
          <Text style={styles.label}>Name *</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Trail name"
          />
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Location</Text>
          <TextInput
            style={styles.input}
            value={location}
            onChangeText={setLocation}
            placeholder="City / area"
          />
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Date *</Text>
          <TextInput
            style={styles.input}
            value={date}
            onChangeText={setDate}
            placeholder="YYYY-MM-DD"
          />
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Difficulty *</Text>
          <TextInput
            style={styles.input}
            value={difficulty}
            onChangeText={setDifficulty}
            placeholder="Easy / Medium / Hard"
          />
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Notes</Text>
          <TextInput
            style={[styles.input, { minHeight: 80 }]}
            value={notes}
            onChangeText={setNotes}
            placeholder="Optional notes"
            multiline
          />
        </View>

        <View style={styles.buttons}>
          <Button title="Save" onPress={onSubmit} />
          <View style={{ width: 12 }} />
          <Button
            title="Cancel"
            color="#888"
            onPress={() => onCancel && onCancel()}
          />
        </View>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { marginBottom: 12 },
  label: { fontWeight: "600", marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: "#fff",
  },
  buttons: { flexDirection: "row", justifyContent: "flex-start", marginTop: 8 },
});
