import { useTheme } from '@react-navigation/native';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import CountryPicker, {
  Country,
  CountryCode,
} from 'react-native-country-picker-modal';
import { Text, TextInput } from 'react-native-paper';

const PhoneNumberInput = () => {
  const theme = useTheme();

  const [countryCode, setCountryCode] = useState<CountryCode>('KH');
  const [callingCode, setCallingCode] = useState('855');
  const [phone, setPhone] = useState('');

  const onSelectCountry = (country: Country) => {
    setCountryCode(country.cca2);
    setCallingCode(country.callingCode[0]);
  };

  return (
    <View>
      <View 
       style={[
        styles.phoneBox,
        {
          borderColor: theme.colors.border,
          backgroundColor: theme.colors.background
        },
      ]}
      >
        <View style={styles.countryBox}>
          <CountryPicker
            countryCode={countryCode}
            withFlag
            withCallingCode
            withFilter
            withCallingCodeButton={false}
            withCountryNameButton={false}
            onSelect={onSelectCountry}
          />
          <Text style={styles.callingCode}>+{callingCode}</Text>
        </View>

        <View style={styles.divider} />

        <TextInput
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          placeholder="XXX XXX XXX XXX"
          mode="flat"
          underlineColor="transparent"
          activeUnderlineColor="transparent"
          style={styles.input}
          contentStyle={styles.inputContent}
        />
      </View>
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
    borderRadius: 10,
    // backgroundColor: '#F8F9FB',
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
});