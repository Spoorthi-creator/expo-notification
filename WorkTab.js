import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,

  StatusBar,
  SafeAreaView,
  Arrow,
  Platform
} from 'react-native';
import db from '../config';
import { RFValue } from 'react-native-responsive-fontsize';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import firebase from 'firebase';
import { Entypo } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
  
  async function registerForPushNotificationsAsync() {
    let token;
    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
    } else {
      alert('Must use physical device for Push Notifications');
    }
  
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  
    return token;
  }
export default function WorkTab() {


    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();
     const[task,setTask] =useState('');
     const[date,setDate] =useState('');
     const[minDate,setMinDate] =useState('');
     const[triggerDay,setTriggerDay]=useState('');
     const[triggerMonth,setTriggerMonth]=useState('');
     const[time,setTime] =useState('');
     const [triggerTS,setTriggerTS]=useState('');

const trigger = new Date(triggerTS);

trigger.setHours(5);
trigger.setMinutes(30);
trigger.setSeconds(0);
     async function sendPushNotification(expoPushToken) {
       
        
        const identifier =  await Notifications.scheduleNotificationAsync({
           
          content: {
            title: "Task Manager",
            body: task,
            data: {},
          },
        // trigger:{minute:50,hour:11,month:6,day:1,repeats:false},
     trigger,
        });
      //  await Notifications.cancelScheduledNotificationAsync(identifier);
        alert('You have successfully subscribed for notifications');
      }
     useEffect(() => {
        registerForPushNotificationsAsync().then((token) =>
          setExpoPushToken(token)
        );
        notificationListener.current =
          Notifications.addNotificationReceivedListener((notification) => {
            setNotification(notification);
          });
        responseListener.current =
          Notifications.addNotificationResponseReceivedListener((response) => {
            console.log(response);
          });
    
        return () => {
          Notifications.removeNotificationSubscription(
            notificationListener.current
          );
          Notifications.removeNotificationSubscription(responseListener.current);
        };
      }, []);

  useEffect(() => {
    
      
   // this.loadFontsAsync();
    var d = new Date();
    console.log(d.toDateString())
    setMinDate(d)
}, []);

  async function submitButton() {
    if (date && time && task) {
       await db.collection(firebase.auth().currentUser.email).add({
        date: date,
        time: time,
        task: task,
        taskType:'work',
        
      });
     // this.setState({ task: '', date: '', time: '' });
      alert('Task Added');
    } else {
     // this.setState({ task: '', date: '', time: '' });
      alert('Please Enter all Details');
    }
  }; 
  
    return (
      <View>
        <SafeAreaView style={styles.droidSafeArea} />
        <View style={styles.header}>
          <Text style={styles.headerText}> Calendar </Text>
        </View>

        <Calendar
          onDayPress={(day) => {
            console.log("Calender date"+ day.timestamp)
            setTriggerTS(day.timestamp)
            setDate(day.dateString) ;
            alert("Date Selected");
           setTriggerDay(day.day)
           setTriggerMonth(day.month)
          
          }}
           theme={{
    backgroundColor: '#ffffff',
    calendarBackground: '#ffffff',
    textSectionTitleColor: '#b6c1cd',
    textSectionTitleDisabledColor: '#d9e1e8',
    selectedDayBackgroundColor: '#00adf5',
    selectedDayTextColor: '#ffffff',
    todayTextColor: '#00adf5',
    dayTextColor: '#2d4150',
    textDisabledColor: '#d9e1e8',
    dotColor: '#00adf5',
    selectedDotColor: '#ffffff',
    arrowColor: 'orange',
    disabledArrowColor: '#d9e1e8',
    monthTextColor: 'blue',
    indicatorColor: 'blue',
   // textDayFontFamily: 'Comic-Neue',
   // textMonthFontFamily: 'Comic-Neue',
   // textDayHeaderFontFamily: 'Comic-Neue',
    textDayFontWeight: '300',
    textMonthFontWeight: 'bold',
    textDayHeaderFontWeight: '300',
    textDayFontSize: 16,
    textMonthFontSize: 16,
    textDayHeaderFontSize: 16
  }}
          
        //  minDate = {minDate}
        />

        <TextInput
          style={{
            marginTop: 20,
            borderWidth: 2,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            borderBottomLeftRadius: 8,
            borderBottomRightRadius: 8,
           // fontFamily : "Comic-Neue"
          }}
          placeholder={'Tasks'}
          onChangeText={(text) => {
            setTask( text );
          }}
          value={task}
        />

        <TextInput
          style={{
            marginTop: 10,
            borderWidth: 2,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            borderBottomLeftRadius: 8,
            borderBottomRightRadius: 8,
          //  fontFamily : "Comic-Neue"
          }}
          placeholder={'Time'}
          onChangeText={(text) => {
            setTime( text );
          }}
          value={time}
        />

        <TouchableOpacity onPress={async () => {
                  await sendPushNotification(expoPushToken)}}
        style={{alignSelf:'flex-end'}}>
            <Text>
                Need to be notified? Click here.
            </Text>
            <Entypo name="bell" size={24} color="black" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonStyle}
          onPress={submitButton}>
          <Text style = {{}}> Submit </Text>
        </TouchableOpacity>
      </View>
    );
    
  }


const styles = StyleSheet.create({
  header: {
    backgroundColor: '#88dc3d',
    height: RFValue(60),
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerText: {
    fontSize: RFValue(30),
   // fontFamily : "Comic-Neue"
  },
  droidSafeArea: {
    marginTop:
      Platform.OS === 'android' ? StatusBar.currentHeight : RFValue(35)
  },
  buttonStyle: {
    backgroundColor: '#88dc3d',
    marginTop: RFValue(20),
    width: RFValue(100),
    height: RFValue(30),
    borderWidth: 2,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center'
  },
});
