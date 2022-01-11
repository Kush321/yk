import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ImageView,
  TextInput,
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
  Switch,
  Platform,
  Image,
  Dimensions,
  Modal,
} from 'react-native';
import { DrawerItems } from 'react-navigation-drawer';
import MyHeader from '../components/MyHeader';
import { Card } from 'react-native-elements';
import db from '../config';
import firebase from 'firebase';
import { RFValue } from 'react-native-responsive-fontsize';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Avatar, ListItem } from 'react-native-elements';
import { Icon } from 'react-native-elements';

export default class SettingScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      userId: firebase.auth().currentUser.email,
      emailId: '',
      firstName: '',
      lastName: '',
      address: '',
      phnum: '',
      image: '#',
      docId: '',
      birthday: '',
      light_theme: true,
      current_theme: 'light',
      name: '',
    };
  }

  getUserDetails = () => {
    var email = firebase.auth().currentUser.email;
    db.collection('users')
      .where('email_id', '==', email)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          var data = doc.data();
          this.setState({
            emailId: data.email_id,
            firstName: data.first_name,
            lastName: data.last_name,
            address: data.address,
            phnum: data.phnum,
            current_theme: data.current_theme,
            docId: doc.id,
            birthday: data.birthday,
          });
          if (this.state.current_theme == 'light') {
            this.setState({
              light_theme: true,
            });
          } else if (this.state.current_theme == 'dark') {
            this.setState({
              light_theme: false,
            });
          }
        });
      });
  };
  fetchImage = (imageName) => {
    var storageRef = firebase
      .storage()
      .ref()
      .child('user_profiles/' + imageName);

    // Get the download URL
    storageRef
      .getDownloadURL()
      .then((url) => {
        this.setState({ image: url });
      })
      .catch((error) => {
        this.setState({ image: '#' });
      });
  };

  getUserProfile() {
    db.collection('users')
      .where('email_id', '==', this.state.userId)
      .onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          this.setState({
            name: doc.data().first_name + ' ' + doc.data().last_name,
            email: doc.data().email_id,
            docId: doc.id,
            image: doc.data().image,
          });
        });
      });
  }
  componentDidMount() {
    this.getUserDetails();
    this.fetchImage(this.state.userId);
    this.getUserProfile();
  }

  render() {
    return (
      <View style={this.state.light_theme ? styles.bgLight : styles.bg}>
        <MyHeader navigation={this.props.navigation} />
        <Text
          style={
            this.state.light_theme ? styles.titleTextLight : styles.titleText
          }>
          Settings
        </Text>
        <ListItem
          leftAvatar={{ rounded: true, source: { uri: this.state.image }, size: 60 }}
          title={this.state.name}
          titleStyle={{ color: (this.state.light_theme ? 'black' : 'white'), fontSize: RFValue(20) }}
          subtitleStyle={{ color: (this.state.light_theme ? 'black' : 'white'), fontSize: RFValue(13) }}
          subtitle="Account"
          chevron={<Icon name="chevron-forward-outline" type="ionicon" color={this.state.light_theme ? 'black' : 'white'} />}
          onPress={() => {
            this.props.navigation.navigate('AccountSettings');
          }}
          style={{
            width: '90%',
            alignSelf: 'center',
            marginBottom: RFValue(15)
          }}
          containerStyle={{
          backgroundColor: this.state.light_theme ? 'white' : '#1c1c1d',           
          borderRadius: 10
          }}
        />
        <ListItem
          title="Appearance"
          titleStyle={{ color: (this.state.light_theme ? 'black' : 'white'), fontSize: RFValue(15) }}
          chevron={<Icon name="chevron-forward-outline" type="ionicon" color={this.state.light_theme ? 'black' : 'white'} />}
          onPress={() => {
            this.props.navigation.navigate('AppearanceSettings');
          }}
          style={{
            width: '90%',
            alignSelf: 'center',
            marginBottom: RFValue(15)
          }}
          containerStyle={{
          backgroundColor: this.state.light_theme ? 'white' : '#1c1c1d',           
          borderRadius: 10
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  bg: {
    backgroundColor: '#333333',
    flex: 1,
  },
  bgLight: {
    backgroundColor: '#ededed',
    flex: 1,
  },
  titleTextLight: {
    fontSize: RFValue(24),
    color: 'black',
    fontWeight: '600',
    padding: RFValue(15),
    textAlign: 'center',
  },
  titleText: {
    fontSize: RFValue(24),
    color: 'white',
    fontWeight: '600',
    padding: RFValue(15),
    textAlign: 'center',
  },
});
