import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  Modal,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  SafeAreaView,
  ImageBackground,
  Dimensions,
  Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import db from '../config';
import firebase from 'firebase';
import { Icon } from 'react-native-elements';
import { RFValue } from 'react-native-responsive-fontsize';

import { Input } from 'react-native-elements';

var opa = 1;
var apo = 0;
var rad = 7;
var month;
var day;
var year;
var bday;
var areacode;
var centerdigits;
var lastfour;
var pnumber;

export default class LoginScreen extends Component {
  constructor() {
    super();
    this.state = {
      emailId: '',
      password: '',
      firstName: '',
      lastName: '',
      address: '',
      phnum: '',
      current_theme: 'light',
      confirmPassword: '',
      isModalVisible: 'false',
      isEmailEntered: 'false',
      birthday: '',
    };
  }

  userSignUp = (emailId, password, confirmPassword) => {
    if (password !== confirmPassword) {
      return alert("Password don't match\nCheck your password.");
    } else {
      firebase
        .auth()
        .createUserWithEmailAndPassword(emailId, password)
        .then(() => {
          db.collection('users').doc(this.state.emailId).set({
            first_name: this.state.firstName,
            last_name: this.state.lastName,
            phnum: this.state.phnum,
            email_id: this.state.emailId,
            address: this.state.address,
            current_theme: this.state.current_theme,
            birthday: this.state.birthday,
            friends: [],
          });
          return alert('User Added Successfully', '', [
            {
              text: 'OK',
              onPress: () => this.setState({ isModalVisible: false }),
            },
          ]);
        })
        .catch((error) => {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          return alert(errorMessage);
        });
    }
  };

  userLogin = (emailId, password) => {
    firebase
      .auth()
      .signInWithEmailAndPassword(emailId, password)
      .then(() => {
        this.props.navigation.navigate('Chats');
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        return alert(errorMessage);
      });
  };

