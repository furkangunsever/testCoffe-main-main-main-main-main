import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

const windowWidth = Dimensions.get('window').width;

const Mudavim = ({route, navigation}) => {
  const cafeName = route?.params?.cafeName;
  const logoPath = route?.params?.logoPath;
  const currentUser = auth().currentUser;
  const [progress, setProgress] = useState(0);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    if (currentUser) {
      setUserName(currentUser.displayName || '');
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser && cafeName) {
      const userCafeRef = database().ref(
        `users/${currentUser.uid}/cafes/${cafeName}`,
      );
      const unsubscribe = userCafeRef.on('value', snapshot => {
        const cafeData = snapshot.val();
        if (cafeData) {
          setProgress(cafeData.coffeeCount || 0);

          if (cafeData.coffeeCount === 5 && cafeData.hasGift) {
            Alert.alert(
              'Tebrikler! 🎉',
              'Sadaktinizi kanıtladınız🥳! Kuponlarım sayfasından hediye kahve kuponunuzu görebilirsiniz.',
              [{text: 'Tamam', style: 'default'}],
              {cancelable: true},
            );
          }
        }
      });

      return () => userCafeRef.off('value', unsubscribe);
    }
  }, [currentUser, cafeName]);

  const qrValue = JSON.stringify({
    userId: currentUser?.uid || 'guest',
    userEmail: currentUser?.email || 'guest',
    cafeName: cafeName,
    timestamp: new Date().toISOString(),
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('Kafeler')}>
          <Image
            source={require('../styles/back_icon.png')}
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sadakat</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>Hoş Geldiniz,</Text>
          <Text style={styles.userNameText}>{userName}</Text>
        </View>

        <View style={styles.logoContainer}>
          {logoPath && (
            <Image
              source={
                logoPath === '../styles/arabica_logo.png'
                  ? require('../styles/arabica_logo.png')
                  : require('../styles/harputdibek_logo.png')
              }
              style={styles.logo}
            />
          )}
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
          <View style={styles.imageContainer}>
            <Image
              source={require('../styles/coffe.png')}
              style={styles.mudavimImage}
            />
          </View>

          <View style={styles.progressBarContainer}>
            <View
              style={[styles.progressBar, {width: `${(progress / 5) * 100}%`}]}
            />
          </View>

          <Text style={styles.progressText}>{progress}/5 Kahve</Text>
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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    marginRight: 16,
    padding: 4,
  },
  backIcon: {
    width: 24,
    height: 24,
    tintColor: '#4A3428',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '500',
    color: '#4A3428',
    letterSpacing: 1,
  },
  welcomeSection: {
    marginTop: 24,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  welcomeText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  userNameText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4A3428',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  logoContainer: {
    width: '100%',
    height: windowWidth * 0.25,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 24,
  },
  logo: {
    width: '60%',
    height: '100%',
    resizeMode: 'contain',
  },
  qrSection: {
    alignItems: 'center',
    width: '100%',
    marginBottom: 32,
  },
  qrWrapper: {
    padding: 20,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
  },
  instructionText: {
    marginTop: 16,
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
  },
  progressSection: {
    alignItems: 'center',
    width: '100%',
    marginTop: 'auto',
    marginBottom: 32,
  },
  imageContainer: {
    marginBottom: 16,
  },
  mudavimImage: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  progressBarContainer: {
    width: windowWidth * 0.7,
    height: 10,
    backgroundColor: '#F5F5F5',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4A3428',
    borderRadius: 5,
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
});

export default Mudavim;
