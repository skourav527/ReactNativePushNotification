import PushNotification from 'react-native-push-notification';
import DemoNotificationHandler from './DemoNotificationHandler';

export default class DemoNotificationService {
  constructor(onTokenReceived: any, onNotificationReceived: any,onOpenNotification: any) {
    DemoNotificationHandler.attachTokenReceived(onTokenReceived);
    DemoNotificationHandler.attachNotificationReceived(onNotificationReceived);
    DemoNotificationHandler.attachNotificationClicked(onOpenNotification);
    PushNotification.getApplicationIconBadgeNumber(function(number: number) {
      if(number > 0) {
        PushNotification.setApplicationIconBadgeNumber(0);
      }
    });
  }

  checkPermissions(cbk: any) {
    return PushNotification.checkPermissions(cbk);
  }

  requestPermissions() {
    return PushNotification.requestPermissions();
  }

//   cancelNotifications() {
//     PushNotification.cancelLocalNotifications();
//   }

  cancelAll() {
    PushNotification.cancelAllLocalNotifications();
  }

  abandonPermissions() {
    PushNotification.abandonPermissions();
  }
}