  showModal = () => {
    return (
      <Modal
        transparent={false}
        animationType="slide"
        visible={this.state.isModalVisible}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.conta}>
          <SafeAreaView />
          <ScrollView style={styles.scrollviewLight}>
            <View style={styles.signupView}>
              <Ionicons
                transparent={true}
                visible={false}
                name={'logo-apple'}
                size={RFValue(50)}
                style={{ alignSelf: 'center', marginBottom: RFValue(10) }}
                color={'black'}
              />
              <Text
                style={[styles.titleTextLight, { marginBottom: RFValue(-5) }]}>
                Create Your Account
              </Text>
              <Text
                style={[styles.buttonTextLight, { marginTop: RFValue(10) }]}
                onPress={() => {
                  this.setState({ isModalVisible: false });
                }}>
                Already have an Account?{' '}
                <Text style={{ color: 'blue' }}>
                  Login here.{' '}
                  <Ionicons
                    transparent={true}
                    visible={false}
                    name={'open-outline'}
                    size={RFValue(15)}
                    style={{ alignSelf: 'center', paddingLeft: RFValue(3) }}
                    color={'blue'}
                  />
                </Text>
              </Text>
            </View>
            <View style={{ flex: 0.95, marginTop: RFValue(15) }}>
              <View
                style={{
                  paddingTop: RFValue(0),
                  paddingBottom: RFValue(20),
                  borderTopWidth: RFValue(2),
                  width: '90%',
                  alignSelf: 'center',
                }}
              />

              <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                <TextInput
                  style={[styles.smallFormInput, { marginRight: '4%' }]}
                  placeholder={'First Name'}
                  maxLength={12}
                  onChangeText={(text) => {
                    this.setState({
                      firstName: text,
                    });
                  }}
                />

                <TextInput
                  style={styles.smallFormInput}
                  placeholder={'Last Name'}
                  maxLength={12}
                  onChangeText={(text) => {
                    this.setState({
                      lastName: text,
                    });
                  }}
                />
              </View>
              <TextInput
                style={styles.formInputLight}
                placeholder={'Phone Number'}
                maxLength={10}
                keyboardType={'number-pad'}
                onChangeText={(text) => {
                  this.setState({
                    phnum: text,
                  });
                  if (text.length == 10) {
                    areacode = text.substr(0, 3);
                    centerdigits = text.substr(3, 3);
                    lastfour = text.substr(6, 4);
                    pnumber = areacode + '-' + centerdigits + '-' + lastfour;
                    this.setState({
                      phnum: pnumber,
                    });
                  } else if (text.length == 11) {
                    this.setState({
                      phnum: '',
                    });
                  }
                }}
                value={this.state.phnum}
              />

              <TextInput
                style={styles.formInputLight}
                placeholder={'Street'}
                //multiline={true}
                onChangeText={(text) => {
                  this.setState({
                    address: text,
                  });
                }}
              />

              <TextInput
                style={styles.formInputLight}
                placeholder={'Email'}
                keyboardType={'email-address'}
                onChangeText={(text) => {
                  this.setState({
                    emailId: text,
                  });
                }}
              />

              <TextInput
                style={styles.formInputLight}
                placeholder={'Birthday (mmddyyyy)'}
                keyboardType={'number-pad'}
                maxLength={8}
                onChangeText={(text) => {
                  this.setState({
                    birthday: text,
                  });
                  if (text.length == 8) {
                    if (text.substr(0, 2) <= 12) {
                      if (text.substr(2, 2) <= 31) {
                        month = text.substr(0, 2);
                        day = text.substr(2, 2);
                        year = text.substr(4, 4);
                        bday = month + '/' + day + '/' + year;
                        this.setState({
                          birthday: bday,
                        });
                      } else {
                        Alert.alert('ERROR', 'Invalid Birthday Day!', [
                          {
                            text: 'OK',
                          },
                        ]);
                      }
                    } else {
                      Alert.alert('ERROR', 'Invalid Birthday Month!', [
                        {
                          text: 'OK',
                        },
                      ]);
                    }
                  } else if (text.length == 9) {
                    this.setState({
                      birthday: '',
                    });
                  }
                }}
                value={this.state.birthday}
              />

              <TextInput
                style={styles.formInputLight}
                placeholder={'Password'}
                secureTextEntry={true}
                onChangeText={(text) => {
                  this.setState({
                    password: text,
                  });
                }}
              />

              <TextInput
                style={[styles.formInputLight, { marginBottom: RFValue(40) }]}
                placeholder={'Confirm Password'}
                secureTextEntry={true}
                onChangeText={(text) => {
                  this.setState({
                    confirmPassword: text,
                  });
                }}
              />
            </View>

            <View
              style={{
                flex: 0.2,
                alignItems: 'center',
                marginTop: RFValue(-25),
              }}>
              <TouchableOpacity
                style={styles.regButton}
                onPress={() =>{
                  this.userSignUp(
                    this.state.emailId,
                    this.state.password,
                    this.state.confirmPassword
                  )
                  this.setState({
                    isModalVisible: false
                  })
                }}>
                <Text style={styles.buttonTextReg}>Register</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    );
  };

  render() {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.conta}>
        <View style={styles.container}>
          <View style={{ marginTop: RFValue(40) }} />
          {this.showModal()}
          <Ionicons
            transparent={true}
            visible={false}
            name={'logo-apple'}
            size={RFValue(50)}
            style={{ alignSelf: 'center', marginBottom: RFValue(10) }}
            color={'black'}
          />
          <View style={styles.textInput}>
            <Text style={styles.titleTextLight}>Sign in to App</Text>
            <View style={{ flexDirection: 'row' }}>
              <TextInput
                style={[
                  styles.loginBoxTop,
                  { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 },
                ]}
                placeholder="Email"
                placeholderTextColor="gray"
                keyboardType="email-address"
                onChangeText={(text) => {
                  this.setState({
                    emailId: text,
                  });
                }}
              />
            </View>
            <View style={{ flexDirection: 'row' }}>
              <TextInput
                style={[styles.loginBoxBottom, { opacity: 1, marginTop: -1 }]}
                secureTextEntry={true}
                placeholder="Password"
                placeholderTextColor="gray"
                onChangeText={(text) => {
                  this.setState({
                    password: text,
                  });
                }}
              />
              <TouchableOpacity
                //disabled={this.state.isEmailEntered}
                style={[styles.go, { opacity: 1 }]}
                onPress={() => {
                  this.userLogin(this.state.emailId, this.state.password);
                }}>
                <Ionicons
                  transparent={true}
                  visible={false}
                  name={'arrow-forward-circle-outline'}
                  size={RFValue(31)}
                  style={{
                    alignSelf: 'center',
                    marginLeft: RFValue(-1),
                    marginTop: RFValue(-3),
                  }}
                  color={'black'}
                />
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity
            style={[styles.buttonLight, { marginTop: RFValue(15) }]}
            onPress={() => this.setState({ isModalVisible: true })}>
            <Text style={[styles.buttonTextLight]}>
              Don’t have an Account?{' '}
              <Text style={{ color: 'blue' }}>
                Create yours now.{' '}
                <Ionicons
                  transparent={true}
                  visible={false}
                  name={'open-outline'}
                  size={RFValue(15)}
                  style={{ alignSelf: 'center', paddingLeft: RFValue(3) }}
                  color={'blue'}
                />
              </Text>
            </Text>
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={[styles.buttonTextLight, { marginTop: RFValue(365) }]}>
              Copyright © 2021 Kush Patel.
            </Text>
            <Text
              style={[styles.buttonTextLight, { textAlignVertical: 'bottom' }]}>
              All rights reserved.
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ededed',
  },
  conta: {
    flex: 1,
  },
  go: {
    width: Dimensions.get('window').width / 12,
    height: Dimensions.get('window').width / 12,
    marginTop: RFValue(4),
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    position: 'absolute',
    right: RFValue(10),
  },
  buttonTextReg: {
    color: 'white',
    fontWeight: '300',
    fontSize: RFValue(20),
  },
  signupView: {
    flex: 0.05,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    //flex: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonLight: {
    width: '100%',
    height: Dimensions.get('window').height / 30,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  regButton: {
    width: (Dimensions.get('window').width / 10) * 3,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#2088da',
    borderRadius: 7,
    padding: RFValue(5),
  },
  buttonTextLight: {
    color: 'black',
    fontWeight: '400',
    fontSize: RFValue(13),
    textAlign: 'center',
  },
  loginBoxTop: {
    width: (Dimensions.get('window').width / 4) * 3,
    height: Dimensions.get('window').height / 20,
    borderWidth: RFValue(1),
    borderColor: 'black',
    fontSize: RFValue(15),
    paddingLeft: RFValue(10),
    borderTopRightRadius: 7,
    borderTopLeftRadius: 7,
    borderBottomRightRadius: 7,
    borderBottomLeftRadius: 7,
    backgroundColor: 'white',
    color: 'black',
    paddingRight: RFValue(45),
  },
  loginBoxBottom: {
    width: (Dimensions.get('window').width / 4) * 3,
    height: Dimensions.get('window').height / 20,
    borderWidth: RFValue(1),
    borderColor: 'black',
    fontSize: RFValue(15),
    paddingLeft: RFValue(10),
    borderBottomRightRadius: 7,
    borderBottomLeftRadius: 7,
    backgroundColor: 'white',
    color: 'black',
    paddingRight: RFValue(45),
  },
  formInputLight: {
    width: '90%',
    height: RFValue(40),
    padding: RFValue(10),
    borderWidth: 1,
    borderRadius: 7,
    borderColor: 'black',
    paddingBottom: RFValue(10),
    paddingLeft: RFValue(10),
    alignSelf: 'center',
    marginBottom: RFValue(14),
  },
  smallFormInput: {
    width: '43%',
    height: RFValue(40),
    padding: RFValue(10),
    borderWidth: 1,
    borderRadius: 7,
    borderColor: 'black',
    paddingBottom: RFValue(10),
    paddingLeft: RFValue(10),
    alignSelf: 'center',
    marginBottom: RFValue(14),
  },
  scrollviewLight: {
    flex: 1,
    paddingTop: RFValue(15),
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    borderColor: 'black',
    borderWidth: RFValue(2),
    backgroundColor: "#ededed"
  },
  titleTextLight: {
    fontSize: RFValue(24),
    color: 'black',
    fontWeight: '600',
    marginBottom: RFValue(20),
  },
});

//ENTER AT LINE 322
/*<TouchableOpacity
  disabled={!this.state.isEmailEntered}
  style={[styles.go, { opacity: opa }]}
  onPress={() => {
    if (this.state.emailId.length > 8) {
      this.setState({
        isEmailEntered: false,
      });
      /*for (var i = 0; i < 20000000; i++) {
                    opa = opa - 0.00000005;
                    apo = apo + 0.00000005;
                  }
                  for (var f = 0; f < 7; f++) {
                    rad = rad - 1;
                  }
                    opa = 0;
                    apo = 1;
                    rad = 0;*/
/* } else {
      alert('Please enter a valid email');
    }
  }}>
  <Ionicons
    transparent={true}
    visible={false}
    name={'arrow-forward-circle-outline'}
    size={RFValue(31)}
    style={{
      alignSelf: 'center',
      marginLeft: RFValue(-1),
      marginTop: RFValue(-3),
    }}
    color={'black'}
  />
</TouchableOpacity>;
*/
