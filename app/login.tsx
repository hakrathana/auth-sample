import PhoneNumberInput from "@/components/ui/phone-number-input";
import { AuthToken, useAuth } from "@/context/AuthContext";
import { loginRequest } from "@/services/request";
import { useTheme } from "@react-navigation/native";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, StyleSheet, Text, View } from "react-native";
import { Button, SegmentedButtons, TextInput } from "react-native-paper";
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
  const [hidePassword, setHidePassword] = useState(true);

  const {
    control,
    clearErrors,
    handleSubmit,
    reset,
  } = useForm<LoginFormValues>({
    defaultValues: 
      {
      email: "",
      password: "",
      countryCode: "855",
      phone: "",
      },
    shouldUnregister: true,
  });

  const extractToken = (response: any): AuthToken | null => {
    const tokenSources = [response, response?.data, response?.result];

    for (const source of tokenSources) {
      if (!source) continue;

      const accessToken = source.accessToken ?? source.access_token;
      const refreshToken = source.refreshToken ?? source.refresh_token;

      if (typeof accessToken === "string") {
        return {
          ...source,
          accessToken,
          refreshToken,
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
    const payload =
      loginMethod === "phone"
        ? {
            countryCode: data.countryCode,
            phone: data.phone.trim(),
            password: data.password,
          }
        : {
            email: data.email.trim(),
            password: data.password,
          };
    loginMutation.mutate(payload);
  };

  const handleLoginMethodChange = (nextValue: string) => {
    const nextMethod = nextValue as LoginMethod;

    if (nextMethod === loginMethod) {
      return;
    }

    setLoginMethod(nextMethod);
    reset({
      email: "",
      password: "",
      countryCode: "855",
      phone: "",
    });
    clearErrors();
    loginMutation.reset();
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
        <Text style={[styles.title, { color: theme.colors.text }]} accessibilityLabel="Login">Login</Text>
      </View>

      <View style={styles.segmentedRow}>
        <SegmentedButtons
          value={loginMethod}
          onValueChange={handleLoginMethodChange}
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
        {loginMethod === 'phone' && <PhoneNumberInput control={control} disabled={submitting} />}
        {loginMethod === 'email'&&
          <View>
            <Controller
              control={control}
              name="email"
              rules={{
              validate: (value) => {
                const trimmed = value.trim();

                if (!trimmed) {
                  return 'Email is required.';
                }

                return (
                  /^\S+@\S+\.\S+$/.test(trimmed) ||
                  'Enter a valid email address.'
                );
              },
            }}
              render={({ field: { onBlur, onChange, value },fieldState }) => (
                <>
                <TextInput
                  placeholder="Email"
                  mode="outlined"
                  left={<TextInput.Icon icon="email" />}
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  disabled={submitting}
                  error={!!fieldState.error}
                  outlineStyle={styles.borderRadius}
                />
                {fieldState.error ? (
                  <Text style={styles.errorText} accessibilityLabel={fieldState.error.message}>{fieldState.error.message}</Text>
                ) : null}
                </>
              )}
            />
          </View>}
        <View>
          <Controller
            control={control}
            name="password"
            rules={{
              required: "Password is required.",
            }}
            render={({ field: { onBlur, onChange, value }, fieldState }) => (
              <>
              <TextInput
                placeholder="Password"
                mode="outlined"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                secureTextEntry={hidePassword}
                disabled={submitting}
                error={!!fieldState.error}
                left={<TextInput.Icon icon="lock" />}
                right={
                  <TextInput.Icon
                    icon={hidePassword ? "eye" : "eye-off"}
                    onPress={() => setHidePassword((current) => !current)}
                  />
                }
                outlineStyle={styles.borderRadius}
              />
              {fieldState.error ? (
                <Text style={styles.errorText} accessibilityLabel={fieldState.error.message}>{fieldState.error.message}</Text>
              ) : null}
              </>
            )}
          />
        </View>
      </View>
      <View style={{marginTop:10, display:'flex', alignItems:'center'}}>
        <Text style={{color:theme.colors.primary}} accessibilityLabel="Forgot your password?">Forgot your password?</Text>
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
          Login
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
    marginTop: 8,
  },
  borderRadius:{
    borderRadius: 12,
  }
});
