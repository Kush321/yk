import React, { Component} from 'react';
import { Header,Icon,Badge } from 'react-native-elements';
import { View, Text, StyleSheet ,Alert} from 'react-native';
import db from '../config'
import firebase from 'firebase';

export default class MyHeader extends Component{
  constructor(props){
    super(props)
    this.state={
      userId : firebase.auth().currentUser.email,
      value:""
    }
  }

getNumberOfUnreadNotifications(){
  db.collection('all_notifications').where('notification_status','==',"unread").where('targeted_user_id','==',this.state.userId)
  .onSnapshot((snapshot)=>{
    var unreadNotifications = snapshot.docs.map((doc) => doc.data())
    this.setState({
      value: unreadNotifications.length
    })
  })
}

componentDidMount(){
  this.getNumberOfUnreadNotifications()
}


 BellIconWithBadge=()=>{
    return(
      <View>
        <Icon name='notifications-outline' type='ionicon' color='#d6d6d6' size={25}
          onPress={() =>this.props.navigation.navigate('Notification')}/>
         <Badge
          value={this.state.value}
         containerStyle={{ position: 'absolute', top: -10, right: -8 }}/>
      </View>
    )
  }

  render(){
    return(
        <Header
          leftComponent={<Icon name='menu-outline' type='ionicon' color='#d6d6d6'  onPress={() => this.props.navigation.toggleDrawer()}/>}
          centerComponent={<Icon name='logo-apple' type='ionicon' color='#d6d6d6'  onPress={() => this.props.navigation.navigate('Home')}/>}
          rightComponent={<this.BellIconWithBadge {...this.props}/>}
          backgroundColor = "#333333"
        />

)
}

}
