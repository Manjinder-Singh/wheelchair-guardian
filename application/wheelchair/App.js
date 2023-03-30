/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import 'react-native-gesture-handler';
import React, {useEffect} from 'react';
import TouchID from 'react-native-touch-id';
import {
  Alert,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  BackHandler,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import Profile from './components/screens/Profile';
import EmergencyContacts from './components/screens/EmergencyContacts';
import EmergencyActivation from './components/screens/EmergencyActivation';
import Maintenance from './components/screens/Maintenance';
import Notifications from './components/screens/Notifications';
import Dashboard from './components/screens/Dashboard';
import Loader from './components/screens/Loader';
import { text } from './helpers/en';

function Article({lang}) {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>{text[lang].articleScreen}</Text>
    </View>
  );
}

function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}

const Drawer = createDrawerNavigator();

function MyDrawer({setLanguage, lang = 'en'}) {
  return (
    <Drawer.Navigator
      useLegacyImplementation
      drawerContent={props => <CustomDrawerContent {...props} />}>
      <Drawer.Screen name="Dashboard" options={{ title: text[lang].dashboard }}>
        {props => (
          <Dashboard setLanguage={setLanguage} lang={lang} {...props} />
        )}
      </Drawer.Screen>
      <Drawer.Screen name="Profile" options={{ title: text[lang].profile }}>
        {props => <Profile lang={lang} {...props} />}
      </Drawer.Screen>
      <Drawer.Screen name="Emergency Contacts" options={{ title: text[lang].EmergencyContacts }}>
        {props => <EmergencyContacts lang={lang} {...props} />}
      </Drawer.Screen>
      <Drawer.Screen name="Emergency Activation" options={{ title: text[lang].emergencyActivation }}>
        {props => <EmergencyActivation lang={lang} {...props} />}
      </Drawer.Screen>
      <Drawer.Screen name="Lock Wheelchair" options={{ title: text[lang].lockWheelchair }}>
        {props => <Article lang={lang} {...props} />}
      </Drawer.Screen>
      <Drawer.Screen name="Maintenance" options={{ title: text[lang].maintenanceStatus }}>
        {props => <Maintenance lang={lang} {...props} />}
      </Drawer.Screen>
      <Drawer.Screen name="Notifications" options={{ title: text[lang].notifications }}>
        {props => <Notifications lang={lang} {...props} />}
      </Drawer.Screen>
    </Drawer.Navigator>
  );
}

function App() {
  const [isAuth, setIsAuth] = React.useState(false);
  const [showLoader, setShowLoader] = React.useState(false);
  const [lang, setLanguage] = React.useState('en');
  const optionalConfigObject = {
    title: 'Authentication Required',
    imageColor: '#e00606',
    imageErrorColor: '#ff0000',
    sensorDescription: 'Touch sensor',
    sensorErrorDescription: 'Failed',
    cancelText: 'Cancel',
    fallbackLabel: 'Show Passcode',
    unifiedErrors: false,
    passcodeFallback: false,
  };
  const handleBiomatric = () => {
    TouchID.isSupported(optionalConfigObject)
      .then(biometricType => {
        if (biometricType) {
          TouchID.authenticate('', optionalConfigObject)
            .then(success => {
              console.log(success);
              setShowLoader(true);
              setTimeout(() => {
                setIsAuth(true);
                setShowLoader(false);
              }, 4000);
            })
            .catch(e => {
              console.log(e);
              Alert.alert(text[lang].permissionIsMandatory);
            });
        } else {
          Alert.alert(
            'Please set-up an Face-Id, Touch-Id or pin based authetication on your device',
          );
          BackHandler.exitApp();
        }
      })
      .catch(error => {
        console.log(error);
      });
  };
  useEffect(() => {
    handleBiomatric();
  }, []);

  return (
    <>
      {showLoader ? (
        <Loader/>
      ) : isAuth ? (
        <NavigationContainer>
          <MyDrawer setLanguage={setLanguage} lang={lang} />
        </NavigationContainer>
      ) : (
        <Text>{text[lang].authIsRequired}</Text>
      )}
    </>
  );
}


const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
