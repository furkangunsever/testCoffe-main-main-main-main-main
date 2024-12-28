import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  Animated,
} from 'react-native';
import Modal from 'react-native-modal';
import QRCode from 'react-native-qrcode-svg';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import LottieView from 'lottie-react-native';
import {back_icon} from '../../assets/icons';
import {arabica_logo, coffe, harputdibek_logo} from '../../assets/images';
import CustomModal from '../../components/Modal/Modal';
import animationData from '../../assets/Animation.json';
import Svg, {Circle, Text as SvgText} from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Mudavim = ({route, navigation}) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalAnimation] = useState(new Animated.Value(0));
  const [selectedCafe, setSelectedCafe] = useState(null);
  const currentUser = auth().currentUser;
  const [progress, setProgress] = useState(0);
  const [userName, setUserName] = useState('');
  const lottieRef = useRef(null);

  useEffect(() => {
    const loadSelectedCafe = async () => {
      try {
        const routeCafeName = route?.params?.cafeName;
        if (routeCafeName) {
          setSelectedCafe(routeCafeName);
          return;
        }

        const storedCafe = await AsyncStorage.getItem('selectedCafe');
        if (storedCafe) {
          setSelectedCafe(storedCafe);
        } else {
          setSelectedCafe('Arabica Coffee');
        }
      } catch (error) {
        console.error('Kafe bilgisi yükleme hatası:', error);
        setSelectedCafe('Arabica Coffee');
      }
    };

    loadSelectedCafe();
  }, [route?.params?.cafeName]);

  useEffect(() => {
    if (currentUser) {
      const userRef = database().ref(`users/${currentUser.uid}`);
      userRef.once('value').then(snapshot => {
        const userData = snapshot.val();
        if (userData) {
          const fullName = `${userData.name || ''} ${
            userData.surname || ''
          }`.trim();
          setUserName(fullName || 'İsimsiz Kullanıcı');
        }
      });
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser && selectedCafe) {
      const userCafeRef = database().ref(
        `users/${currentUser.uid}/cafes/${selectedCafe}`,
      );

      const unsubscribe = userCafeRef.on('value', snapshot => {
        const cafeData = snapshot.val();
        if (cafeData) {
          setProgress(cafeData.coffeeCount || 0);

          if (cafeData.coffeeCount === 5 && cafeData.hasGift) {
            setModalVisible(true);
            Animated.spring(modalAnimation, {
              toValue: 1,
              useNativeDriver: true,
            }).start();
          }
        }
      });

      return () => userCafeRef.off('value', unsubscribe);
    }
  }, [currentUser, selectedCafe]);

  useEffect(() => {
    if (lottieRef.current) {
      lottieRef.current.play();
    }
  }, []);

  const qrValue = JSON.stringify({
    userId: currentUser?.uid || 'guest',
    userEmail: currentUser?.email || 'guest',
    cafeName: selectedCafe,
    timestamp: new Date().toISOString(),
  });

  const getLogo = () => {
    return selectedCafe === 'Arabica Coffee' ? arabica_logo : harputdibek_logo;
  };

  const progressPercentage = (progress / 5) * 100;
  const circleLength = 2 * Math.PI * 45;
  const progressLength = (circleLength * progressPercentage) / 100;
  const remainingLength = circleLength - progressLength;

  return (
    <SafeAreaView style={styles.container}>
      <CustomModal
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
        title="Tebrikler! 🎉"
        message={
          'Sadakatinizi kanıtladınız! 🥳\nKuponlarım sayfasından hediye kahve kuponunuzu görebilirsiniz.'
        }
        buttonText="Tamam"
        icon={coffe}
        iconTintColor="#4A3428"
      />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('Kafeler')}>
          <Image source={back_icon} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sadakat</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>Hoş Geldiniz</Text>
          <Text style={styles.userNameText}>{userName}</Text>
        </View>

        <View style={styles.logoContainer}>
          <Image source={getLogo()} style={styles.logo} resizeMode="contain" />
        </View>

        <View style={styles.qrSection}>
          <View style={styles.qrWrapper}>
            <QRCode
              value={qrValue}
              size={windowWidth * 0.4}
              backgroundColor="#F5E6D3"
            />
          </View>
          <Text style={styles.instructionText}>
            İndirimden yararlanmak için kasada QR Kodunu gösteriniz.
          </Text>
        </View>

        <View style={styles.progressSection}>
          <View style={styles.circularProgressContainer}>
            <View style={styles.progressWrapper}>
              <Svg width="120" height="120" viewBox="0 0 100 100">
                <Circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="#F5E6D3"
                  strokeWidth="10"
                  fill="none"
                />
                <Circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="#4A3428"
                  strokeWidth="10"
                  fill="none"
                  strokeDasharray={`${progressLength} ${remainingLength}`}
                  strokeDashoffset={circleLength / 4}
                  transform="rotate(-90 50 50)"
                />
              </Svg>
              <View style={styles.lottieWrapper}>
                <LottieView
                  ref={lottieRef}
                  source={animationData}
                  style={styles.circleLottie}
                  autoPlay
                  loop
                />
              </View>
            </View>
          </View>
          <View style={styles.progressTextWrapper}>
            <Text style={styles.progressCountText}>{`${progress}/5`}</Text>
            <Text style={styles.progressText}>Kahve</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
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
    justifyContent: 'center',
    padding: windowHeight * 0.02,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    position: 'relative',
    height: windowHeight * 0.08,
  },
  backButton: {
    position: 'absolute',
    left: windowWidth * 0.04,
    padding: windowWidth * 0.01,
  },
  backIcon: {
    width: windowWidth * 0.06,
    height: windowWidth * 0.06,
    tintColor: '#4A3428',
  },
  headerTitle: {
    fontSize: windowWidth * 0.06,
    fontWeight: '500',
    color: '#4A3428',
    letterSpacing: 1,
    fontStyle: 'italic',
  },
  welcomeSection: {
    width: '100%',
    paddingHorizontal: windowWidth * 0.04,
    paddingVertical: windowHeight * 0.02,
    alignItems: 'flex-start',
  },
  welcomeText: {
    fontSize: windowWidth * 0.04,
    color: '#666',
    marginBottom: windowHeight * 0.005,
  },
  userNameText: {
    fontSize: windowWidth * 0.05,
    fontWeight: 'bold',
    color: '#4A3428',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: windowWidth * 0.04,
  },
  logoContainer: {
    width: windowWidth * 0.5,
    height: windowHeight * 0.12,
    backgroundColor: '#FFFFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: windowHeight * 0.03,
    borderRadius: 10,
  },
  logo: {
    width: windowWidth * 0.5,
    height: windowWidth * 0.25,
    resizeMode: 'contain',
  },
  qrSection: {
    alignItems: 'center',
    width: '100%',
    marginBottom: windowHeight * 0.04,
  },
  qrWrapper: {
    padding: windowWidth * 0.05,
    backgroundColor: '#F5E6D3',
    borderRadius: windowWidth * 0.03,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  instructionText: {
    marginTop: windowHeight * 0.05,
    fontSize: windowWidth * 0.035,
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
  },
  progressSection: {
    alignItems: 'center',
    width: '100%',
    marginTop: 'auto',
    marginBottom: windowHeight * 0.04,
  },
  circularProgressContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: windowHeight * 0.02,
  },
  progressWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: 120,
    height: 120,
  },
  lottieWrapper: {
    position: 'absolute',
    width: 60,
    height: 60,
    top: '50%',
    left: '50%',
    transform: [{translateX: -30}, {translateY: -40}],
  },
  circleLottie: {
    width: '100%',
    height: '100%',
  },
  progressTextWrapper: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: windowWidth * 0.35,
  },
  progressCountText: {
    fontSize: windowWidth * 0.04,
    color: '#4A3428',
    fontWeight: 'bold',
  },
  progressText: {
    fontSize: windowWidth * 0.035,
    color: '#4A3428',
    marginTop: 0,
  },
});

export default Mudavim;
