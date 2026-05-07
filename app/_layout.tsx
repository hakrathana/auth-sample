import { AuthProvider, useAuth } from '@/context/AuthContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { useState } from 'react';
import { PaperProvider } from 'react-native-paper';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

function RootNavigator(){
  const { token, isLoading } = useAuth();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const CustomeLightTheme={
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: 'rgba(0, 137, 250, 1)',
      danger: 'rgba(255, 59, 48, 1)',
    },
  }
  const CutomerDarkTheme={
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      primary: 'rgba(68, 169, 252, 1)',
      danger: 'rgba(255, 59, 48, 1)',
    },
  }

  if (isLoading) {
    return null;
  }

  return (
    <PaperProvider>
      <ThemeProvider value={isDark ? CutomerDarkTheme : CustomeLightTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Protected guard={!token}>
            <Stack.Screen name="login" />
          </Stack.Protected>

          <Stack.Protected guard={!!token}>
            <Stack.Screen name="(app)" />
          </Stack.Protected>
        </Stack>
      </ThemeProvider>
    </PaperProvider>
  );
}

export default function RootLayout() {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RootNavigator />
        </AuthProvider>
      </QueryClientProvider>
    </SafeAreaProvider> 
  );
}
