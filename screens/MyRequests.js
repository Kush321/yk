import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { ListItem } from 'react-native-elements';
import firebase from 'firebase';
import db from '../config';
import MyHeader from '../components/MyHeader';
import { RFValue } from 'react-native-responsive-fontsize';

export default class MyRequests extends Component {
  constructor() {
    super();
    this.state = {
      userId: firebase.auth().currentUser.email,
      filteredList: [],
    };
    this.requestRef = null;
  }

  getFilteredList = () => {
    this.requestRef = db
      .collection('sentRequests')
      .where('friendToFind', '==', this.state.userId)
      .onSnapshot((snapshot) => {
        var filteredList = snapshot.docs.map((doc) => doc.data());
        this.setState({
          filteredList: filteredList,
        });
      });
  };

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

  acceptRequest = (randomDocId, senderUsername) => {
    db.collection('users')
      .doc(this.state.userId)
      .update({
        friends: firebase.firestore.FieldValue.arrayUnion(senderUsername),
      });
    db.collection('users')
      .doc(senderUsername)
      .update({
        friends: firebase.firestore.FieldValue.arrayUnion(this.state.userId),
      });
    db.collection('sentRequests')
      .doc(randomDocId)
      .delete()
      .then(() => {
      })
      .catch((error) => {
        console.error('Error removing document: ', error);
      });
  };

  componentDidMount() {
    this.getFilteredList();
  }

  componentWillUnmount() {
    this.requestRef();
  }

  keyExtractor = (item, index) => index.toString();

  renderItem = ({ item, i }) => {
    return (
      <ListItem
        key={i}
        title={item.user_id}
        titleStyle={{ color: 'black', fontSize: RFValue(12) }}
        leftElement={<Text></Text>}
        rightElement={
          <View style={styles.terminateRequestView}>
            <TouchableOpacity
              style={styles.terminateRequestButton}
              onPress={() => {
                this.acceptRequest(item.request_id, item.user_id)
              }}>
              <Text style={styles.terminateRequestText}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.terminateRequestButton}
              onPress={() => {
                this.terminateRequest(item.request_id);
              }}>
              <Text style={styles.terminateRequestText}>Reject</Text>
            </TouchableOpacity>
          </View>
        }
        bottomDivider
      />
    );
  };

  render() {
    return (
      <View style={styles.view}>
        <MyHeader title="DB" navigation={this.props.navigation} />
        <View style={{ flex: 1 }}>
          {this.state.filteredList.length === 0 ? (
            <View style={styles.subContainer}>
              <Text style={{ fontSize: 20 }}>You have no friend requests</Text>
            </View>
          ) : (
            <FlatList
              keyExtractor={this.keyExtractor}
              data={this.state.filteredList}
              renderItem={this.renderItem}
            />
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  subContainer: {
    flex: 1,
    fontSize: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  view: {
    flex: 1,
    backgroundColor: '#fff',
  },
  terminateRequestView: {
    backgroundColor: '#333333',
    height: '130%',
    borderRadius: 10,
    width: '35%',
    paddingTop: RFValue(2),
    flexDirection: 'row',
  },
  terminateRequestButton: {
    width: '50%',
  },
  terminateRequestText: {
    color: 'white',
    marginTop: RFValue(5),
    textAlign: 'center',
  },
});
