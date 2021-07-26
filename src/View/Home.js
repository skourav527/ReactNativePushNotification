import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Alert,
  Button,
  ActivityIndicator,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';

const Home = (props) => {
    const Title = props.navigation.getParam('Title','');
    const Body = props.navigation.getParam('Body','');

    return(
        <view style={styles.container} >
        <text style = {styles.text}> Title </text>
        <text style = {styles.text}> Body </text>
        
        </view>
    );
};

const styles = StyleSheet.create({
    container: {
        flex :1,
        backgroundColor: '#568fa6'
    },
    text: {
        flex: 1,
        textAlign: 'left'    
            }
    
});

export default Home;