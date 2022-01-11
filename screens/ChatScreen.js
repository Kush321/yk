import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  Button,
  Image,
} from 'react-native';
import { ListItem } from 'react-native-elements';
import firebase from 'firebase';
import db from '../config';
import MyHeader from '../components/MyHeader';
import { RFValue } from 'react-native-responsive-fontsize';
import { Icon } from 'react-native-elements';
import ChatFlatlist from '../components/ChatFlatlist';

export default class ChatScreen extends Component {
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
      .collection('users')
      .where('email_id', '==', this.state.userId)
      .onSnapshot((snapshot) => {
        var mainFilteredList = ['Chats'];
        var i = 0;
        var f = 2;
        while (this.state.filteredList[i] != '') {
          mainFilteredList.push(
            snapshot.docs.map((doc) => doc.data().friends[i])
          );
          this.setState({
            filteredList: mainFilteredList,
          });
          i = i + 1;
        }
        this.state.filteredList.pop();
        this.state.filteredList.shift();
      });
  };

  removeFriend = (friend) => {
    db.collection('users')
      .doc(this.state.userId)
      .update({
        friends: firebase.firestore.FieldValue.arrayRemove(friend),
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
        title={item + ''}
        titleStyle={{ color: 'black', fontSize: RFValue(12) }}
        leftElement={<Text></Text>}
        rightElement={
          <Icon name="chevron-forward-outline" type="ionicon" color="black" />
        }
        bottomDivider
        onPress={() => {
          this.props.navigation.navigate('Chat');
        }}
      />
    );
  };

  render() {
    return (
      <View style={styles.view}>
        <MyHeader navigation={this.props.navigation} />
        <View style={{ flex: 1 }}>
          {this.state.filteredList.length === 0 ? (
            <View style={styles.subContainer}>
              <Text style={{ fontSize: 20 }}>No friends found</Text>
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

//<ChatFlatlist chats={this.state.filteredList} />

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
});
