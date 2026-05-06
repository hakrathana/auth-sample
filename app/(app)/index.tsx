import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import { StyleSheet } from "react-native";
import { Button } from "react-native-paper";


const HomeScreen = () => {
  const {logout} = useAuth();
  const router = useRouter();
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Home Screen</ThemedText>
      <ThemedText>Protected route rendered successfully.</ThemedText>
      <Button mode="contained" onPress={() => router.navigate('/profile')} style={{ marginTop: 20 }}>
        User Profile
      </Button>
      <Button mode="contained" onPress={() => logout()} style={{ marginTop: 20 }}>
        Logout
      </Button>
    </ThemedView>
  )
}

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 12,
  },
});
