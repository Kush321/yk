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
import ChatHeader from '../components/ChatHeader';
import { RFValue } from 'react-native-responsive-fontsize';
import ChatFlatlist from '../components/ChatFlatlist';

export default class Chat extends Component {
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
        var filteredList = snapshot.docs.map((doc) => doc.data());
        this.setState({
          filteredList: filteredList,
        });
      });
  };

  func = () => {
    /*var filledList = []
    for(var i = 0; i < this.state.filteredList.length; i++){
      filledList.push(this.state.filteredList.friends)
    }
    this.setState({
      filledList: filledList
    })*/
  };

  componentDidMount() {
    this.getFilteredList();
    //this.func();
  }

  componentWillUnmount() {
    this.requestRef();
  }

  keyExtractor = (item, index) => index.toString();

  renderItem = ({ item, i }) => {
    return (
      <ListItem
        key={i}
        title={item}
        titleStyle={{ color: 'black', fontSize: RFValue(12) }}
        leftElement={<Text></Text>}
        rightElement={<Text></Text>}
        bottomDivider
      />
    );
  };

  render() {
    return (
      <View style={styles.view}>
        <ChatHeader navigation={this.props.navigation} page="Chat" />
        <TouchableOpacity
          onPress={() => {
            console.log(this.state.filteredList);
            console.log('check');
          }}>
          <Text>hi</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          {this.state.filteredList.length === 0 ? (
            <View style={styles.subContainer}>
              <Text style={{ fontSize: 20 }}>You have no friends</Text>
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
});
