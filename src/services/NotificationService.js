import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Platform, PermissionsAndroid} from 'react-native';
import auth from '@react-native-firebase/auth';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';

class NotificationService {
  constructor() {
    this.messageListener = null;
    this.createDefaultChannels();
  }

  createDefaultChannels() {
    PushNotification.createChannel(
      {
        channelId: 'default-channel',
        channelName: 'Default Channel',
        channelDescription: 'Default notification channel',
        soundName: 'default',
        importance: 4,
        vibrate: true,
      },
      created => console.log(`Channel created: ${created}`),
    );
  }

  async showNotification(notification) {
    try {
      const userId = auth().currentUser?.uid;
      if (!userId) return;

      const settings = await AsyncStorage.getItem(
        `notificationSettings_${userId}`,
      );
      if (settings) {
        const parsedSettings = JSON.parse(settings);
        if (!parsedSettings.push) {
          console.log('Push bildirimleri devre dışı');
          return;
        }
      }

      PushNotification.localNotification({
        channelId: 'default-channel',
        title: notification.title,
        message: notification.body,
        playSound: true,
        soundName: 'default',
        importance: 'high',
        priority: 'high',
        vibrate: true,
      });
    } catch (error) {
      console.error('Bildirim gösterilirken hata:', error);
    }
  }

  async requestPermission() {
    try {
      if (Platform.OS === 'ios') {
        const authStatus = await messaging().requestPermission();
        return (
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL
        );
      } else if (Platform.OS === 'android') {
        if (Platform.Version >= 33) {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          );
          return granted === PermissionsAndroid.RESULTS.GRANTED;
        }
        return true;
      }
    } catch (error) {
      console.error('Bildirim izni alınırken hata:', error);
      return false;
    }
  }

  async registerDevice() {
    try {
      const userId = auth().currentUser?.uid;
      if (!userId) return false;

      const hasPermission = await this.requestPermission();
      if (!hasPermission) {
        return false;
      }

      const fcmToken = await messaging().getToken();
      if (fcmToken) {
        await AsyncStorage.setItem('fcmToken', fcmToken);
        console.log('============ FCM TOKEN ============');
        console.log(fcmToken);
        console.log('==================================');
      }

      const settings = await AsyncStorage.getItem(
        `notificationSettings_${userId}`,
      );
      if (settings) {
        const parsedSettings = JSON.parse(settings);
        if (!parsedSettings.push) {
          if (this.messageListener) {
            this.messageListener();
            this.messageListener = null;
          }
          console.log('Push bildirimleri devre dışı - cihaz kaydedilmedi');
          return false;
        }
      }

      await messaging().requestPermission();

      if (this.messageListener) {
        this.messageListener();
      }

      this.messageListener = messaging().onMessage(async remoteMessage => {
        console.log('Ön planda bildirim alındı:', remoteMessage);
        if (remoteMessage.notification) {
          this.showNotification(remoteMessage.notification);
        }
      });

      messaging().setBackgroundMessageHandler(async remoteMessage => {
        console.log('Arka planda mesaj alındı:', remoteMessage);
        if (remoteMessage.notification) {
          this.showNotification(remoteMessage.notification);
        }
      });

      messaging()
        .getInitialNotification()
        .then(remoteMessage => {
          if (remoteMessage) {
            console.log(
              'Uygulama kapalıyken bildirime tıklandı:',
              remoteMessage,
            );
          }
        });

      messaging().onNotificationOpenedApp(remoteMessage => {
        console.log('Arka planda bildirime tıklandı:', remoteMessage);
      });

      console.log('Cihaz başarıyla kaydedildi ve bildirimler aktif');
      return true;
    } catch (error) {
      console.error('Cihaz kaydedilirken hata:', error);
      return false;
    }
  }

  async unregisterDevice() {
    try {
      if (this.messageListener) {
        this.messageListener();
        this.messageListener = null;
      }

      await messaging().deleteToken();
      await AsyncStorage.removeItem('fcmToken');
      return true;
    } catch (error) {
      console.error('Cihaz kaydı silinirken hata:', error);
      return false;
    }
  }

  async checkNotificationSettings() {
    try {
      const userId = auth().currentUser?.uid;
      if (!userId) return null;

      const settings = await AsyncStorage.getItem(
        `notificationSettings_${userId}`,
      );
      return settings ? JSON.parse(settings) : null;
    } catch (error) {
      console.error('Bildirim ayarları kontrol edilirken hata:', error);
      return null;
    }
  }

  async initialize() {
    try {
      const hasPermission = await this.requestPermission();
      if (!hasPermission) {
        console.log('Bildirim izni reddedildi');
        return false;
      }

      await this.registerDevice();

      messaging().setBackgroundMessageHandler(async remoteMessage => {
        console.log('Arka planda mesaj alındı:', remoteMessage);
      });

      messaging()
        .getInitialNotification()
        .then(remoteMessage => {
          if (remoteMessage) {
            console.log(
              'Uygulama kapalıyken bildirime tıklandı:',
              remoteMessage,
            );
          }
        });

      messaging().onNotificationOpenedApp(remoteMessage => {
        console.log('Arka planda bildirime tıklandı:', remoteMessage);
      });

      return true;
    } catch (error) {
      console.error('Bildirim servisi başlatılırken hata:', error);
      return false;
    }
  }
}

export default new NotificationService();
