import React, {useEffect} from 'react';
import {
  Text,
  TextInput,
  Image,
  View,
  StyleSheet,
  Alert,
  Switch,
  Modal,
  Pressable,
  SafeAreaView,
} from 'react-native';
import { text } from '../../helpers/en' 
import AsyncStorage from '@react-native-async-storage/async-storage';
export default function Profile({lang}) {
  const [inputs, setInputs] = React.useState({
    name: '',
    contact: '',
    email: '',
    address: '',
    age: '',
    // gender: ''
  });
  const saveInputs = async () => {
    try {
      await AsyncStorage.setItem('inputs', JSON.stringify(inputs));
      console.log('Inputs saved successfully');
      setModalVisible(false);
    } catch (e) {
      console.log('Failed to save inputs:', e);
    }
  };
  useEffect(() => {
    const readData = async () => {
      const profileData = JSON.parse(await AsyncStorage.getItem('inputs'));
      setInputs(profileData);
    };
    AsyncStorage.multiGet([
      'name',
      'contact',
      'email',
      'address',
      'age',
      // 'gender'
    ])
      .then(inputs => {
        const dataArray = inputs.map(value => value[1]);
        // setData(dataArray);
      })
      .catch(error => console.log(error));
    readData();
  }, []);
  const loadInputs = async () => {
    try {
      const value = await AsyncStorage.getItem('inputs');
      if (value !== null) {
        setInputs(JSON.parse(value));
        console.log('Inputs loaded successfully');
      } else {
        console.log('No inputs found');
      }
    } catch (e) {
      console.log('Failed to load inputs:', e);
    }
  };
  const handleChange = (key, value) => {
    setInputs({
      ...inputs,
      [key]: value,
    });
  };
  const [isEnabled, setIsEnabled] = React.useState(false);
  const toggleSwitch = () => {
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
          borderRadius: 200 / 2,
        }}
      />
      <Text style={[styles.userName, styles.setColorWhite]}>
        {inputs && inputs.name}
      </Text>
      <Pressable
        style={[styles.button, styles.buttonOpen]}
        onPress={() => setModalVisible(true)}>
        <Text style={styles.textStyle}>{text[lang].editProfile}</Text>
      </Pressable>
      <View style={{flexDirection: 'row', alignSelf: 'center', marginTop: 40}}>
        {/* <Text style={styles.setColorWhite}>Notifications</Text>        <Switch
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
          onValueChange={toggleSwitch}
          value={isEnabled}
          style={{
            marginLeft: 10
          }} /> */}
      </View>
      <View style={[styles.TextView, styles.setColorWhite]}>
        <Text style={[styles.TextView, styles.setColorWhite]}>
        {text[lang].contactNumber}: {inputs && inputs.contact}
        </Text>
      </View>
      <View style={[styles.TextView]}>
        <Text style={[styles.TextView, styles.setColorWhite]}>
        {text[lang].emailId}: {inputs && inputs.email}
        </Text>
      </View>
      <View style={[styles.TextView]}>
        <Text style={[styles.TextView, styles.setColorWhite]}>
        {text[lang].address}: {inputs && inputs.address}
        </Text>
      </View>
      <View style={[styles.TextView]}>
        <Text style={[styles.TextView, styles.setColorWhite]}>
        {text[lang].age}: {inputs && inputs.age}
        </Text>
      </View>
      {/* <View style={[styles.TextView]}>        <Text style={[styles.TextView, styles.setColorWhite]}>Gender: {inputs && inputs.gender}</Text>      </View> */}
      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <SafeAreaView>
                <View style={{flexDirection: 'row'}}>
                  {/* <Text>Name</Text> */}
                  <TextInput
                    placeholder={text[lang].name}
                    style={styles.input}
                    textAlign={'center'}
                    value={inputs && inputs.name}
                    onChangeText={text => handleChange('name', text)}
                  />
                </View>
                <View style={{flexDirection: 'row'}}>
                  {/* <Text>Contact Number</Text> */}
                  <TextInput
                    style={styles.input}
                    placeholder={text[lang].contactNumber}
                    textAlign={'center'}
                    onChangeText={text => handleChange('contact', text)}
                    value={inputs && inputs.contact}
                  />
                </View>
                <View style={{flexDirection: 'row'}}>
                  {/* <Text>Email ID</Text> */}
                  <TextInput
                    style={styles.input}
                    placeholder={text[lang].emailId}
                    textAlign={'center'}
                    onChangeText={text => handleChange('email', text)}
                    value={inputs && inputs.email}
                  />
                </View>
                <View style={{flexDirection: 'row'}}>
                  {/* <Text>Address</Text> */}
                  <TextInput
                    style={styles.input}
                    placeholder={text[lang].enterAddress}
                    textAlign={'center'}
                    onChangeText={text => handleChange('address', text)}
                    value={inputs && inputs.address}
                  />
                </View>
                <View style={{flexDirection: 'row'}}>
                  {/* <Text>Age</Text> */}
                  <TextInput
                    style={styles.input}
                    placeholder={text[lang].enterAge}
                    textAlign={'center'}
                    onChangeText={text => handleChange('age', text)}
                    value={inputs && inputs.age}
                  />
                </View>
                <View style={{flexDirection: 'row'}}>
                  {/* <Text>Gender</Text> */}
                  {/* <TextInput
                  style={styles.input}
                  placeholder="Enter Gender: "
                  textAlign={'center'}
                  onChangeText={text => handleChange('gender', text)}
                  value={inputs && inputs.gender}
                /> */}
                </View>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={saveInputs}>
                  <Text style={styles.textStyle}>{text[lang].submit}</Text>
                </Pressable>
                <Pressable
                  style={[styles.button, styles.secondaryButton]}
                  onPress={() => setModalVisible(false)}>
                  <Text style={styles.secondaryButtonTextStyle}>{text[lang].cancel}</Text>
                </Pressable>
              </SafeAreaView>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  input: {
    flex: 1,
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  button1: {
    backgroundColor: 'blue',
    borderRadius: 50,
    padding: 50,
    width: 150,
    alignSelf: 'center',
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
    width: 350,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 50,
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
    marginTop: 20,
  },
  buttonOpen: {
    backgroundColor: 'blue',
    borderRadius: 50,
    minWidth: 150,
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#2196F3',
    backgroundColor: '#fff',
    color: "black"
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  secondaryButtonTextStyle: {
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  Text: {
    textAlign: 'center',
  },
  setColorWhite: {
    color: '#FFFFFF',
  },
  userName: {
    flexDirection: 'row',
    textAlign: 'center',
    marginTop: 15,
    fontSize: 20,
  },
  TextView: {
    flexDirection: 'row',
    marginLeft: 27,
    textAlign: 'center',
    marginTop: 15,
    fontSize: 20,
  },
});
