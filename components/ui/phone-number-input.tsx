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
  errors: any;
  disabled?: boolean;
};

const PhoneNumberInput = ({ control, errors, disabled = false }: PhoneNumberInputProps) => {
  const theme = useTheme();
  const [selectedCountry, setSelectedCountry] = useState<CountryCode | undefined>();
  const [openCountryPicker, setOpenCountryPicker] = useState(false);
  return (
    <View>
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
            <View
              style={[
                styles.phoneBox,
                {
                  borderColor: errors.phone ? theme.colors.error : theme.colors.outline,
                  backgroundColor: theme.colors.background,
                  opacity: disabled ? 0.6 : 1,
                },
              ]}
            >
              <Pressable
                style={styles.countryBox}
                onPress={() => setOpenCountryPicker(true)}
                disabled={disabled}
              >
                <>
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
                </>
              </Pressable>

              <View style={[styles.divider, { backgroundColor: theme.colors.outline }]} />

              <Controller
                control={control}
                name="phone"
                rules={{
                  validate: (fieldValue) => {
                    if (!fieldValue.trim()) {
                      return 'Phone number is required.';
                    }

                    return (
                      /^[0-9]{6,15}$/.test(fieldValue.replace(/\s+/g, '')) ||
                      'Enter a valid phone number.'
                    );
                  },
                }}
                render={({ field: { onBlur, onChange: onPhoneChange, value } }) => (
                  <TextInput
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onPhoneChange}
                    keyboardType="phone-pad"
                    placeholder="XXX XXX XXX XXX"
                    mode="flat"
                    underlineColor="transparent"
                    activeUnderlineColor="transparent"
                    disabled={disabled}
                    textColor={theme.colors.onSurface}
                    style={[styles.input, { backgroundColor: 'transparent' }]}
                    contentStyle={styles.inputContent}
                  />
                )}
              />
            </View>
          );
        }}
      />
      {errors.phone ? <Text style={styles.errorText}>{String(errors.phone.message)}</Text> : null}
    </View>
  );
};

export default PhoneNumberInput;

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
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
