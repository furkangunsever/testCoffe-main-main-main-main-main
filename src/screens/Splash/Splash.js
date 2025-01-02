import React, {useEffect} from 'react';
import {View, Image, StyleSheet, Animated} from 'react-native';
import {splash_coffe, splash_text} from '../../assets/images';

const Splash = ({navigation}) => {
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    // Görünürlük animasyonu
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.delay(2000), // 2 saniye bekle
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigasyon için timer
    const timer = setTimeout(() => {
      navigation.replace('SplashTwo');
    }, 4000); // Toplam süre: 1sn fade in + 2sn bekleme + 1sn fade out

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, {opacity: fadeAnim}]}>
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
      </Animated.View>
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
  content: {
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
