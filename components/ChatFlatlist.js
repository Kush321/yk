import React, { Component } from 'react';
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import { ListItem, Icon } from 'react-native-elements';
import { RFValue } from 'react-native-responsive-fontsize';
import { SwipeListView } from 'react-native-swipe-list-view';
import db from '../config';
import firebase from 'firebase';

export default class SwipeableFlatlist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: firebase.auth().currentUser.email,
      allChats: this.props.chats,
    };
  }

  updateList=()=>{

  }
  /*removeFriend = (friend) => {
    db.collection('users')
      .doc(this.state.userId)
      .update({
        friends: firebase.firestore.FieldValue.arrayRemove(friend),
      });
  };*/

  componentDidMount(){
    this.updateList();
  }

  onSwipeValueChange = (swipeData) => {
    var allChats = this.state.allChats;
    const { key, value } = swipeData;
    console.log(key)
    if (value < -Dimensions.get('window').width) {
      const newData = [...allChats];
      //this.removeFriend('fhgmgmf');
      newData.splice(key, 1);
      //this.setState({ allChats: newData });
    }
  };

  renderItem = (data) => (
    <Animated.View>
      <ListItem
        leftElement={<Text>avatar</Text>}
        title={data.item + ''}
        titleStyle={{ color: 'black', fontSize: RFValue(12) }}
        bottomDivider
      />
    </Animated.View>
  );

  renderHiddenItem = () => (
    <View style={styles.rowBack}>
      <View style={[styles.backRightBtn, styles.backRightBtnRight]}>
        <Text style={styles.backTextWhite}>Remove</Text>
      </View>
    </View>
  );

  render() {
    return (
      <View style={styles.container}>
        <SwipeListView
          disableRightSwipe
          data={this.state.allChats}
          renderItem={this.renderItem}
          renderHiddenItem={this.renderHiddenItem}
          rightOpenValue={-Dimensions.get('window').width}
          onSwipeValueChange={this.onSwipeValueChange}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  backTextWhite: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 15,
    textAlign: 'center',
    alignSelf: 'flex-start',
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#29b6f6',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
  },
  backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 100,
  },
  backRightBtnRight: {
    backgroundColor: '#29b6f6',
    right: 0,
  },
});
