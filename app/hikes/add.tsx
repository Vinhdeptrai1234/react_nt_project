import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { hikeSchema } from "../../src/utils/validators";
import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Switch,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { usePending } from "../../store/pending"; // changed: correct relative path

export default function AddHikeScreen() {
  const router = useRouter();
  const { setPending } = usePending();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors /* remove isValid reliance */ },
  } = useForm({
    resolver: zodResolver(hikeSchema),
    mode: "onChange", // validate on change so we can enable/disable Next
    defaultValues: {
      name: "",
      location: "",
      hikeDateEpoch: Number(new Date().getTime()),
      parking: false,
      lengthKm: undefined, // use undefined so schema expects number / optional
      difficulty: "",
      description: "",
    },
  });

  const onSubmit = async (data: any) => {
    // chuẩn hoá dữ liệu
    const payload: any = {
      ...data,
      lengthKm:
        data.lengthKm === "" || data.lengthKm == null
          ? undefined
          : Number(data.lengthKm),
      hikeDateEpoch: data.hikeDateEpoch || Number(new Date().getTime()), // nếu không có thì đặt ngày hiện tại
      parking: Boolean(data.parking),
    };

    try {
      // quick feedback so we know the submit handler fired
      Alert.alert("onSubmit called", JSON.stringify(payload));

      setPending(payload);

      // try relative route first (stack screen name), fallback to absolute
      try {
        await router.push("/hikes/confirm");
      } catch (err) {
        try {
          await router.push("/hikes/confirm");
        } catch (err2) {
          Alert.alert("Navigation error", String(err2));
        }
      }
    } catch (e) {
      Alert.alert("Submit error", String(e));
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.select({ ios: "padding", android: undefined })}
      keyboardVerticalOffset={80}
    >
      <ScrollView
        contentContainerStyle={styles.wrap}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        <Text style={styles.header}>Add Hike</Text>

        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, value } }) => (
            <>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Trail name"
                value={value}
                onChangeText={onChange}
                returnKeyType="next"
              />
            </>
          )}
        />
        {errors.name && (
          <Text style={styles.err}>{String(errors.name?.message)}</Text>
        )}

        <Controller
          control={control}
          name="location"
          render={({ field: { onChange, value } }) => (
            <>
              <Text style={styles.label}>Location</Text>
              <TextInput
                style={styles.input}
                placeholder="City / Area"
                value={value}
                onChangeText={onChange}
              />
            </>
          )}
        />
        {errors.location && (
          <Text style={styles.err}>{String(errors.location?.message)}</Text>
        )}

        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Controller
              control={control}
              name="lengthKm"
              render={({ field: { onChange, value } }) => (
                <>
                  <Text style={styles.label}>Length (km)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. 8.5"
                    // show number as string in the input
                    value={value !== undefined ? String(value) : ""}
                    // convert user input to number (or undefined) before sending to form
                    onChangeText={(text) => {
                      // parseFloat sẽ trả NaN nếu không phải số
                      const parsed = parseFloat(text);
                      onChange(isNaN(parsed) ? undefined : parsed);
                    }}
                    keyboardType="decimal-pad"
                  />
                </>
              )}
            />
            {errors.lengthKm && (
              <Text style={styles.err}>{String(errors.lengthKm?.message)}</Text>
            )}
          </View>

          <View style={{ width: 12 }} />

          <View style={{ width: 120 }}>
            <Controller
              control={control}
              name="difficulty"
              render={({ field: { onChange, value } }) => (
                <>
                  <Text style={styles.label}>Difficulty</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Easy / Moderate / Hard"
                    value={value}
                    onChangeText={onChange}
                  />
                </>
              )}
            />
            {errors.difficulty && (
              <Text style={styles.err}>
                {String(errors.difficulty?.message)}
              </Text>
            )}
          </View>
        </View>

        <View style={styles.switchRow}>
          <Text style={styles.label}>Parking available</Text>
          <Controller
            control={control}
            name="parking"
            render={({ field: { onChange, value } }) => (
              <Switch value={!!value} onValueChange={onChange} />
            )}
          />
        </View>

        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, value } }) => (
            <>
              <Text style={styles.label}>Description (optional)</Text>
              <TextInput
                style={[styles.input, styles.textarea]}
                placeholder="Short notes about the hike"
                value={value}
                onChangeText={onChange}
                multiline
                numberOfLines={4}
              />
            </>
          )}
        />

        <View style={{ height: 16 }} />

        {/*
          Use watch to determine if required fields are filled and length is a number.
          Show a small debug block so it's obvious why NEXT might be disabled.
        */}
        {(() => {
          const nameVal = (watch("name") as string) ?? "";
          const locVal = (watch("location") as string) ?? "";
          const lengthVal = watch("lengthKm") as any; // may be number or string or undefined
          const diffVal = (watch("difficulty") as string) ?? "";

          // normalize number check: works if lengthVal is number or numeric string
          const numericLength =
            lengthVal === undefined || lengthVal === ""
              ? NaN
              : Number(lengthVal);

          // canProceed: name, location, difficulty non-empty + numeric length > 0
          const canProceed =
            nameVal.trim().length > 0 &&
            locVal.trim().length > 0 &&
            diffVal.trim().length > 0 &&
            !isNaN(numericLength) &&
            numericLength > 0;

          // debug text (helps thấy giá trị thực và lý do)
          const debugText = `name="${nameVal}", location="${locVal}", length=${String(
            lengthVal
          )}, difficulty="${diffVal}", numericLength=${String(
            numericLength
          )}, canProceed=${canProceed}`;


          const submit = handleSubmit(onSubmit);

          return (
            <>
              <Text style={{ color: "#666", marginBottom: 8 }}>
                {debugText}
              </Text>

              <TouchableOpacity
                onPress={() => {
                  if (!canProceed) {
                    Alert.alert(
                      "Incomplete",
                      "Please fill name, location, numeric length and difficulty before proceeding."
                    );
                    return;
                  }
                  submit();
                }}
                activeOpacity={0.8}
                style={[styles.btn, !canProceed && styles.btnDisabled]}
              >
                <Text
                  style={[
                    styles.btnText,
                    !canProceed && styles.btnTextDisabled,
                  ]}
                >
                  NEXT
                </Text>
              </TouchableOpacity>
            </>
          );
        })()}

        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrap: {
    padding: 16,
    paddingTop: 12,
    backgroundColor: "#f8f8f7",
  },
  header: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
  },
  label: { fontSize: 13, color: "#444", marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: "#e2e2e2",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#fff",
    marginBottom: 8,
  },
  textarea: { minHeight: 90, textAlignVertical: "top" },
  err: { color: "#c00", marginBottom: 8 },
  row: { flexDirection: "row", alignItems: "flex-start" },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 8,
  },
  btn: {
    backgroundColor: "#0b84ff",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  btnDisabled: { backgroundColor: "#9ec9ff" },
  btnText: { color: "#fff", fontWeight: "700", letterSpacing: 1 },
  btnTextDisabled: { color: "#f2f9ff" },
});
