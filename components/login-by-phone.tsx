import { useState } from "react";
import { Controller } from "react-hook-form";
import { StyleSheet, Text, View } from "react-native";
import { TextInput } from "react-native-paper";
import PhoneNumberInput from "./ui/phone-number-input";


type LoginByPhoneProps = {
  control: any;
  errors: any;
  disabled?: boolean;
};

const LoginByPhone = ({ control, errors, disabled = false }: LoginByPhoneProps) => {
  const [hidePassword, setHidePassword] = useState(true);

  return (
    <View style={{ gap: 10 }}>
      <View>
        <PhoneNumberInput control={control} disabled={disabled} />
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
  );
};

export default LoginByPhone;

const styles = StyleSheet.create({
  phoneInput: {
    flex: 1,
  },
  phoneInputContent: {
    fontSize: 20,
  },
  phoneOutline: {
    borderRadius: 12,
  },
  errorText: {
    color: "#d32f2f",
  },
  borderRadius: {
    borderRadius: 12,
    borderColor: '#E5E7EB',
  }
});
