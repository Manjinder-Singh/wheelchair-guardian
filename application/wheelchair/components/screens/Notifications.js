import React, {useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import {momentAfterTimePeriod} from '../../helpers/helpers';
import { text } from '../../helpers/en' 
const Notifications = ({ lang }) => {
  const [notifications, setNotifications] = useState([]);
  let interval, timeout;

  useFocusEffect(
    React.useCallback(() => {
      interval && clearInterval(interval);
      timeout && clearTimeout(timeout);
      setTimerForNextNotification();
      function unsubscribe() {
        interval && clearInterval(interval);
        timeout && clearTimeout(timeout);
      }
      return () => unsubscribe();
    }, []),
  );

  function pushNotificationAfterTimePeriod(timePeriod) {
    const intervalTime = momentAfterTimePeriod(moment(), timePeriod)
      .add(999, 'SSS')
      .diff(moment());
    interval = setInterval(() => {
      addNewNotification(timePeriod);
    }, intervalTime);
  }

  const addNewNotification = () => {
    setNotifications(prev => {
      return [
        ...prev,
        {
          id: prev.length + 1,
          date: moment().format('dddd, MMMM Do YYYY, h:mm:ss a'),
        },
      ];
    });
  };
  const setTimerForNextNotification = async () => {
    const baseTimeStamp = await AsyncStorage.getItem(
      'notificationTriggerBaseTimeStamp',
    );
    let baseTimeMoment = moment(baseTimeStamp);
    const timePeriod = await AsyncStorage.getItem(
      'notificationTriggerBaseTimePeriod',
    );
    if (baseTimeStamp && timePeriod) {
      const temp = [];
      let index = 1;
      while (moment().isAfter(baseTimeMoment)) {
        baseTimeMoment = momentAfterTimePeriod(baseTimeMoment, timePeriod);
        temp.push({
          id: index,
          date: baseTimeMoment.format('dddd, MMMM Do YYYY, h:mm:ss a'),
        });
        index = index + 1;
      }
      setNotifications(_ => temp);
      const timeRemaningForNext = baseTimeMoment.diff(moment());
      timeout = setTimeout(() => {
        pushNotificationAfterTimePeriod(timePeriod);
      }, timeRemaningForNext);
    }
  };
  return (
    <SafeAreaView style={styles.notificationsContainer}>
      {notifications.length ? (
        <Text style={[styles.primaryText, styles.setColorWhite]}>{text[lang].maintenanceReminder}</Text>
      ) : (
        <Text style={[styles.primaryText, styles.setColorWhite]}>{text[lang].noNotificationFound}</Text>
      )}

      <ScrollView style={styles.notificationsCardContainer}>
        {notifications &&
          notifications.map(notification => (
            <View key={notification.id} style={styles.notificationsCard}>
              <Text>{text[lang].maintenanceDueOn}</Text>
              <Text>{notification.date}</Text>
            </View>
          ))}
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  notificationsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    padding: 10,
    backgroundColor: 'black',
    marginBottom: 20
  },
  notificationsCardContainer:{
    height: "100%",
    color:'black'
  },
  notificationsCard: {
    padding: 10,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  setColorWhite: {
    color: '#fff',
  },
  primaryText: {
    flexDirection: 'row',
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 15,
    fontSize: 20,
  },
});

export default Notifications;
