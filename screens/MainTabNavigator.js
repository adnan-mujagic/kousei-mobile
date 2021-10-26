import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import React, { useEffect, useState } from 'react'
import { View, Text } from 'react-native'
import primaryColor from '../general_styles/primaryColor';
import Feed from './Feed';
import HomeStackScreen from './HomeStackScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LogInScreen from './LogInScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from 'react-redux';
import { selectToken } from '../slices/mainSlice';

const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  const t = useSelector(selectToken);

    useEffect(()=>{
      if(t){
        setLoggedIn(true);
      }else{
        setLoggedIn(false)
      }
    },[t])

    console.log(t)

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
                  iconName = "md-compass-outline";
                }

                else if(route.name ==="LogIn"){
                  iconName= focused? "log-in": "log-in-outline"
                }
    
                // You can return any component that you like here!
                return <Ionicons name={iconName} size={size} color={color} />;
              },
              
              tabBarShowLabel:false,
              tabBarActiveTintColor: primaryColor(),
              tabBarInactiveTintColor: 'gray',
            })}
          >
            <Tab.Screen name="Home" component={HomeStackScreen} options={{headerShown:false}} />
            <Tab.Screen name="Feed" component={Feed} options={{headerShown:false}} />
            {!loggedIn && <Tab.Screen name="LogIn" component={LogInScreen} options={{headerShown:false}}/>}
          </Tab.Navigator>
      
    )
}

export default MainTabNavigator
