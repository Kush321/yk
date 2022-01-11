import React, { Component } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  TouchableHighlight,
  Alert,
  SafeAreaView,
  Platform,
  Modal,
  Dimensions,
  Image,
  TextInput,
} from 'react-native';
import db from '../config';
import firebase from 'firebase';
import { RFValue } from 'react-native-responsive-fontsize';
import { SearchBar, ListItem, Input } from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Header, Icon, Badge } from 'react-native-elements';

export default class BookRequestScreen extends Component {
  constructor() {
    super();
    this.state = {
      userId: firebase.auth().currentUser.email,
      friendId: '',
      requestedBookName: '',
      bookStatus: '',
      requestId: '',
      docId: '',
      dataSource: '',
      requestedImageLink: '',
      isModalVisible: 'false',
      sentRequestsList: [],
    };
  }

  createUniqueId() {
    return Math.random().toString(36).substring(2);
  }

  addRequest = async (personUsername, randomDocId) => {
    db.collection('sentRequests').doc(randomDocId).set({
      user_id: this.state.userId,
      friendToFind: personUsername,
      request_id: randomDocId,
      status: 'requested',
      date: firebase.firestore.FieldValue.serverTimestamp(),
    });
    return Alert.alert('Requested Sent Successfully');
  };

  getSentRequests = () => {
    this.requestRef = db
      .collection('sentRequests')
      .where('user_id', '==', this.state.userId)
      .onSnapshot((snapshot) => {
        var sentRequestsList = snapshot.docs.map((doc) => doc.data());
        this.setState({
          sentRequestsList: sentRequestsList,
        });
      });
  };

  sendNotification = () => {
    //to get the first name and last name
    db.collection('users')
      .where('email_id', '==', this.state.userId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          var name = doc.data().first_name;
          var lastName = doc.data().last_name;

          // to get the donor id and book name
          db.collection('all_notifications')
            .where('request_id', '==', this.state.requestId)
            .get()
            .then((snapshot) => {
              snapshot.forEach((doc) => {
                var donorId = doc.data().donor_id;
                var friendId = doc.data().friendToFind;

                //targert user id is the donor id to send notification to the user
                db.collection('all_notifications').add({
                  targeted_user_id: donorId,
                  message:
                    name + ' ' + lastName + ' received the book ' + friendId,
                  notification_status: 'unread',
                  friendToFind: friendId,
                });
              });
            });
        });
      });
  };

  componentDidMount() {
    this.getSentRequests();
  }

  terminateRequest = (randomDocId) => {
    db.collection('sentRequests')
      .doc(randomDocId)
      .delete()
      .then(() => {
      })
      .catch((error) => {
        console.error('Error removing document: ', error);
      });
  };

  keyExtractor = (item, index) => index.toString();

  renderItem = ({ item, i }) => {
    return (
      <ListItem
        key={i}
        title={item.friendToFind}
        titleStyle={{ color: 'black', fontSize: RFValue(12) }}
        leftElement={<Text></Text>}
        rightElement={
          <TouchableOpacity
            style={styles.terminateRequestButton}
            onPress={() => {
              this.terminateRequest(item.request_id);
            }}>
            <Text style={styles.terminateRequestText}>Cancel Request</Text>
          </TouchableOpacity>
        }
        bottomDivider
      />
    );
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
            <View style={{ flex: 1 }}>
              <Text style={styles.titleText}>Find Friends</Text>
              <View style={{ flex: 0.9 }}>
                <TextInput
                  style={styles.formTextInput}
                  placeholder={'Friend ID'}
                  onChangeText={(text) => {
                    this.setState({
                      friendId: text,
                    });
                  }}
                />
                <View
                  style={{
                    flex: 0.2,
                    alignItems: 'center',
                    marginTop: RFValue(-25),
                  }}>
                  <TouchableOpacity
                    style={styles.regButton}
                    onPress={() =>
                      this.addRequest(
                        this.state.friendId,
                        this.createUniqueId()
                      )
                    }>
                    <Text style={styles.buttonTextReg}>Send Request</Text>
                  </TouchableOpacity>
                </View>
                <Text
                  style={{
                    marginTop: RFValue(15),
                    textAlign: 'center',
                    color: 'blue',
                  }}
                  onPress={() => {
                    this.setState({ isModalVisible: false });
                  }}>
                  Done
                </Text>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    );
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Header
          leftComponent={
            <Icon
              name="menu-outline"
              type="ionicon"
              color="#d6d6d6"
              onPress={() => this.props.navigation.toggleDrawer()}
            />
          }
          centerComponent={
            <Icon
              name="logo-apple"
              type="ionicon"
              color="#d6d6d6"
              onPress={() => this.props.navigation.navigate('Home')}
            />
          }
          rightComponent={
            <Icon
              name="person-add-outline"
              type="ionicon"
              color="#d6d6d6"
              onPress={() => this.setState({ isModalVisible: true })}
            />
          }
          backgroundColor="#333333"
        />
        {this.showModal()}
        {this.state.sentRequestsList.length === 0 ? (
          <View style={styles.subContainer}>
            <Text style={{ fontSize: 20 }}>You have sent no requests</Text>
          </View>
        ) : (
          <View>
            <Text style={styles.titleText}>Your sent requests</Text>
            <FlatList
              keyExtractor={this.keyExtractor}
              data={this.state.sentRequestsList}
              renderItem={this.renderItem}
            />
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  terminateRequestButton: {
    backgroundColor: '#333333',
    height: '130%',
    borderRadius: 10,
    width: '35%',
    paddingTop: RFValue(5),
  },
  terminateRequestText: {
    color: 'white',
    //marginTop: RFValue(5),
    textAlign: 'center',
  },
  titleText: {
    fontSize: RFValue(20),
    color: 'black',
    fontWeight: '600',
    marginBottom: RFValue(20),
    marginTop: RFValue(10),
    textAlign: 'center',
  },
  subContainer: {
    flex: 1,
    fontSize: 20,
    justifyContent: 'center',
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
  conta: {
    flex: 1,
  },
  scrollviewLight: {
    flex: 1,
    paddingTop: RFValue(15),
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    borderColor: 'black',
    borderWidth: RFValue(2),
    backgroundColor: '#ededed',
  },
  buttonTextReg: {
    color: 'white',
    fontWeight: '300',
    fontSize: RFValue(18),
  },
  regButton: {
    width: (Dimensions.get('window').width / 10) * 4,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#2088da',
    borderRadius: 7,
    marginTop: RFValue(30),
    padding: RFValue(5),
  },
});
