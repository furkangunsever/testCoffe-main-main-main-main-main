import React, {useState, useCallback} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FirstPage from '../../components/OnboardPages/FirstPage';
import SecondPage from '../../components/OnboardPages/SecondPage';
import ThreePage from '../../components/OnboardPages/ThreePage';

const {width} = Dimensions.get('window');

const SplashTwo = ({navigation}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const scrollViewRef = React.useRef(null);

  const handleSkip = async () => {
    await AsyncStorage.setItem('hasLaunched', 'true');
    navigation.replace('Login');
  };

  const handleScroll = useCallback(
    event => {
      const offsetX = event.nativeEvent.contentOffset.x;
      const page = Math.round(offsetX / width);
      if (page !== currentPage) {
        setCurrentPage(page);
      }
    },
    [currentPage],
  );

  const handleNext = async () => {
    if (currentPage < 2) {
      const nextPage = currentPage + 1;
      scrollViewRef.current.scrollTo({
        x: width * nextPage,
        animated: true,
      });
      setCurrentPage(nextPage);
    } else {
      await AsyncStorage.setItem('hasLaunched', 'true');
      navigation.replace('Login');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={32}
        bounces={false}
        overScrollMode="never"
        decelerationRate="fast">
        <FirstPage handleSkip={handleSkip} />
        <SecondPage handleSkip={handleSkip} />
        <ThreePage handleSkip={handleSkip} />
      </ScrollView>

      <View style={styles.dotsContainer}>
        <View style={[styles.dot, currentPage === 0 && styles.activeDot]} />
        <View style={[styles.dot, currentPage === 1 && styles.activeDot]} />
        <View style={[styles.dot, currentPage === 2 && styles.activeDot]} />
      </View>

      <TouchableOpacity style={styles.skipButton} onPress={handleNext}>
        <Text style={styles.skipText}>
          {currentPage === 2 ? 'Başla' : 'İlerle'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#C8B39E82',
  },
  dotsContainer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    flexDirection: 'row',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: 'black',
  },
  skipButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    backgroundColor: 'white',
  },
  skipText: {
    color: 'black',
    fontSize: 16,
  },
});

export default SplashTwo;
