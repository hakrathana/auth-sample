import { useTheme } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { View } from "react-native";
import { Button, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

const HomeScreen = () => {
  const router = useRouter();
  const theme = useTheme();
  return ( 
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        padding: 16,
      }}
    >
      <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
        <Text style={{ fontSize: 22, fontWeight: 'bold' }} accessibilityLabel="Welcome To Our Homepage">Welcome To Our Homepage</Text>
        <Button mode="contained" onPress={() => router.navigate('/profile')} style={{ marginTop: 20 }} buttonColor={theme.colors.primary}>
          View Profile
        </Button>
      </View>
    </SafeAreaView>
  )
}

export default HomeScreen;

