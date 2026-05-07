import React, { useState } from 'react';
import { Controller } from 'react-hook-form';
import { Pressable, StyleSheet, View } from 'react-native';
import CountryPicker, {
  Country,
  CountryCode,
} from 'react-native-country-picker-modal';
import { Text, TextInput, useTheme } from 'react-native-paper';

type PhoneNumberInputProps = {
  control: any;
  disabled?: boolean;
};

const PHONE_NUMBER_PATTERN = /^\d{6,15}$/;

const normalizePhoneNumber = (value: string) => value.replace(/\D/g, '');

const PhoneNumberInput = ({ control, disabled = false }: PhoneNumberInputProps) => {
  const theme = useTheme();
  const [selectedCountry, setSelectedCountry] = useState<CountryCode | undefined>();
  const [openCountryPicker, setOpenCountryPicker] = useState(false);
  const [focused, setFocused] = useState(false);

  return (
    <Controller
      control={control}
      name="phone"
      rules={{
        required: 'Phone number is required.',
        pattern: {
          value: PHONE_NUMBER_PATTERN,
          message: 'Enter a valid phone number.',
        },
      }}
      render={({ field: { onBlur, onChange: onPhoneChange, value }, fieldState }) => (
        <View>
          <View
            style={[
              styles.phoneBox,
              {
                borderColor: fieldState.error
                  ? theme.colors.error
                  : focused
                    ? theme.colors.primary
                    : theme.colors.outline,
                backgroundColor: theme.colors.background,
                borderWidth: fieldState.error || focused ? 2 : 1,
              },
            ]}
          >
            <Controller
              control={control}
              name="countryCode"
              rules={{
                required: 'Country code is required.',
              }}
              render={({ field: { value: callingCode, onChange } }) => {
                const pickerCountry = selectedCountry || 'KH';
                const onSelectCountry = (country: Country) => {
                  const nextCallingCode = country.callingCode[0] ?? '';
                  setSelectedCountry(country.cca2);
                  onChange(nextCallingCode);
                };

                return (
                  <Pressable
                    style={styles.countryBox}
                    onPress={() => setOpenCountryPicker(true)}
                    disabled={disabled}
                  >
                    <CountryPicker
                      visible={openCountryPicker}
                      onClose={() => setOpenCountryPicker(false)}
                      countryCode={pickerCountry}
                      withFlag
                      withCallingCode
                      withFilter
                      withCallingCodeButton={false}
                      withCountryNameButton={false}
                      onSelect={(country) => {
                        setOpenCountryPicker(false);
                        onSelectCountry(country);
                      }}
                    />
                    <Text style={[styles.callingCode, { color: theme.colors.onSurface }]}>
                      +{callingCode || '855'}
                    </Text>
                  </Pressable>
                );
              }}
            />

            <View style={[styles.divider, { backgroundColor: theme.colors.outline }]} />

            <TextInput
              value={value}
              onBlur={() => {
                setFocused(false);
                onBlur();
              }}
              onFocus={() => setFocused(true)}
              onChangeText={(nextValue) => onPhoneChange(normalizePhoneNumber(nextValue))}
              keyboardType="phone-pad"
              placeholder="XXX XXX XXX XXX"
              maxLength={15}
              mode="flat"
              underlineColor="transparent"
              activeUnderlineColor="transparent"
              disabled={disabled}
              textColor={theme.colors.onSurface}
              style={styles.input}
              contentStyle={styles.inputContent}
              error={!!fieldState.error}
            />
          </View>
          {fieldState.error ? (
            <Text style={styles.errorText} accessibilityLabel={fieldState.error.message}>{fieldState.error.message}</Text>
          ) : null}
        </View>
      )}
    />
  );
};

export default PhoneNumberInput;

const styles = StyleSheet.create({
  phoneBox: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  countryBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 12,
    paddingRight: 8,
  },
  callingCode: {
    fontSize: 15,
  },
  divider: {
    width: 1,
    height: '100%',
    backgroundColor: '#E5E7EB',
  },
  input: {
    flex: 1,
    height: 56,
    backgroundColor: 'transparent',
  },
  inputContent: {
    fontSize: 15,
  },
  errorText: {
    color: '#d32f2f',
    marginTop: 5,
  },
});
