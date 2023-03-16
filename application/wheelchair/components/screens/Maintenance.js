import React, {useState} from 'react';
import {Text, View, Button, Alert, StyleSheet, Pressable} from 'react-native';
// import RadioGroup from 'react-native-radio-buttons-group';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RadioButtonRN from 'radio-buttons-react-native';
const Maintenance = () => {
  const [selectedOption, setSelectedOption] = useState({});
  const [radioButtons, setRadioButtons] = useState([
    {
      // id: '1', // acts as primary key, should be unique and non-empty string
      label: '1 week',
      value: 'ONE_WEEK',
    },
    {
      // id: '2',
      label: '2 weeks',
      value: 'TWO_WEEKS',
    },
    {
      // id: '3',
      label: '1 months',
      value: 'ONE_MONTH',
    },
    {
      // id: '4',
      label: '2 months',
      value: 'TWO_MONTHS',
    },
    {
      // id: '5',
      label: '1 min',
      value: 'ONE_MIN',
    },
    {
      // id: '6',
      label: '5 sec',
      value: 'FIVE_SEC',
    },
  ]);

  const onPressSubmit = async () => {
    Alert.alert(
      `Notifications will be triggerd periodically after ${selectedOption.label} starting now.`,
    );
    await AsyncStorage.setItem(
      'notificationTriggerBaseTimePeriod',
      selectedOption.value,
    );
    await AsyncStorage.setItem(
      'notificationTriggerBaseTimeStamp',
      Date().toString(),
    );
  };
  return (
    <View style={styles.container}>
      <Text style={[styles.primaryText, styles.setColorWhite]}>
        Select a timeframe for future maintenance and reminder
      </Text>

      <RadioButtonRN
        data={radioButtons}
        selectedBtn={e => setSelectedOption(e)}
        boxActiveBgColor={'#fff'}
      />

      <Pressable style={styles.primaryBtn} onPress={onPressSubmit}>
        <Text style={styles.btnText}>Submit</Text>
      </Pressable>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    color: 'white',
  },
  labelStyle: {
    color: 'white',
  },
  radioGroupContainer: {
    color: '#fff',
  },
  primaryBtn: {
    backgroundColor: 'blue',
    borderRadius: 50,
    padding: 10,
    marginTop: 10,
  },
  btnText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  setColorWhite: {
    color: '#FFFFFF',
  },
  primaryText: {
    flexDirection: 'row',
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 15,
    fontSize: 20,
  },
});
export default Maintenance;
