import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

// Background message handler'ı dışarıda tanımlayın
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});

class NotificationService {
  async requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
      const token = await this.getFCMToken();
      console.log('FCM Token:', token);
      return token;
    }
  }

  async getFCMToken() {
    try {
      let fcmToken = await AsyncStorage.getItem('fcmToken');

      if (!fcmToken) {
        fcmToken = await messaging().getToken();
        if (fcmToken) {
          console.log('New FCM Token:', fcmToken);
          await AsyncStorage.setItem('fcmToken', fcmToken);
          await this.updateTokenToServer(fcmToken);
        }
      } else {
        console.log('Existing FCM Token:', fcmToken);
      }

      // Token yenileme dinleyicisi
      messaging().onTokenRefresh(async newToken => {
        console.log('New token refresh:', newToken);
        await AsyncStorage.setItem('fcmToken', newToken);
        await this.updateTokenToServer(newToken);
      });

      return fcmToken;
    } catch (error) {
      console.error('FCM Token Error:', error);
      return null;
    }
  }

  async updateTokenToServer(token) {
    const userId = auth().currentUser?.uid;
    if (userId) {
      try {
        await database().ref(`users/${userId}/fcmToken`).set(token);
        console.log('Token updated to server for user:', userId);
      } catch (error) {
        console.error('Error updating token to server:', error);
      }
    }
  }

  async onNotificationOpenedApp() {
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('Background state:', remoteMessage.data);
      // Bildirime tıklandığında yapılacak işlemler
    });

    // Uygulama kapalıyken bildirime tıklanırsa
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log('Quit state:', remoteMessage.data);
        }
      });
  }

  async setupForegroundHandler() {
    messaging().onMessage(async remoteMessage => {
      console.log('Foreground Message:', remoteMessage);
      // Burada özel bildirim gösterimi yapabilirsiniz
    });
  }

  // Background handler'ı initialize eden metod
  async setupBackgroundHandler() {
    // Background message handler
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
      // Burada background işlemleri yapabilirsiniz
    });
  }

  // Tüm notification ayarlarını başlatan metod
  async initialize() {
    await this.requestUserPermission();
    await this.setupForegroundHandler();
    await this.setupBackgroundHandler();
    await this.onNotificationOpenedApp();
  }
}

export default new NotificationService();
