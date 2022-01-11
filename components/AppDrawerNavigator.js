import React from 'react';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { AppTabNavigator } from './AppTabNavigator';
import CustomSideBarMenu from './CustomSideBarMenu';
import MyDonationScreen from '../screens/MyDonationScreen';
import NotificationScreen from '../screens/NotificationScreen';
import SettingScreen from '../screens/SettingScreen';
import Chat from '../screens/Chat';
import firebase from 'firebase';
import db from '../config';
import { Icon } from 'react-native-elements';
import { RFValue } from "react-native-responsive-fontsize";

export const AppDrawerNavigator = createDrawerNavigator(
  {
    Home: {
      screen: AppTabNavigator,
      navigationOptions: {
        drawerIcon: <Icon name="home-outline" type="ionicon" color='#9ca158'/>,
      },
    },
    MyDonations: {
      screen: MyDonationScreen,
      navigationOptions: {
        drawerIcon: (
          <Icon
            name="gift"
            type="font-awesome"
            color='#9ca158'
          />
        ),
        drawerLabel: 'My Donations',
      },
    },
    Notification: {
      screen: NotificationScreen,
      navigationOptions: {
        drawerIcon: <Icon name="notifications-outline" type="ionicon" color='#9ca158' />,
        drawerLabel: 'Notifications',
      },
    },
    Setting: {
      screen: SettingScreen,
      navigationOptions: {
        drawerIcon: <Icon name="cog-outline" type="ionicon" color='#9ca158' />,
        drawerLabel: 'Settings',
      },
    },
  },
  {
    contentComponent: CustomSideBarMenu,
  },
  {
    initialRouteName: 'Home',
  }
);
