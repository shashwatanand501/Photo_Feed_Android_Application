import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {createStackNavigator,createBottomTabNavigator} from 'react-navigation';
import {f,auth,database,storage} from  './config/config.js';

import { YellowBox } from 'react-native';
import feed from './app/screens/feed.js';
import upload from './app/screens/upload.js';
import profile from './app/screens/profile.js';
import userProfile from './app/screens/userProfile.js';
import comments from './app/screens/comments.js';

const TabStack = createBottomTabNavigator(
  {
    Feed : {screen : feed },
    Upload: {screen : upload },
    Profile: {screen : profile }
  }
)
const MainStack = createStackNavigator(
  {
    Home: { screen: TabStack },
    User: { screen: userProfile},
    Comments: { screen : comments}
  },
  {
    initalRouteName: 'Home',
    mode:'modal',
    headerMode:'none',
  }
)

export default class App extends React.Component{



construct() {
    YellowBox.ignoreWarnings(['Setting a timer']);
    console.ignoredYellowBox = ['Setting a timer'];
}
 
  constructor(props){
    super(props);
  }
  render(){
    return (
       <MainStack/>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
