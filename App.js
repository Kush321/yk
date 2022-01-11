
import React from 'react';
import { createAppContainer, createSwitchNavigator,} from 'react-navigation';

import LoginScreen from './screens/LoginScreen';
import { AppDrawerNavigator } from './components/AppDrawerNavigator'
import { AppTabNavigator } from './components/AppTabNavigator'
import AccountSettings from './screens/AccountSettings';
import SettingScreen from './screens/SettingScreen';
import SpecialHeader from './components/SpecialHeader';
import AppearanceSettings from './screens/AppearanceSettings';
import Chat from './screens/Chat';

export default function App() {
  return (
    <AppContainer/>
  );
}


const switchNavigator = createSwitchNavigator({
  LoginScreen:{screen: LoginScreen},
  Drawer:{screen: AppDrawerNavigator},
  BottomTab: {screen: AppTabNavigator},
  AccountSettings:{screen: AccountSettings},
  SpecialHeader:{screen: SpecialHeader},
  AppearanceSettings:{screen: AppearanceSettings},
  Chat:{screen: Chat},
})

const AppContainer =  createAppContainer(switchNavigator);
