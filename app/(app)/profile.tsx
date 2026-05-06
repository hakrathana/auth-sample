import { useAuth } from "@/context/AuthContext";
import { fetchOne } from "@/services/request";
import { useTheme } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { View } from "react-native";
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
        <Text style={{ fontWeight: 'bold' }}>Last Name</Text>
        <Text>{profile?.data?.lastName}</Text>
      </View>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text style={{ fontWeight: 'bold' }}>First Name</Text>
        <Text>{profile?.data?.firstName}</Text>
      </View>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text style={{ fontWeight: 'bold' }}>Email</Text>
        <Text>{profile?.data?.email}</Text>
      </View>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text style={{ fontWeight: 'bold' }}>Gender</Text>
        <Text>{profile?.data?.gender}</Text>
      </View>
      <View>
        <Button mode="contained" onPress={logout} style={{ marginTop: 20 }} buttonColor={theme.colors.danger}>
          Logout
        </Button>
      </View>
    </View>
  )
}

export default ProfileScreen;


