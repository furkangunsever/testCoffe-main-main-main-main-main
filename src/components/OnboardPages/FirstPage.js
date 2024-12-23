import React from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {splash_two1, splash_two2, splash_two3} from '../../assets/images';

const {width} = Dimensions.get('window');

const FirstPage = ({handleSkip}) => {
  return (
    <View style={styles.page}>
      <TouchableOpacity style={styles.skipTopButton} onPress={handleSkip}>
        <Text style={styles.skipTopText}>Atla</Text>
      </TouchableOpacity>
      <Image source={splash_two1} style={styles.image} resizeMode="contain" />
      <View
        style={{
          alignItems: 'flex-start',
          width: '100%',
          paddingLeft: 35,
          marginTop: 30,
        }}>
        <Text style={styles.titleText}>Siparişini</Text>
        <Text style={styles.titleText}>Ver</Text>
        <Text style={styles.descriptionText}>Menümüzü incele ve kahve</Text>
        <Text style={styles.descriptionText}>siparişini ver</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    backgroundColor: '#C8B39E',
  },
  image: {
    width: width * 0.9,
    height: width * 0.57,
    marginVertical: 10,
    marginTop: -100,
  },
  skipTopButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  skipTopText: {
    color: 'black',
    fontSize: 14,
    fontWeight: '800',
  },
  titleText: {
    fontSize: 50,
    fontWeight: 'bold',
    color: 'black',
  },
  descriptionText: {
    fontSize: 22,
    color: 'black',
    marginTop: 10,
  },
});

export default FirstPage;
