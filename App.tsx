import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Routes from './src/routes';
import {FavoriteProvider} from './src/context/FavoriteContext';
import NotificationService from './src/services/NotificationService';

const App = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isFirstLaunch, setIsFirstLaunch] = useState(true);
  const [isFirstTime, setIsFirstTime] = useState(true);

  // Uygulama ilk kez açılıyor mu kontrolü
  useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        const hasLaunched = await AsyncStorage.getItem('hasLaunched');
        if (hasLaunched === null) {
          await AsyncStorage.setItem('hasLaunched', 'true');
          setIsFirstTime(true);
        } else {
          setIsFirstTime(false);
        }
        setIsFirstLaunch(false);
      } catch (error) {
        console.error('AsyncStorage error:', error);
        setIsFirstTime(false);
        setIsFirstLaunch(false);
      }
    };
    checkFirstLaunch();
  }, []);

  // Auth state ve kullanıcı rolü kontrolü
  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(async userState => {
      try {
        if (userState) {
          // Kullanıcı giriş yapmışsa
          const snapshot = await database()
            .ref(`users/${userState.uid}`)
            .once('value');
          const userData = snapshot.val();

          // AsyncStorage'a kullanıcı durumunu kaydet
          await AsyncStorage.setItem('userLoggedIn', 'true');
          setUserRole(userData?.role || 'user');
          setUser(userState);
        } else {
          // Kullanıcı çıkış yapmışsa
          await AsyncStorage.removeItem('userLoggedIn');
          await AsyncStorage.removeItem('user_data');
          setUserRole(null);
          setUser(null);
        }
      } catch (error) {
        console.error('Auth state change error:', error);
        setUserRole('user');
      } finally {
        setInitializing(false);
      }
    });

    return () => subscriber();
  }, []);

  useEffect(() => {
    NotificationService.initialize();
  }, []);

  if (initializing) {
    return <View style={{flex: 1, backgroundColor: '#FFF'}} />;
  }

  return (
    <FavoriteProvider>
      <Routes
        isFirstLaunch={isFirstLaunch}
        isFirstTime={isFirstTime}
        user={user}
        userRole={userRole}
        setIsFirstTime={setIsFirstTime}
      />
    </FavoriteProvider>
  );
};

export default App;
