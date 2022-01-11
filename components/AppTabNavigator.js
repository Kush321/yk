import React from 'react';
import { Image } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { AppStackNavigator } from './AppStackNavigator';
import SendRequestScreen from '../screens/SendRequestScreen';
import ChatScreen from '../screens/ChatScreen'
import Ionicons from 'react-native-vector-icons/Ionicons';

export const AppTabNavigator = createBottomTabNavigator({
  Chats: {
    screen: ChatScreen,
    navigationOptions: {
      tabBarIcon: (
        <Ionicons
          transparent={true}
          visible={false}
          name={'chatbox-ellipses-outline'}
          color={'black'}
        />
      ),
      tabBarLabel: 'Chats',
    },
  },
  DonateBooks: {
    screen: AppStackNavigator,
    navigationOptions: {
      tabBarIcon: (
        <Ionicons
          transparent={true}
          visible={false}
          name={'person-outline'}
          color={'black'}
        />
      ),
      tabBarLabel: 'Requests',
    },
  },
  AddFriends: {
    screen: SendRequestScreen,
    navigationOptions: {
      tabBarIcon: (
        <Ionicons
          transparent={true}
          visible={false}
          name={'person-add-outline'}
          color={'black'}
        />
      ),
      tabBarLabel: 'Find Friends'
    },
  },
});
