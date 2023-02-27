import React, {useEffect, useState} from 'react';
import {View, Text, TextInput, Button, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const REQUIRED_ERROR = 'This field is required.';
const INVALID_EMAIL = 'Invalid email!';
const INVALID_MOBILE_NUMBER = 'Invalid mobile number!';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const mobileRegex = /^[0-9]{10}$/;
function EmergencyContacts() {
  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    mobileNumber: '',
    email: '',
    address: '',
  });
  const [users, setUsers] = useState([]);
  const [error, setError] = useState({
    firstNameError: '',
    lastNameError: '',
    mobileNumberError: '',
    emailError: '',
    addressError: '',
  });
  // const [editable, setEditable] = useState(false);
  useEffect(() => {
    setInitialData = async () => {
      try {
        const value = await AsyncStorage.getItem('emergencyContacts');
        if (value !== null) {
          setUsers(JSON.parse(value).users)
        } else {
          console.log('Data not found.');
        }
      } catch (error) {
        console.log('Error loading data:', error);
      }
    };
    setError({
      firstNameError: '',
      lastNameError: '',
      mobileNumberError: '',
      emailError: '',
      addressError: '',
    });
    setInitialData()
  }, []);
  async function saveData(allUsers) {
    try {
      await AsyncStorage.setItem('emergencyContacts', JSON.stringify({users : allUsers}));
      console.log('Data saved.');
    } catch (error) {
      console.log('Error saving data:', error);
    }
  }


  const addUser = async() => {
    if (users.length >= 5) {
      // setError('You can only add up to 5 users');
      return;
    }
    if (validateForm()) {
      setUsers([...users, newUser]);
      setNewUser({
        firstName: '',
        lastName: '',
        mobileNumber: '',
        email: '',
        address: '',
      })
      setError({
        firstNameError: '',
        lastNameError: '',
        mobileNumberError: '',
        emailError: '',
        addressError: '',
      })
      await saveData([...users, newUser])
    }
  };

  const handleChange = (type, text) => {
    const tempUser = {...newUser};
    tempUser[type] = text;
    setNewUser(tempUser);
    if (type === 'email') {
      emailRegex.test(text)
        ? setError({...error, emailError: ''})
        : setError({...error, emailError: INVALID_EMAIL});
    } else if (type === 'mobileNumber' || text.length != 10) {
      mobileRegex.test(text)
        ? setError({...error, mobileNumberError: ''})
        : setError({...error, mobileNumberError: INVALID_MOBILE_NUMBER});
    } else {
      if (text.trim()) {
        setError({...error, [`${type}Error`]: ''})
      } else {
        setError({...error, [`${type}Error`]: REQUIRED_ERROR})
      }
    }
  };

  // const handleEdit = () => {
  //   setEditable(true);
  // };
  const validateForm = () => {
    let formIsValid = true;
    const newErrors = {...error};

    if (!newUser.firstName.trim()) {
      newErrors.firstNameError = REQUIRED_ERROR;
      formIsValid = false;
    }

    if (!newUser.lastName.trim()) {
      newErrors.lastNameError = REQUIRED_ERROR;
      formIsValid = false;
    }

    if (!newUser.mobileNumber.trim()) {
      newErrors.mobileNumberError = REQUIRED_ERROR;
      formIsValid = false;
    }

    if (!newUser.email.trim()) {
      newErrors.emailError = REQUIRED_ERROR;
      formIsValid = false;
    }

    if (!newUser.address.trim()) {
      newErrors.addressError = REQUIRED_ERROR;
      formIsValid = false;
    }

    setError(newErrors);
    return formIsValid;
  };
  return (
    <View style={styles.container}>
      {users.length < 5 && (
        <View style={styles.userContainer}>
          <View style={styles.inputBox}>
            <TextInput
              style={styles.input}
              placeholder="First Name"
              value={newUser.firstName}
              onChangeText={e => handleChange('firstName', e)}
              // editable={editable}
              // onPressIn={handleEdit}
            />
            {error.firstNameError ? (
              <Text style={styles.errorMessage}>{error.firstNameError}</Text>
            ) : null}
          </View>
          <View style={styles.inputBox}>
            <TextInput
              style={styles.input}
              placeholder="Last Name"
              value={newUser.lastName}
              onChangeText={e => handleChange('lastName', e)}
              // editable={editable}
              // onPressIn={handleEdit}
            />
            {error.lastNameError ? (
              <Text style={styles.errorMessage}>{error.lastNameError}</Text>
            ) : null}
          </View>
          <View style={styles.inputBox}>
            <TextInput
              style={styles.input}
              placeholder="Mobile Number"
              value={newUser.mobileNumber}
              onChangeText={e => handleChange('mobileNumber', e)}
              // editable={editable}
              // onPressIn={handleEdit}
            />
            {error.mobileNumberError ? (
              <Text style={styles.errorMessage}>{error.mobileNumberError}</Text>
            ) : null}
          </View>
          <View style={styles.inputBox}>
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              value={newUser.email}
              onChangeText={e => handleChange('email', e)}
              // editable={editable}
              // onPressIn={handleEdit}
            />
            {error.emailError ? (
              <Text style={styles.errorMessage}>{error.emailError}</Text>
            ) : null}
          </View>
          <View style={styles.inputBox}>
            <TextInput
              style={styles.input}
              placeholder="Address"
              value={newUser.address}
              onChangeText={e => handleChange('address', e)}
              // editable={editable}
              // onPressIn={handleEdit}
            />
            {error.addressError ? (
              <Text style={styles.errorMessage}>{error.addressError}</Text>
            ) : null}
          </View>
        </View>
      )}
      {/* {error ? <Text style={styles.error}>{error}</Text> : null} */}
      {users.length < 5 && <Button title="Add User" onPress={addUser} />}
      <View style={styles.emergencyContactsContainer}>
        {users.map((user, index) => (
          <View key={index} style={styles.emergencyContacts}>
            <View>
              <Text style={styles.textStyle}>{`${user.firstName} ${user.lastName}`}</Text>
            </View>
            <View>
              <Text style={styles.textStyle}>{user.email}</Text>
            </View>
            <View>
              <Text style={styles.textStyle}>{user.mobileNumber}</Text>
            </View>
            <View>
              <Text style={styles.textStyle}>{user.address}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  userContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 5,
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: '#ccc',
    // marginBottom: 16,
    paddingHorizontal: 16,
    color: 'black'
  },
  error: {
    color: 'red',
    marginBottom: 16,
  },
  errorMessage: {
    color: 'red',
    marginBottom: 16,
  },
  emergencyContactsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  emergencyContacts: {
    backgroundColor: '#fff',
    color: 'black',
    borderRadius: 5,
    padding: 10,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowColor: '#000',
  },
  textStyle: {
    color: 'black'
  }
});

export default EmergencyContacts;
