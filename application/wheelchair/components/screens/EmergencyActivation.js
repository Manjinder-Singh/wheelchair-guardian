import React, { useEffect, useState } from 'react'
import io from 'socket.io-client';
import { Text, View, TouchableOpacity, Linking, Button } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';

const EmergencyActivation = () => {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const socket = io('http://localhost:5003');

    socket.on('connect', () => {
      console.log('Connected to server');
    });
    socket.on('message', (data) => {
      console.log('Received message:', data);
    });
    setContacts()
    return () => {
      socket.disconnect();
    };
  }, []);
  const handleSendMessage = () => {
    fetch('http://127.0.0.1:5003/send')
      .then(r => r.json())
      .then(res => {
        console.log(res)
      }).catch(e => {
        console.log(e)
      })
  }
  // const phoneNumber = '6478635069';
  const setContacts = async() => {
    const contacts = await AsyncStorage.getItem('emergencyContacts');
    if (contacts) {
      setUsers(JSON.parse(contacts).users)
    }
  }
  const handleCallPress = (number) => {
    Linking.openURL(`tel:${number}`);
  };
  return (
    <View>
      {/* <TouchableOpacity
          onPress={() => handleSendMessage()}
            >
            <Text
              >
              send message
            </Text>
          </TouchableOpacity> */}
          <Button
          onPress={() => handleCallPress('911')}
          title="Police"
          color="#841584"
          accessibilityLabel="Learn more about this purple button"
        /> 
      {users.map((user, index) => (
        <Button
        key={index}
          onPress={() => handleCallPress(user.mobileNumber)}
          title="call"
          color="#841584"
          accessibilityLabel="Learn more about this purple button"
        />
      ))}



    </View>
  )
}

export default EmergencyActivation;