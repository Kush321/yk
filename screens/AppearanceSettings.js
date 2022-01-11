import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
  Platform,
  Dimensions,
  Modal,
} from 'react-native';
import { Card } from 'react-native-elements';
import SpecialHeader from '../components/SpecialHeader';
import db from '../config';
import firebase from 'firebase';
import { RFValue } from 'react-native-responsive-fontsize';
import Ionicons from 'react-native-vector-icons/Ionicons';

var month;
var day;
var year;
var bday;
var areacode;
var centerdigits;
var lastfour;
var pnumber;
 
export default class SettingScreen extends Component {
  constructor() {
    super();
    this.state = {
      emailId: '',
      firstName: '',
      lastName: '',
      address: '',
      phnum: '',
      docId: '',
      birthday: '',
      light_theme: true,
      current_theme: 'light',
    };
  }
 
  toggleSwitch() {
    var new_state = !this.state.light_theme;
    var theme = this.state.light_theme ? 'dark' : 'light';
    this.setState({
      current_theme: theme,
      light_theme: new_state,
    });
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
 
  updateUserDetails = () => {
    db.collection('users').doc(this.state.docId).update({
      first_name: this.state.firstName,
      last_name: this.state.lastName,
      address: this.state.address,
      phnum: this.state.phnum,
      birthday: this.state.birthday,
      current_theme: this.state.current_theme,
    });
    Alert.alert('Success!', 'Your profile was updated successfully!', [
      {
        text: 'Dismiss',
      },
    ]);
  };
 
  componentDidMount() {
    this.getUserDetails();
  }
 
  render() {
    return (
      <View style={
              this.state.light_theme ? styles.contaLight : styles.conta
            }>
        <SpecialHeader navigation={this.props.navigation} page="Appearance"/>
        <View
          style={styles.formContainer}>
          <Text
            style={
              this.state.light_theme ? styles.titleTextLight : styles.titleText
            }>
            Appearance
          </Text>
          <View style={
              this.state.light_theme ? styles.themeViewLight : styles.themeView
            }>
          <View style={styles.imageView}>
          <Image source={require('../assets/light.png')} style={styles.image}/>
          <Image source={require('../assets/dark.png')} style={styles.image}/>
          </View>
          <Ionicons
                transparent={true}
                visible={false}
                name={'checkmark-circle-outline'}
                size={RFValue(25)}
                style={this.state.light_theme ? 
                  { 
                    marginTop: RFValue(-80), 
                    paddingBottom: RFValue(50),
                    marginLeft: Dimensions.get('window').width/10*2.85
                  } : { 
                    marginTop: RFValue(-80), 
                    paddingBottom: RFValue(50),
                    marginLeft: Dimensions.get('window').width/10*5.45
                  }}
                color={'green'}
          />
          <View style={{flexDirection: 'row', alignItems: 'center', paddingLeft: RFValue(35), marginTop: RFValue(5), marginBottom: RFValue(10)}}>
          <Text
            style={
              this.state.light_theme
                ? [styles.labelLight]
                : [styles.label]
            }>
            Theme:{' '}
          </Text>
          <Switch
            style={{
              transform: [{ scaleX: 1 }, { scaleY: 1 }],
              }}
            trackColor={{
              false: '#333333',
              true: '#888888',
            }}
            thumbColor={this.state.light_theme ? '#333333' : 'white'}
            ios_backgroundColor="white"
            onValueChange={() => this.toggleSwitch()}
            value={this.state.light_theme}
          />
          <Text
            style={
              this.state.light_theme
                ? [
                    styles.labelLight,
                    {},
                  ]
                : [
                    styles.label,
                    {},
                  ]
            }>
            {this.state.current_theme}
          </Text>
          </View>
          </View>
          <View style={styles.buttonView}>
            <TouchableOpacity
              style={styles.regButton}
              onPress={() => {
                this.updateUserDetails();
              }}>
              <Text style={styles.buttonTextReg}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}
 
const styles = StyleSheet.create({
  formContainer: {
    justifyContent: 'center',
  },
  label: {
    fontSize: RFValue(16),
    color: 'white',
    fontWeight: '200',
    padding: RFValue(10),
    marginLeft: RFValue(10),
  },
  labelLight: {
    fontSize: RFValue(16),
    color: 'black',
    fontWeight: '200',
    padding: RFValue(10),
    marginLeft: RFValue(10),
  },
  buttonView: {
    alignItems: 'center',
  },
  conta: {
    flex: 1,
    backgroundColor: 'black',
  },
  contaLight: {
    flex: 1,
    backgroundColor: '#ededed'
  },
  regButton: {
    width: (Dimensions.get('window').width / 10) * 3,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#2088da',
    borderRadius: 7,
    padding: RFValue(5),
    marginTop: RFValue(12.5),
    marginBottom: RFValue(35),
  },
  buttonTextReg: {
    color: 'white',
    fontWeight: '300',
    fontSize: RFValue(20),
  },
  titleTextLight: {
    fontSize: RFValue(24),
    color: 'black',
    fontWeight: '600',
    marginBottom: RFValue(0),
    textAlign: 'center',
    marginTop: RFValue(15),
  },
  titleText: {
    fontSize: RFValue(24),
    color: 'white',
    fontWeight: '600',
    marginBottom: RFValue(0),
    textAlign: 'center',
    marginTop: RFValue(15),
  },
  image: {
    width: RFValue(50),
    height: RFValue(100),
    borderRadius: 10,
    margin: RFValue(15),
    borderWidth: 1
  },
  imageView: {
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center',
    alignSelf: 'center',
  },
  themeViewLight: {
    width: '90%',
    alignContent: 'center',
    alignSelf: 'center',
    marginTop: RFValue(15),
    borderRadius: 10,
    marginBottom: RFValue(15),
    backgroundColor: 'white'
  },
  themeView: {
    width: '90%',
    alignContent: 'center',
    alignSelf: 'center',
    marginTop: RFValue(15),
    borderRadius: 10,
    marginBottom: RFValue(15),
    backgroundColor: '#333333'
  }
});
 

