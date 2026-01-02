import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator } from 'react-native';
import { soundManager } from '@/services/audio/SoundManager';
import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';

export default function RootLayout() {
  // Load Ionicons font for web
  const [fontsLoaded] = useFonts({
    ...Ionicons.font,
  });

  // Initialize audio on app start
  useEffect(() => {
    soundManager.initialize();
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0F172A', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#6366F1" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#0F172A' }}>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#0F172A' },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="workout" />
        <Stack.Screen
          name="modals/exercise-info"
          options={{
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="modals/edit-equipment-set"
          options={{
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="modals/edit-goals"
          options={{
            presentation: 'modal',
          }}
        />
      </Stack>
    </View>
  );
}
