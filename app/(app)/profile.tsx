import { useAuth } from "@/context/AuthContext";
import { fetchOne } from "@/services/request";
import { useTheme } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";

const ProfileScreen = () => {
  const theme = useTheme();
  const { logout } = useAuth();
  
  const {data: profile} = useQuery({
    queryKey:['user-profile'],
    queryFn: async ({ signal }) => {
      const userData = await fetchOne<any>('/users/me', signal);
      return userData;
    },
  })

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background, padding: 24, gap: 12 }}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text style={{ fontWeight: 'bold' }} accessibilityLabel="Last Name">Last Name</Text>
        <Text accessibilityLabel={profile?.data?.lastName}>{profile?.data?.lastName}</Text>
      </View>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text style={{ fontWeight: 'bold' }} accessibilityLabel="First Name">First Name</Text>
        <Text accessibilityLabel={profile?.data?.firstName}>{profile?.data?.firstName}</Text>
      </View>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text style={{ fontWeight: 'bold' }} accessibilityLabel="Email">Email</Text>
        <Text accessibilityLabel={profile?.data?.email}>{profile?.data?.email}</Text>
      </View>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text style={{ fontWeight: 'bold' }} accessibilityLabel="Gender">Gender</Text>
        <Text accessibilityLabel={profile?.data?.gender}>{profile?.data?.gender}</Text>
      </View>
      <View>
        <Button mode="contained" onPress={logout} style={{ marginTop: 20 }} buttonColor={styles.ButtonDanger.color}>
          Logout
        </Button>
      </View>
    </View>
  )
}

export default ProfileScreen;

const styles = StyleSheet.create({
  ButtonDanger: {
    color: "#d32f2f",
  },
});

