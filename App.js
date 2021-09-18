import 'react-native-gesture-handler';
import React from 'react';
import { StyleSheet, View, Text, StatusBar } from 'react-native';
import AddEntry from './components/AddEntry';
import History from './components/History';
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import reducer from './reducers'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons'
import Constants from 'expo-constants'
import { purple } from './utils/colors'

// const Stack = createNativeStackNavigator();
const Stack = createStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Tabs} />
    </Stack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

function Tabs () {
  return (
    <NavigationContainer>
      <UdaciStatusBar backgroundColor={purple} barStyle="light-content" />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Home') {
              iconName ='ios-bookmarks'
            } else if (route.name === 'Add entry') {
              iconName = 'ios-add'
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Home" component={History} />
        <Tab.Screen name="Add entry" component={AddEntry} />
      </Tab.Navigator>
    </NavigationContainer>
  )
}

function UdaciStatusBar ({backgroundColor, ...props}) {
  return (
    <View style={{ backgroundColor, height: Constants.statusBarHeight }}>
      <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </View>
  )
}

export default function App() {
  return (
    <Provider store={createStore(reducer)}>
      <Tabs/>
    </Provider>
  );
}