import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  StyleSheet,
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

var month;
var day;
var year;
var bday;
var areacode;
var centerdigits;
var lastfour;
var pnumber;

export default class AccountSettings extends Component {
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
      <View style={styles.conta}>
        <SpecialHeader page="Account" navigation={this.props.navigation} />
        <View
          style={
            this.state.light_theme
              ? styles.formContainerLight
              : styles.formContainer
          }>
          <Text
            style={
              this.state.light_theme ? styles.titleTextLight : styles.titleText
            }>
            Account
          </Text>
          <Text
            style={this.state.light_theme ? styles.labelLight : styles.label}>
            First Name{' '}
          </Text>
          <TextInput
            style={
              this.state.light_theme
                ? styles.formTextInputLight
                : styles.formTextInput
            }
            placeholder={'First '}
            maxLength={12}
            onChangeText={(text) => {
              this.setState({
                firstName: text,
              });
            }}
            value={this.state.firstName}
          />
          <Text
            style={this.state.light_theme ? styles.labelLight : styles.label}>
            Last Name{' '}
          </Text>
          <TextInput
            style={
              this.state.light_theme
                ? styles.formTextInputLight
                : styles.formTextInput
            }
            placeholder={'Last Name'}
            maxLength={12}
            onChangeText={(text) => {
              this.setState({
                lastName: text,
              });
            }}
            value={this.state.lastName}
          />
          <Text
            style={this.state.light_theme ? styles.labelLight : styles.label}>
            Birthday{' '}
          </Text>
          <TextInput
            style={
              this.state.light_theme
                ? styles.formTextInputLight
                : styles.formTextInput
            }
            placeholder={'mmddyyyy'}
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
          <Text
            style={this.state.light_theme ? styles.labelLight : styles.label}>
            Phone Number{' '}
          </Text>
          <TextInput
            style={
              this.state.light_theme
                ? styles.formTextInputLight
                : styles.formTextInput
            }
            placeholder={'Phone Number'}
            maxLength={10}
            keyboardType={'numeric'}
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
          <Text
            style={this.state.light_theme ? styles.labelLight : styles.label}>
            Address{' '}
          </Text>
          <TextInput
            style={
              this.state.light_theme
                ? styles.formTextInputLight
                : styles.formTextInput
            }
            placeholder={'Address'}
            onChangeText={(text) => {
              this.setState({
                address: text,
              });
            }}
            value={this.state.address}
          />
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
    backgroundColor: 'black',
    flex: 1,
  },
  formContainerLight: {
    justifyContent: 'center',
    backgroundColor: '#ededed',
    flex: 1,
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
  formTextInput: {
    width: '90%',
    height: RFValue(40),
    padding: RFValue(10),
    borderWidth: 1,
    borderRadius: 7,
    borderColor: 'white',
    backgroundColor: '#333333',
    paddingBottom: RFValue(10),
    paddingLeft: RFValue(10),
    alignSelf: 'center',
    marginBottom: RFValue(10),
    color: 'white',
  },
  formTextInputLight: {
    width: '90%',
    height: RFValue(40),
    padding: RFValue(10),
    borderWidth: 1,
    borderRadius: 7,
    borderColor: 'black',
    backgroundColor: 'white',
    paddingBottom: RFValue(10),
    paddingLeft: RFValue(10),
    alignSelf: 'center',
    marginBottom: RFValue(10),
    color: '#333333',
  },
  conta: {
    flex: 1,
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
    //marginBottom: RFValue(0),
    textAlign: 'center',
    marginTop: RFValue(-30),
  },
  titleText: {
    fontSize: RFValue(24),
    color: 'white',
    fontWeight: '600',
    //marginBottom: RFValue(0),
    textAlign: 'center',
    marginTop: RFValue(-30),
  },
});
