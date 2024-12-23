import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Image} from 'react-native';
import Mudavim from '../screens/Users/Mudavim';
import Kuponlarım from '../screens/Users/Kuponlarım';
import Profil from '../screens/Users/Profil';
import {anasayfa_icon, kuponlarım_icon, profil_icon} from '../assets/icons';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#FFF',
          borderTopWidth: 1,
          borderTopColor: '#F0F0F0',
        },
        tabBarActiveTintColor: '#4A3428',
        tabBarInactiveTintColor: '#999',
        headerShown: false,
      }}>
      <Tab.Screen
        name="Anasayfa"
        component={Mudavim}
        options={{
          tabBarIcon: ({focused}) => (
            <Image
              source={anasayfa_icon}
              style={{
                width: 24,
                height: 24,
                tintColor: focused ? '#4A3428' : '#999',
              }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Kuponlarım"
        component={Kuponlarım}
        options={{
          tabBarIcon: ({focused}) => (
            <Image
              source={kuponlarım_icon}
              style={{
                width: 24,
                height: 24,
                tintColor: focused ? '#4A3428' : '#999',
              }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profil"
        component={Profil}
        options={{
          tabBarIcon: ({focused}) => (
            <Image
              source={profil_icon}
              style={{
                width: 24,
                height: 24,
                tintColor: focused ? '#4A3428' : '#999',
              }}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
