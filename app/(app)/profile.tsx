import { fetchOne } from "@/services/request";
import { useTheme } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

const ProfileScreen = () => {
  const theme = useTheme();
  
  const {data: profile, isLoading} = useQuery({
    queryKey:['user-profile'],
    queryFn: async ({ signal }) => {
      const userData = await fetchOne<any>('/users/me', signal);
      return userData;
    },
  })
  
  console.log("Profile", profile);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text>{profile?.data?.lastName}</Text>
      <Text>{profile?.data?.firstName}</Text>
      <Text>{profile?.data?.email}</Text>
      <Text>{profile?.data?.gender}</Text>
    </View>
  )
}

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 12,
  },
});
