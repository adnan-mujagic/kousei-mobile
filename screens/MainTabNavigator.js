import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import React from 'react'
import { View, Text } from 'react-native'
import primaryColor from '../general_styles/primaryColor';
import Feed from './Feed';
import HomeStackScreen from './HomeStackScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {
    return (
        
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName;
    
                if (route.name === 'Home') {
                  iconName = focused
                    ? 'map'
                    : 'map-outline';
                } else if (route.name === 'Feed') {
                  iconName = focused ? 'list' : 'ios-list';
                }
    
                // You can return any component that you like here!
                return <Ionicons name={iconName} size={size} color={color} />;
              },
              tabBarActiveTintColor: primaryColor(),
              tabBarInactiveTintColor: 'gray',
            })}
          >
            <Tab.Screen name="Home" component={HomeStackScreen} options={{headerShown:false}} />
            <Tab.Screen name="Feed" component={Feed} options={{headerShown:false}} />
            
          </Tab.Navigator>
      
    )
}

export default MainTabNavigator
