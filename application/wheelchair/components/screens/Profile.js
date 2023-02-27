import React, { useEffect } from 'react'
import { Text, TextInput, Image, View, StyleSheet, Alert, Switch, Modal, Pressable } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
export default function Profile ()
{
  const [inputs, setInputs] = React.useState({
    name: '',
    contact: '',
    email: '',
    address: '',
    age: '',
    gender: ''
  });
  const saveInputs = async () =>
  {
    try
    {
      await AsyncStorage.setItem('inputs', JSON.stringify(inputs));
      console.log('Inputs saved successfully');
      setModalVisible(false);
    } catch (e)
    {
      console.log('Failed to save inputs:', e);
    }
  };
  useEffect(() =>
  {
    const readData = async () =>
    {
      const profileData = JSON.parse(await AsyncStorage.getItem('inputs'));
      console.log("******", profileData)
      setInputs(profileData)
    }
    AsyncStorage.multiGet(['name', 'contact', 'email', 'address', 'age', 'gender'])
      .then((inputs) =>
      {
        const dataArray = inputs.map((value) => value[1]);
        setData(dataArray);
      })
      .catch((error) => console.log(error));
    readData()
  }, [])
  const loadInputs = async () =>
  {
    try
    {
      const value = await AsyncStorage.getItem('inputs');
      if (value !== null)
      {
        setInputs(JSON.parse(value));
        console.log('Inputs loaded successfully');
      } else
      {
        console.log('No inputs found');
      }
    } catch (e)
    {
      console.log('Failed to load inputs:', e);
    }
  };
  const handleChange = (key, value) =>
  {
    setInputs({
      ...inputs,
      [key]: value
    });
  };

  const [isEnabled, setIsEnabled] = React.useState(false);
  const toggleSwitch = () =>
  {
    setIsEnabled(previousState => !previousState);
  };
  const [modalVisible, setModalVisible] = React.useState(false);

  return (
    <View style={styles.container}>
      <Image
        source={require('../../Assets/placeholder.png')}
        style={{
          alignSelf: 'center',
          marginTop: 40,
          width: 130,
          height: 130,
          borderRadius: 200 / 2
        }}
      />
      <Text style={[styles.TextView, styles.setColorWhite, styles.name]}>
        {inputs.name}</Text>
      <Pressable
        style={[styles.button, styles.buttonOpen]}
        onPress={() => setModalVisible(true)}>
        <Text style={styles.textStyle}>Edit Profile</Text>
      </Pressable>
      <View style={{ flexDirection: 'row', alignSelf: 'center', marginTop: 40 }}>
        {/* <Text style={styles.setColorWhite}>Notifications</Text>
        <Switch
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
          onValueChange={toggleSwitch}
          value={isEnabled}
          style={{
            marginLeft: 10
          }} /> */}
      </View>

      <View style={[styles.TextView, styles.setColorWhite]}>
        <Text style={[styles.TextView, styles.setColorWhite]}>Contact Number: {inputs.contact}</Text>
      </View>

      <View style={[styles.TextView]}>
        <Text style={[styles.TextView, styles.setColorWhite]}>Email ID: {inputs.email}</Text>
      </View>

      <View style={[styles.TextView]}>
        <Text style={[styles.TextView, styles.setColorWhite]}>Address: {inputs.address}</Text>
      </View>

      <View style={[styles.TextView]}>
        <Text style={[styles.TextView, styles.setColorWhite]}>Age: {inputs.age}</Text>
      </View>

      <View style={[styles.TextView]}>
        <Text style={[styles.TextView, styles.setColorWhite]}>Gender: {inputs.gender}</Text>
      </View>
      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() =>
          {
            setModalVisible(!modalVisible);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={{ flexDirection: 'row', marginLeft: 80, marginTop: 20 }}>
                <Text>Name</Text>
                <TextInput
                  placeholder="Enter name: "
                  style={styles.input}
                  textAlign={'center'}
                  value={inputs.name}
                  onChangeText={text => handleChange('name', text)}
                />
              </View>
              <View style={{ flexDirection: 'row', marginLeft: 80, marginTop: 20 }}>
                <Text>Contact Number</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter Contact Number: "
                  textAlign={'center'}
                  onChangeText={text => handleChange('contact', text)}
                  value={inputs.contact}
                />
              </View>
              <View style={{ flexDirection: 'row', marginLeft: 80 }}>
                <Text>Email ID</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter Email ID: "
                  textAlign={'center'}
                  onChangeText={text => handleChange('email', text)}
                  value={inputs.email}
                />
              </View>
              <View style={{ flexDirection: 'row', marginLeft: 80 }}>
                <Text>Address</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter Address: "
                  textAlign={'center'}
                  onChangeText={text => handleChange('address', text)}
                  value={inputs.address}
                />
              </View>
              <View style={{ flexDirection: 'row', marginLeft: 80 }}>
                <Text>Age</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter Age: "
                  textAlign={'center'}
                  onChangeText={text => handleChange('age', text)}
                  value={inputs.age}
                />
              </View>
              <View style={{ flexDirection: 'row', marginLeft: 80 }}>
                <Text>Gender</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter Gender: "
                  textAlign={'center'}
                  onChangeText={text => handleChange('gender', text)}
                  value={inputs.gender}
                />
              </View>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={saveInputs}>
                <Text style={styles.textStyle}>Submit</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
    </View>

  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black'
  },
  button1: {
    backgroundColor: 'blue',
    borderRadius: 50,
    padding: 10,
    width: 150,
    alignSelf: 'center'
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    alignSelf: 'center',
    marginTop: 20
  },
  buttonOpen: {
    backgroundColor: 'blue',
    borderRadius: 50,
    width: 150,
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  Text: {
    textAlign: 'center'
  },
  setColorWhite: {
    color: '#FFFFFF'
  },
  TextView: {
    flexDirection: 'row',
    marginLeft: 27,
    marginTop: 15,
    fontSize: 20
  },
  name: {
    marginLeft: 178
  }
});
