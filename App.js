import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import {StyleSheet} from 'react-native';
import { Provider } from 'react-redux'
import Feed from './screens/Feed';
import HomeScreen from './screens/HomeScreen';
import { store } from './store';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MainTabNavigator from './screens/MainTabNavigator';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LogInScreen from './screens/LogInScreen';

const MainStack = createNativeStackNavigator()

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <MainStack.Navigator initialRouteName="MainTabNavigator">
          <MainStack.Screen name="MainTabNavigator" component={MainTabNavigator} options={{headerShown:false}}/>
          <MainStack.Screen name="LogIn" component={LogInScreen} options={{headerShown:false}}/>
        </MainStack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
