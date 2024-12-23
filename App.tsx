import React, {useEffect, useState} from 'react';
import {ActivityIndicator, View} from 'react-native';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Routes from './src/routes';
import {FavoriteProvider} from './src/context/FavoriteContext';

const App = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isFirstLaunch, setIsFirstLaunch] = useState(true);
  const [isRoleLoading, setIsRoleLoading] = useState(true);
  const [isFirstTime, setIsFirstTime] = useState(true);

  // Uygulama ilk kez açılıyor mu kontrolü
  useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        const hasLaunched = await AsyncStorage.getItem('hasLaunched');
        if (hasLaunched === null) {
          // İlk kez açılıyor
          await AsyncStorage.setItem('hasLaunched', 'true');
          setIsFirstTime(true);
        } else {
          // Daha önce açılmış
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

  // Handle user state changes
  async function onAuthStateChanged(user: FirebaseAuthTypes.User | null) {
    setUser(user);

    if (user) {
      setIsRoleLoading(true);
      try {
        const snapshot = await database()
          .ref(`users/${user.uid}`)
          .once('value');

        const userData = snapshot.val();
        setUserRole(userData?.role || 'user');
      } catch (error) {
        console.error('Error fetching user role:', error);
        setUserRole('user');
      } finally {
        setIsRoleLoading(false);
      }
    } else {
      setUserRole(null);
      setIsRoleLoading(false);
    }

    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  if (initializing || isRoleLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#FFF',
        }}>
        <ActivityIndicator size="large" color="#4A3428" />
      </View>
    );
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
