import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Splash from '../screens/Splash/Splash';
import SplashTwo from '../screens/Onboarding/SplashTwo';
import Login from '../screens/Users/Login';
import Kafeler from '../screens/Users/Kafeler';
import Kayıt from '../screens/Users/Kayıt';
import Admin from '../screens/Admin/Admin';
import SuperAdmin from '../screens/Admin/SuperAdmin';
import Notifications from '../screens/Settings/Notifications';
import Privacy from '../screens/Settings/Privacy';
import Help from '../screens/Settings/Help';
import TabNavigator from './TabNav';

const Stack = createNativeStackNavigator();

const StackNavigator = ({
  isFirstLaunch,
  isFirstTime,
  user,
  userRole,
  setIsFirstTime,
}) => {
  const initialRouteName = isFirstLaunch
    ? 'Splash'
    : isFirstTime
    ? 'SplashTwo'
    : 'Login';

  return (
    <Stack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
      }}>
      {isFirstLaunch && (
        <Stack.Screen
          name="Splash"
          component={Splash}
          options={{
            gestureEnabled: false,
          }}
        />
      )}
      <Stack.Screen
        name="SplashTwo"
        component={SplashTwo}
        options={{
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="Login"
        component={Login}
        options={{
          gestureEnabled: false,
          headerLeft: () => null,
        }}
      />
      <Stack.Screen name="Kayıt" component={Kayıt} />
      <Stack.Screen name="SuperAdmin" component={SuperAdmin} />
      <Stack.Screen name="AdminScreen" component={Admin} />
      <Stack.Screen
        name="Kafeler"
        component={Kafeler}
        options={{
          gestureEnabled: false,
          headerShown: false,
        }}
      />
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      <Stack.Screen name="Notifications" component={Notifications} />
      <Stack.Screen name="Privacy" component={Privacy} />
      <Stack.Screen name="Help" component={Help} />
    </Stack.Navigator>
  );
};

export default StackNavigator;
