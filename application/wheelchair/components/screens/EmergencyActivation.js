import React, { useEffect } from 'react'
import io from 'socket.io-client';
import { Text, View, TouchableOpacity } from 'react-native'

const EmergencyActivation = () => {
  useEffect(() => {
    const socket = io('http://localhost:5003');
    socket.on('connect', () => {
      console.log('Connected to server');
    });
    socket.on('message', (data) => {
      console.log('Received message:', data);
    });
    return () => {
      socket.disconnect();
    };
  }, []);
  const handleSendMessage =() => {
    fetch('http://127.0.0.1:5003/send')
    .then(r =>r.json())
      .then(res => {
        console.log(res)
      }).catch(e => {
        console.log(e)
      })
  }
  return (
    <View>
      <TouchableOpacity
          onPress={() => handleSendMessage()}
            >
            <Text
              >
              send message
            </Text>
          </TouchableOpacity>
    </View>
  )
}


export default EmergencyActivation;