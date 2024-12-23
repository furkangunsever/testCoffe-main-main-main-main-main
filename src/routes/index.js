import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import StackNavigator from './StackNav';

const Routes = ({
  isFirstLaunch,
  isFirstTime,
  user,
  userRole,
  setIsFirstTime,
}) => {
  return (
    <NavigationContainer>
      <StackNavigator
        isFirstLaunch={isFirstLaunch}
        isFirstTime={isFirstTime}
        user={user}
        userRole={userRole}
        setIsFirstTime={setIsFirstTime}
      />
    </NavigationContainer>
  );
};

export default Routes;
