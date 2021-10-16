import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './HomeScreen';

const HomeStack = createNativeStackNavigator();

const HomeStackScreen = () => {
    return (
        <HomeStack.Navigator initialRoute="Home">
            <HomeStack.Screen name="Map" component={HomeScreen} options={{headerShown: false}}/>
        </HomeStack.Navigator>
    )
}

export default HomeStackScreen
