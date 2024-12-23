import React, {useEffect} from 'react';
import {View, Image, StyleSheet} from 'react-native';
import { splash_coffe, splash_text } from '../assets/images';

const Splash = ({navigation}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('SplashTwo');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={splash_coffe}
        style={styles.coffeeImage}
        resizeMode="contain"
      />
      <Image
        source={splash_text}
        style={styles.textImage}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  coffeeImage: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  textImage: {
    width: 200,
    height: 100,
  },
});

export default Splash;
