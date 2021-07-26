import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Alert,
  Button,
  ActivityIndicator,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {createAppContainer,NavigationActions} from 'react-navigation';
import {
  NavigationParams,
  NavigationScreenProp,
  NavigationState,
} from 'react-navigation';
//import { NavigationScreenProps, NavigationStackScreenOptions } from '@react-navigation/native'
//import { NavigationScreenProp } from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import { NavigationContainer } from '@react-navigation/native';
//import Navigation from './src/services/Navigation';
import Config from './src/config/AppConfig'
import Home  from './src/View/Home';
import DemoNotificationService from './src/services/DemoNotificationService';
import DemoNotificationRegistrationService from './src/services/DemoNotificationRegistrationService';
import AppConfig from './src/config/AppConfig';

declare const global: { HermesInternal: null | {} };

interface Props {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}
interface IState {
  status: string,
  registeredOS: string,
  registeredToken: string,
  isRegistered: boolean,
  isBusy: boolean,
}

class App extends Component<Props, IState > {
  state: IState;
  notificationService: DemoNotificationService;
  notificationRegistrationService: DemoNotificationRegistrationService;
  deviceId: string;

  constructor(props: any) {
    super(props);
    this.deviceId = DeviceInfo.getUniqueId();
    this.state = {
      status: "Push notifications registration status is unknown",
      registeredOS: "",
      registeredToken: "",
      isRegistered: false,
      isBusy: false,
    };

    this.notificationService = new DemoNotificationService(
      this.onTokenReceived.bind(this),
      this.onNotificationReceived.bind(this),
      this.onOpenNotification.bind(this),
    );

    this.notificationRegistrationService = new DemoNotificationRegistrationService(
      Config.apiUrl,
      Config.apiKey,
    );
  }

  public static navigationOptions = {
    title: 'Test Screen',
  };

  render () {
    const { navigation } = this.props;
    return (
      <View style={styles.container}>
        {this.state.isBusy &&
          <ActivityIndicator></ActivityIndicator>
        }
        {/* <View style={styles.button}>
          <Button title="Register" onPress={this.onRegisterButtonPress.bind(this)} disabled={this.state.isBusy} />
        </View> */}
        <View style={styles.button}>
          <Button title="Register"  onPress={() => {
            navigation.navigate('Home');
          }}
        />
        </View>
        {/* <View>
        <text style = {styles.text}>InTouch</text>
        </View> */}
        {/* <View style={styles.button}>
          <Button title="Deregister" onPress={this.onDeregisterButtonPress.bind(this)} disabled={this.state.isBusy} />
        </View> */}
        
      </View>
      
    );
  }

  async onRegisterButtonPress() {
    if (!this.state.registeredToken || !this.state.registeredOS) {
      console.log(`In if block token:  ${this.state.registeredToken} OS : ${this.state.registeredOS}` );
      Alert.alert("The push notifications token wasn't received.");
      return;
    }

    let status: string = "Registering...";
    let isRegistered = this.state.isRegistered;
    try {
      console.log(`In try block`);
      this.setState({ isBusy: true, status });
      const pnPlatform = this.state.registeredOS == "ios" ? "apns" : "fcm";
      const pnToken = this.state.registeredToken;
      const request = {
        installationId: this.deviceId,
        Alias: 'skourav',
        platform: pnPlatform,
        pushChannel: pnToken,
        tags: []
      };
      console.log(`API Call`);
      const response = await this.notificationRegistrationService.registerAsync(request);
      console.log(`API Response`);
      status = `Registered for ${this.state.registeredOS} push notifications`;
      isRegistered = true;
    } catch (e) {
      status = `Registration failed: ${e}`;
    }
    finally {
      this.setState({ isBusy: false, status, isRegistered });
    }
  }

  async onDeregisterButtonPress() {
    if (!this.notificationService)
      return;

    let status: string = "Deregistering...";
    let isRegistered = this.state.isRegistered;
    try {
      this.setState({ isBusy: true, status });
      await this.notificationRegistrationService.deregisterAsync(this.deviceId);
      status = "Deregistered from push notifications";
      isRegistered = false;
    } catch (e) {
      status = `Deregistration failed: ${e}`;
    }
    finally {
      this.setState({ isBusy: false, status, isRegistered });
    }
  }

  onTokenReceived(token: any) {
    console.log(`Received a notification token on ${token.os}`);
    console.log(`Received a notification token on ${token.token}`);
    this.setState({ registeredToken: token.token, registeredOS: token.os, status: `The push notifications token has been received.` } , () =>
    console.log(`setState ${this.state.registeredToken}`));

    if (this.state.isRegistered && this.state.registeredToken && this.state.registeredOS) {
      console.log(`onTokenReceived : Received a notification token on ${token.os}`);
      this.onRegisterButtonPress();
    }
  }

  onNotificationReceived(notification: any) {
    console.log(`Received a push notification on ${this.state.registeredOS}`);
    this.setState({ status: `Received a push notification...` });

    if (notification.data.TicketId) {
     // this.props.navigation.navigate('Home')
      Alert.alert("InTouch", `${notification.data.ProblemStatement} received`);
    }
  }

  

  onOpenNotification(notification: any) {
    console.log(`Clicked a push notification on ${this.state.registeredOS}`);
    this.setState({ status: `Received a push notification...` });

    if (notification.data.TicketId) {
     // Navigation.navigate('HomeRT',{'Title': notification.data.TicketId, 'Body': notification.data.ProblemStatement})
      Alert.alert("InTouch", `${notification.data.ProblemStatement} received`);
    }
  }
  };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: 'flex-end',
    margin: 0,
    backgroundColor: '#00008B'
    
  },
  button: {
    margin: 5,
    width: "100%",
  },
  text:{
    flex: 1,
        textAlign: 'left'
  }
  
});

export default App ;
