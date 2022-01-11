import React, { Component } from 'react';
import { Header, Icon, Badge } from 'react-native-elements';
import { View, Text, StyleSheet, Alert } from 'react-native';
import db from '../config';
import firebase from 'firebase';
import { RFValue } from 'react-native-responsive-fontsize';

export default class SpecialHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: firebase.auth().currentUser.email,
      value: '',
    };
  }

  render() {
    return (
      <Header
        leftComponent={
          <Icon
            name="arrow-back-outline"
            type="ionicon"
            color="#d6d6d6"
            onPress={() => this.props.navigation.navigate('Home')}
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
          <Text style={styles.headerText}>{this.props.page}</Text>
        }
        backgroundColor="#333333"
      />
    );
  }
}

const styles = StyleSheet.create({
  headerText: {
    color: "#d6d6d6",
    fontSize: RFValue(10.5)
  },
});
