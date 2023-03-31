import React, {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import io from 'socket.io-client';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Switch,
  Linking,
} from 'react-native';
import {text} from '../../helpers/en';
const Dashboard = ({setLanguage, lang = 'en'}) => {
  const navigation = useNavigation();
  const [currentLockStatus, setCurrentLockStatus] = useState("LOCKED");
  const [profileData, setProfileData] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  useEffect(() => {
    const socket = io('http://localhost:5003/');

    socket.on('connect', () => {
      console.log('Connected to server');
    });
    socket.on('uvInput', data => {
      const {uv} = data;
      if (parseInt(uv) > 50) {
        handleEmergency(uv);
      }
    });
    setLockStatus('UNLOCKED');

    const readData = async () => {
      try {
        if (!(await AsyncStorage.getItem('notificationTriggerBaseTimeStamp'))) {
          await AsyncStorage.setItem(
            'notificationTriggerBaseTimeStamp',
            Date().toString(),
          );
        }
        const profileData = JSON.parse(await AsyncStorage.getItem('inputs'));
        setProfileData(profileData);
      } catch (error) {
        console.log(error);
      }
    };
    readData();
    return () => {
      socket.disconnect();
    };
  }, []);
  React.useEffect(() => {
    const readData = async () => {
      try {
        const profileData = JSON.parse(await AsyncStorage.getItem('inputs'));
        setProfileData(profileData);
      } catch (error) {
        console.log(error);
      }
    };
    const unsubscribe = navigation.addListener('focus', () => {
      readData();
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  const handleWheelchairLocking = () => {
    fetch('http://localhost:5003/status_value')
      .then(r => r.json())
      .then(res => {
        const {lock_status} = res;
        if (lock_status === 'UNLOCKED') {
          setLockStatus('LOCKED');
        } else {
          // Alert.alert(text[lang].alreadyLockedError);
          setLockStatus('UNLOCKED');
        }
      })
      .catch(e => {
        Alert.alert(e.message);
      });
  };
  const setLockStatus = status => {
    fetch('http://localhost:5003/receive_resp', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({status}),
    })
      .then(r => r.json())
      .then(res => {
        // console.log(res);
        const {lock_status} = res;
        Alert.alert(
          `Wheelchair is ${lock_status === 'UNLOCKED' ? 'unlocked' : 'locked'}`,
        );
        setCurrentLockStatus(lock_status)
      })
      .catch(e => {
        Alert.alert(e.message);
      });
  };
  const handleLanguageChange = () => {
    if (lang === 'en') {
      setLanguage('fr');
    } else {
      setLanguage('en');
    }
  };
  const handleEmergency = async () => {
    const contacts = await AsyncStorage.getItem('emergencyContacts');
    const allContacts = contacts ? JSON.parse(contacts) : [];
    if (allContacts.length) {
      Linking.openURL(`tel:${allContacts[0].mobileNumber}`);
    } else {
      Linking.openURL(`tel:911`);
    }
  };
  return (
    <View style={styles.container}>
      <View style={[styles.sidebar, {left: menuOpen ? 0 : -200}]}>
        {menuItems.map((item, index) => (
          <View key={index} style={styles.sidebarItem}>
            <Text style={styles.sidebarItemText}>{item}</Text>
          </View>
        ))}
      </View>
      <View style={styles.headerWrapper}>
        <View>
          <Text
            style={{
              fontSize: 24,
              marginBottom: 5,
              color: 'white',
              marginLeft: 5,
            }}>
            {text[lang].hello}
          </Text>
          {profileData && profileData.name && (
            <Text
              style={{
                fontSize: 24,
                marginBottom: 5,
                color: 'white',
                marginLeft: 5,
              }}>
              {profileData.name}
            </Text>
          )}
        </View>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>French/English</Text>
          <Switch
            trackColor={{false: '#767577', true: '#81b0ff'}}
            ios_backgroundColor="#3e3e3e"
            onValueChange={() => handleLanguageChange()}
            value={lang === 'en'}
          />
        </View>
      </View>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          flexBasis: 100,
        }}>
        <View
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 10,
            flexDirection: 'row',
          }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Profile')}
            style={{
              flex: 1,
              backgroundColor: '#1E90FF',
              padding: 30,
              flex: 1,
              borderRadius: 15,
            }}>
            <Text
              style={{
                color: 'white',
                fontSize: 20,
                fontWeight: 600,
                textAlign: 'center',
              }}>
              {text[lang].profileDetails}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('Emergency Contacts')}
            style={{
              flex: 1,
              backgroundColor: 'orange',
              padding: 30,
              flex: 1,
              borderRadius: 15,
            }}>
            <Text
              style={{
                color: 'white',
                fontSize: 20,
                fontWeight: 600,
                textAlign: 'center',
              }}>
              {text[lang].emergencyDetails}
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 10,
          }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Emergency Activation')}
            style={{
              backgroundColor: '#404040',
              padding: 30,
              flex: 1,
              borderRadius: 15,
            }}>
            <Text
              style={{
                color: 'red',
                fontSize: 20,
                fontWeight: 600,
                textAlign: 'center',
              }}>
              {text[lang].emergencyActivation}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleWheelchairLocking}
            style={{
              backgroundColor: '#404040',
              padding: 30,
              flex: 1,
              borderRadius: 15,
            }}>
            <Text
              style={{
                color: 'red',
                fontSize: 20,
                fontWeight: 600,
                textAlign: 'center',
              }}>
              { currentLockStatus === "UNLOCKED" ? text[lang].lockWheelchair :  text[lang].unlockWheelchair }
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 10,
          }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Maintenance')}
            style={{
              backgroundColor: '#90EE90',
              padding: 25,
              flex: 1,
              borderRadius: 15,
            }}>
            <Text
              style={{
                color: 'black',
                fontSize: 20,
                fontWeight: 600,
                textAlign: 'center',
              }}>
              {text[lang].maintenanceStatus}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('Notifications')}
            style={{
              backgroundColor: 'red',
              padding: 20,
              flex: 1,
              borderRadius: 15,
            }}>
            <Text
              style={{
                color: 'black',
                fontSize: 20,
                fontWeight: 600,
                textAlign: 'center',
              }}>
              {text[lang].notifications}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eee',
    padding: 10,
    backgroundColor: 'black',
  },
  menuIconContainer: {
    marginRight: 10,
  },
  menuIcon: {
    width: 30,
    height: 30,
    justifyContent: 'space-between',
  },
  iconLine: {
    width: '100%',
    height: 3,
    backgroundColor: '#1E90FF',
  },
  headerTitle: {
    fontSize: 20,
    color: 'white',
    marginLeft: 100,
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    left: -200,
    width: 200,
    height: '100%',
    backgroundColor: '#eee',
    zIndex: 1,
    boxShadow: '2px 0 4px rgba(0, 0, 0, 0.3)',
    paddingTop: 60,
    overflow: 'hidden',
  },
  sidebarItem: {
    padding: 10,
    backgroundColor: '#ddd',
    marginBottom: 5,
    borderRadius: 5,
  },
  sidebarItemText: {
    fontSize: 16,
    color: '#333',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  headerWrapper: {
    marginTop: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
  },
  headerContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
});
export default Dashboard;
