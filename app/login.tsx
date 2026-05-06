import LoginByEmail from "@/components/login-by-email";
import LoginByPhone from "@/components/login-by-phone";
import { AuthToken, useAuth } from "@/context/AuthContext";
import { loginRequest } from "@/services/request";
import { useTheme } from "@react-navigation/native";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Alert, StyleSheet, Text, View } from "react-native";
import { Button, SegmentedButtons } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

type LoginMethod = "email" | "phone";

type LoginFormValues = {
  email: string;
  password: string;
  countryCode: string;
  phone: string;
};

const LoginScreen = () => {
  const theme = useTheme();
  const { login } = useAuth();
  const [loginMethod, setLoginMethod] = useState<LoginMethod>("email");
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
      password: "",
      countryCode: "855",
      phone: "",
    },
  });

  const extractToken = (response: any): AuthToken | null => {
    const tokenSources = [response, response?.data, response?.result];

    for (const source of tokenSources) {
      if (!source) {
        continue;
      }

      if (typeof source.accessToken === "string") {
        return {
          accessToken: source.accessToken,
          refreshToken: source.refreshToken,
          ...source,
        };
      }

      if (typeof source.token === "string") {
        return {
          accessToken: source.token,
          ...source,
        };
      }
    }

    return null;
  };

  const loginMutation = useMutation({
    mutationFn: loginRequest,
    onSuccess: async (data) => {
      const token = extractToken(data);
      if (!token) {
        Alert.alert("Login failed", "No Access Token found in the response. Please try again.");
        return;
      }
      await login(token);
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ??
        "Unable to login. Please try again.";
      Alert.alert("Login failed", message);
    },
  });

  const handleLogin = (data: LoginFormValues) => {
    console.log("Login data:", data);
    if (loginMethod === "phone") {
      loginMutation.mutate({
        countryCode: data.countryCode,
        phone: data.phone,
        password: data.password,
      });
      return;
    } else {
      loginMutation.mutate({
      email: data.email,
      password: data.password,
    });
    }
  };

  const submitting = loginMutation.isPending;

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        padding: 16,
      }}
    >
      <View>
        <Text style={[styles.title, { color: theme.colors.text }]}>Login</Text>
      </View>

      <View style={styles.segmentedRow}>
        <SegmentedButtons
          value={loginMethod}
          onValueChange={(nextValue) => setLoginMethod(nextValue as LoginMethod)}
          buttons={[
            { value: "email", label: "Email" , style: {
              backgroundColor:
                loginMethod === 'email'
                  ? 'rgba(0, 137, 250, 0.1)'
                  : theme.colors.background,
            },},
            { value: "phone", label: "Phone", style: {
              backgroundColor:
                loginMethod === 'phone'
                  ? 'rgba(0, 137, 250, 0.1)'
                  : theme.colors.background,
            }, },
          ]}
        />
      </View>

      <View style={styles.form}>
        {loginMethod === "phone" ? (
          <LoginByPhone control={control} errors={errors} disabled={submitting} />
        ) : (
          <LoginByEmail control={control} errors={errors} disabled={submitting} />
        )}
        
      </View>
      <View style={{marginTop:10, display:'flex', alignItems:'center'}}>
        <Text style={{color:theme.colors.primary}}>Forgot your password?</Text>
      </View>

      <View style={styles.buttonRow}>
        <Button
          mode="contained"
          icon="arrow-right"
          contentStyle={{ flexDirection: 'row-reverse', paddingVertical: 2 }}
          labelStyle={{ fontSize: 16, fontWeight: '600' }}
          buttonColor={theme.colors.primary}
          onPress={handleSubmit(handleLogin)}
          loading={submitting}
          disabled={submitting}
          style={{ borderRadius: 10 }}
        >
          <Text>Login</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
  },
  segmentedRow: {
    marginTop: 20,
  },
  form: {
    marginTop: 20,
    gap: 16,
  },
  buttonRow: {
    marginTop: 20,
  },
  errorText: {
    color: "#d32f2f",
    marginTop: -8,
  },
});
