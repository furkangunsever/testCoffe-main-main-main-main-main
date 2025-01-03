import React, {useState, useEffect} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  TouchableOpacity,
  Image,
  StyleSheet,
  BackHandler,
  Alert,
  View,
  Text,
} from 'react-native';
import {
  useFocusEffect,
  useNavigation,
  CommonActions,
} from '@react-navigation/native';
import AdminEkle from './AdminEkle';
import Adminler from './Adminler';
import QRScanner from './QRScanner';
import SuperAdminHome from './SuperAdminHome';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import {signOut} from '../../config/firebase';
import {cıkıs_icon, home_icon, profile_icon, qr_icon} from '../../assets/icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Tab = createBottomTabNavigator();

const SuperAdmin = () => {
  const [cafeName, setCafeName] = useState(null);
  const navigation = useNavigation();

  // Süper adminin cafe name'ini al
  useEffect(() => {
    const getCurrentUserCafeName = async () => {
      try {
        const currentUser = auth().currentUser;
        if (!currentUser) {
          console.log('Kullanıcı oturumu bulunamadı');
          return;
        }

        const snapshot = await database()
          .ref(`users/${currentUser.uid}`)
          .once('value');

        const userData = snapshot.val();
        if (userData?.cafename) {
          setCafeName(userData.cafename);
        } else {
          console.log('Cafe name bulunamadı');
        }
      } catch (error) {
        console.error('Cafe name alınırken hata:', error);
      }
    };

    getCurrentUserCafeName();
  }, []);

  // AdminEkle component'ini cafeName ile sarmalayalım
  const AdminEkleWithCafeName = () => <AdminEkle cafeName={cafeName} />;

  // Geri tuşunu engelle
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        return true; // true döndürerek geri tuşunu engelliyoruz
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, []),
  );

  const handleLogout = () => {
    Alert.alert(
      'Çıkış',
      'Çıkış yapmak istediğinize emin misiniz?',
      [
        {
          text: 'Hayır',
          style: 'cancel',
        },
        {
          text: 'Evet',
          onPress: async () => {
            try {
              // AsyncStorage'dan tüm verileri temizle
              await AsyncStorage.clear();

              // Firebase oturumunu kapat
              await auth().signOut();

              // Navigation'ı sıfırla
              navigation.reset({
                index: 0,
                routes: [{name: 'Login'}],
              });
            } catch (error) {
              console.error('Çıkış hatası:', error);
              Alert.alert('Hata', 'Çıkış yapılırken bir hata oluştu');
            }
          },
        },
      ],
      {cancelable: false},
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Super Admin Panel</Text>
        <TouchableOpacity
          onPress={handleLogout}
          style={styles.logoutButton}
          activeOpacity={0.7}>
          <Image source={cıkıs_icon} style={styles.logoutIcon} />
        </TouchableOpacity>
      </View>

      <Tab.Navigator
        screenOptions={{
          tabBarStyle: {
            backgroundColor: '#FFF',
            borderTopWidth: 1,
            borderTopColor: '#F0F0F0',
            height: 60,
          },
          tabBarActiveTintColor: '#4A3428',
          tabBarInactiveTintColor: '#999',
          headerShown: false,
        }}>
        <Tab.Screen
          name="Ana Sayfa"
          component={SuperAdminHome}
          options={{
            tabBarIcon: ({focused}) => (
              <Image
                source={home_icon}
                style={{
                  width: 24,
                  height: 24,
                  tintColor: focused ? '#4A3428' : '#999',
                }}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Admin Ekle"
          component={AdminEkleWithCafeName}
          options={{
            tabBarIcon: ({focused}) => (
              <Image
                source={profile_icon}
                style={{
                  width: 24,
                  height: 24,
                  tintColor: focused ? '#4A3428' : '#999',
                }}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Adminler"
          component={Adminler}
          options={{
            tabBarIcon: ({focused}) => (
              <Image
                source={profile_icon}
                style={{
                  width: 24,
                  height: 24,
                  tintColor: focused ? '#4A3428' : '#999',
                }}
              />
            ),
          }}
        />
        <Tab.Screen
          name="QR Tara"
          component={QRScanner}
          options={{
            tabBarIcon: ({focused}) => (
              <Image
                source={qr_icon}
                style={{
                  width: 24,
                  height: 24,
                  tintColor: focused ? '#4A3428' : '#999',
                }}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    height: 60,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4A3428',
  },
  logoutButton: {
    padding: 10,
    marginLeft: 10,
  },
  logoutIcon: {
    width: 24,
    height: 24,
    tintColor: '#4A3428',
  },
});

export default SuperAdmin;
