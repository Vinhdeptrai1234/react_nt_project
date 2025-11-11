import React, { useState, useEffect } from "react";
import { SafeAreaView, StatusBar } from "react-native";
import HikeList from "./screens/HikeList";
import HikeForm from "./screens/HikeForm";
import { initDB } from "./services/db";

export default function App() {
  const [mode, setMode] = useState<"list" | "add" | "edit">("list");
  const [editing, setEditing] = useState<any | null>(null);

  useEffect(() => {
    initDB().catch(console.error);
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      {mode === "list" && (
        <HikeList
          onAdd={() => {
            setEditing(null);
            setMode("add");
          }}
          onEdit={(hike) => {
            setEditing(hike);
            setMode("edit");
          }}
        />
      )}

      {(mode === "add" || mode === "edit") && (
        <HikeForm
          initial={mode === "edit" ? editing : null}
          onSaved={() => {
            setMode("list");
          }}
          onCancel={() => setMode("list")}
        />
      )}
    </SafeAreaView>
  );
}
