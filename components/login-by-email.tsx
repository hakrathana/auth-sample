import { useState } from "react";
import { Controller } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import { Text, TextInput } from "react-native-paper";

type LoginByPhoneProps = {
  control: any;
  errors: any;
  disabled?: boolean;
};


const LoginByEmail = ({ control, errors, disabled = false }: LoginByPhoneProps) => {
  const [hidePassword, setHidePassword] = useState(true);
  return(
    <View style={{gap: 10}}>
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
          render={({ field: { onBlur, onChange, value } }) => (
            <TextInput
              placeholder="Email"
              mode="outlined"
              left={<TextInput.Icon icon="email" />}
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              autoCapitalize="none"
              keyboardType="email-address"
              disabled={disabled}
              error={!!errors.email}
              outlineStyle={styles.borderRadius}
            />
          )}
        />
        {errors.email ? <Text style={styles.errorText}>{errors.email.message}</Text> : null}
      </View>
      <View>
        <Controller
        control={control}
        name="password"
        rules={{
          required: "Password is required.",
        }}
        render={({ field: { onBlur, onChange, value } }) => (
          <TextInput
            placeholder="Password"
            mode="outlined"
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            secureTextEntry={hidePassword}
            disabled={disabled}
            error={!!errors.password}
            left={<TextInput.Icon icon="lock" />}
            right={
              <TextInput.Icon
                icon={hidePassword ? "eye" : "eye-off"}
                onPress={() => setHidePassword((current) => !current)}
              />
            }
            outlineStyle={styles.borderRadius}
          />
        )}
      />
      {errors.password ? <Text style={styles.errorText}>{errors.password.message}</Text> : null}
      </View>
    </View>
  )
}

export default LoginByEmail;


const styles = StyleSheet.create({
  wrapper: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#5f6368",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  countryButton: {
    minWidth: 116,
    height: 56,
    borderWidth: 1,
    borderColor: "#d9dde3",
    borderRadius: 12,
    backgroundColor: "#f7f8fb",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    gap: 8,
  },
  flag: {
    fontSize: 18,
  },
  countryCode: {
    fontSize: 20,
    color: "#596273",
  },
  phoneInput: {
    flex: 1,
    backgroundColor: "#f7f8fb",
  },
  phoneInputContent: {
    fontSize: 20,
    color: "#596273",
  },
  phoneOutline: {
    borderRadius: 12,
    borderColor: "#d9dde3",
  },
  errorText: {
    color: "#d32f2f",
    marginTop: 5,
  },
  borderRadius: {
    borderRadius: 12,
  },
});
