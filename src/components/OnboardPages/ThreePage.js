import React from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {splash_two7, splash_two8, splash_two9} from '../../assets/images';

const {width} = Dimensions.get('window');

const ThreePage = ({handleSkip}) => {
  return (
    <View style={styles.page}>
      <TouchableOpacity style={styles.skipTopButton} onPress={handleSkip}>
        <Text style={styles.skipTopText}>Atla</Text>
      </TouchableOpacity>
      <Image source={splash_two7} style={styles.image} resizeMode="contain" />
      <View
        style={{
          alignItems: 'flex-start',
          width: '100%',
          paddingLeft: 35,
          marginTop: 50,
        }}>
        <Text style={styles.titleText}>Hediyeni Al</Text>
        <Text style={styles.descriptionText}>5 Puan topla ve ücretsiz </Text>
        <Text style={styles.descriptionText}>kahvemi al</Text>
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
        width: width * 0.55,
        height: width * 0.45,
        marginVertical: 10,
        marginTop: -140,
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

export default ThreePage;
