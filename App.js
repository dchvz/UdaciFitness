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
import { purple, white } from './utils/colors'
import EntryDetail from './components/EntryDetail'

const Stack = createStackNavigator();

const StackNavigatorConfig = {
  headerMode: "screen"
}
const StackConfig = {
  TabNav:{
    name: "Home",
    component: Tabs,
    options: {headerShown: false}
  },
  EntryDetail:{
    name: "EntryDetail",
    component: EntryDetail,
    options: {
      headerTintColor: white,
      headerStyle:{
        backgroundColor: purple
      },
      title: "Entry Detail"
    }
  }
}

function Stacks() {
  return (
    <Stack.Navigator {...StackNavigatorConfig}>
      <Stack.Screen {...StackConfig['TabNav']} />
      <Stack.Screen {...StackConfig['EntryDetail']} />
  </Stack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

function Tabs () {
  return (
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
      {/* <Tabs/> */}
      <UdaciStatusBar backgroundColor={purple} barStyle="light-content" />
      <NavigationContainer>
        <Stacks />
      </NavigationContainer>
    </Provider>
  );
}