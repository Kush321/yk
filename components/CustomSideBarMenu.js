import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Platform,
} from 'react-native';
import { DrawerItems } from 'react-navigation-drawer';
import { Avatar } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import firebase from 'firebase';
import db from '../config';
import { Icon } from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RFValue } from 'react-native-responsive-fontsize';

export default class CustomSideBarMenu extends Component {
  state = {
    userId: firebase.auth().currentUser.email,
    image: '#',
    name: '',
    docId: '',
    email: '',
    phonenumber: '',
    current_theme: 'light',
    light_theme: true,
  };

  fetchUser = () => {
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
            phnum: data.phnum,
            current_theme: data.current_theme,
            docId: doc.id,
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

  selectPicture = async () => {
    const { cancelled, uri } = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3], //this is aspect of image so that it will give the crop option for square image
      quality: 1, //this is quality parameter
    });
    //33 line and 34 line why are we using here
    //1 more question

    if (!cancelled) {
      this.uploadImage(uri, this.state.userId);
    }
  };

  uploadImage = async (uri, imageName) => {
    var response = await fetch(uri);
    var blob = await response.blob();

    var ref = firebase
      .storage()
      .ref()
      .child('user_profiles/' + imageName);

    return ref.put(blob).then((response) => {
      this.fetchImage(imageName);
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
            address: doc.data().address,
            bday: doc.data().bday,
            phonenumber: doc.data().phnum,
            email: doc.data().email_id,
            docId: doc.id,
            image: doc.data().image,
          });
        });
      });
  }

  componentDidMount() {
    this.fetchImage(this.state.userId);
    this.getUserProfile();
    this.fetchUser();
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={this.state.light_theme ? styles.infoLight : styles.info}>
          <Avatar
            rounded
            source={{
              uri: this.state.image,
            }}
            size={'xlarge'}
            onPress={() => this.selectPicture()}
            showEditButton
          />

          <Text
            style={
              this.state.light_theme
                ? {
                    fontWeight: '400',
                    fontSize: RFValue(20),
                    color: 'black',
                    padding: RFValue(10),
                  }
                : {
                    fontWeight: '400',
                    fontSize: RFValue(20),
                    color: 'white',
                    padding: RFValue(10),
                  }
            }>
            {this.state.name}
          </Text>

          <Text
            style={
              this.state.light_theme
                ? styles.extraInfoTextLight
                : styles.extraInfoText
            }>
            {this.state.email}
          </Text>

          <Text
            style={
              this.state.light_theme
                ? styles.extraInfoTextLight
                : styles.extraInfoText
            }>
            {this.state.phonenumber}
          </Text>
        </View>
        <View
          style={
            this.state.light_theme
              ? {
                  flex: 0.6,
                  backgroundColor: 'white',
                  paddingBottom: RFValue(5),
                }
              : {
                  flex: 0.6,
                  backgroundColor: '#333333',
                  paddingBottom: RFValue(5),
                }
          }>
          <View
          style={
            this.state.light_theme
              ? {
                  width: '80%',
                  borderTopWidth: RFValue(2),
                  alignSelf: 'center',
                  borderColor: 'black',
                }
              : {
                  width: '80%',
                  borderTopWidth: RFValue(2),
                  alignSelf: 'center',
                  borderColor: 'white',
                }
          }
        />
          <DrawerItems {...this.props} />
        </View>
        <View
          style={
            this.state.light_theme
              ? {
                  flex: 0.1,
                  //backgroundColor: '#ededed',
                }
              : {
                  flex: 0.1,
                  backgroundColor: '#333333',
                }
          }>
          <View
            style={
              this.state.light_theme
                ? {
                    width: '80%',
                    borderTopWidth: RFValue(2),
                    alignSelf: 'center',
                    borderColor: 'black',
                  }
                : {
                    width: '80%',
                    borderTopWidth: RFValue(2),
                    alignSelf: 'center',
                    borderColor: 'white',
                  }
            }
          />
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => {
              this.props.navigation.navigate('LoginScreen');
              firebase.auth().signOut();
            }}>
            <Text
              style={{
                fontSize: RFValue(13),
                color: 'red',
              }}>
              Sign out
            </Text>
            <Ionicons
              transparent={true}
              visible={false}
              name={'log-out-outline'}
              size={RFValue(18)}
              style={{
                alignSelf: 'center',
                paddingLeft: RFValue(5),
              }}
              color={'red'}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  logoutButton: {
    alignContent: 'center',
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: RFValue(12),
  },
  extraInfoText: {
    fontWeight: '300',
    fontSize: RFValue(15),
    color: 'white',
    padding: RFValue(2),
    textDecorationLine: 'underline',
  },
  extraInfoTextLight: {
    fontWeight: '300',
    fontSize: RFValue(15),
    color: 'black',
    padding: RFValue(2),
    textDecorationLine: 'underline',
  },
  infoLight: {
    flex: 0.3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingTop: RFValue(50),
    paddingBottom: RFValue(50),
    //borderBottomColor: "black",
    //borderBottomWidth: RFValue(2)
  },
  info: {
    flex: 0.3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333333',
    paddingTop: RFValue(50),
    paddingBottom: RFValue(50),
    //borderBottomColor: 'white',
    //borderBottomWidth: RFValue(2),
  },
});
