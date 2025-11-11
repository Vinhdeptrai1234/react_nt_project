import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

export default function Layout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerTitleAlign: 'center' }}>
        <Stack.Screen name="index" options={{ title: 'Hikes' }} />
        <Stack.Screen name="add" options={{ title: 'Add Hike' }} />
        <Stack.Screen name="confirm" options={{ title: 'Confirm' }} />
      </Stack>
    </SafeAreaProvider>
  );
}
