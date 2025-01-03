import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import QRCode from 'react-native-qrcode-svg';
import {kart_icon, back_icon} from '../../assets/icons';
import {arabica_logo, harputdibek_logo} from '../../assets/images';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Kuponlarım = ({navigation}) => {
  const [coupons, setCoupons] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const currentUser = auth().currentUser;

  useEffect(() => {
    if (!currentUser) return;

    const loadCoupons = async () => {
      const couponsRef = database().ref(`/coupons/${currentUser.uid}`);
      const selectedCafe = await AsyncStorage.getItem('selectedCafe');

      const onValueChange = snapshot => {
        const data = snapshot.val();
        if (!data) {
          setCoupons([]);
          return;
        }

        const currentDate = new Date();
        const activeCoupons = [];
        const updates = {};
        let hasUpdates = false;

        Object.entries(data).forEach(([key, coupon]) => {
          if (coupon.cafeName !== selectedCafe) {
            return;
          }

          const expiryDate = new Date(coupon.expiryDate);

          if (expiryDate < currentDate || coupon.isUsed) {
            updates[`/coupons/${currentUser.uid}/${key}`] = null;
            hasUpdates = true;
          } else {
            const diffTime = Math.abs(expiryDate - currentDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            activeCoupons.push({
              id: key,
              ...coupon,
              remainingDays: diffDays,
            });
          }
        });

        if (hasUpdates) {
          database().ref().update(updates);
        }

        activeCoupons.sort(
          (a, b) => new Date(a.expiryDate) - new Date(b.expiryDate),
        );
        setCoupons(activeCoupons);
      };

      couponsRef.on('value', onValueChange);
      return () => couponsRef.off('value', onValueChange);
    };

    loadCoupons();
  }, [currentUser]);

  const generateQRValue = coupon => {
    return JSON.stringify({
      couponId: coupon.id,
      userId: currentUser?.uid,
      cafeName: coupon.cafeName,
      expiryDate: coupon.expiryDate,
      timestamp: new Date().toISOString(),
    });
  };

  const getCafeLogo = cafeName => {
    return cafeName === 'Arabica Coffee' ? arabica_logo : harputdibek_logo;
  };

  const renderCouponCard = coupon => {
    return (
      <TouchableOpacity
        key={coupon.id}
        style={styles.card}
        onPress={() => setSelectedCoupon(coupon)}>
        <View style={styles.cardLeft}>
          <Image
            source={getCafeLogo(coupon.cafeName)}
            style={styles.cardIcon}
            resizeMode="contain"
          />
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Hediye Kahve</Text>
            <Text style={styles.cafeName}>{coupon.cafeName}</Text>
            <View style={styles.expiryContainer}>
              <Text style={styles.expiryLabel}>Kalan Süre:</Text>
              <Text style={styles.expiryValue}>{coupon.remainingDays} gün</Text>
            </View>
          </View>
        </View>
        <View style={styles.cardRight}>
          <Text style={styles.useText}>Kullan</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Image source={back_icon} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Kuponlarım</Text>
      </View>

      {coupons.length > 0 ? (
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}>
          <View style={styles.couponList}>
            {coupons.map(coupon => renderCouponCard(coupon))}
          </View>
        </ScrollView>
      ) : (
        <View style={styles.emptyContainer}>
          <Image source={kart_icon} style={styles.emptyIcon} />
          <Text style={styles.noCouponsText}>
            Henüz kazanılmış kuponunuz bulunmamaktadır.
          </Text>
          <Text style={styles.noCouponsSubText}>
            Kahve alışverişlerinizde puan kazanarak kupon sahibi olabilirsiniz.
          </Text>
        </View>
      )}

      {selectedCoupon && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedCoupon.cafeName}</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setSelectedCoupon(null)}>
                <Text style={styles.closeButtonText}>×</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.qrContainer}>
              <QRCode
                value={generateQRValue(selectedCoupon)}
                size={windowWidth * 0.6}
                backgroundColor="#FFF"
              />
            </View>
            <Text style={styles.modalInstructions}>
              Kuponunuzu kullanmak için QR kodu kasiyer'e okutunuz
            </Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    height: windowHeight * 0.08,
    paddingHorizontal: windowWidth * 0.04,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: windowWidth * 0.02,
  },
  backIcon: {
    width: windowWidth * 0.06,
    height: windowWidth * 0.06,
    tintColor: '#4A3428',
  },
  headerTitle: {
    flex: 1,
    fontSize: windowWidth * 0.06,
    fontWeight: '600',
    color: '#4A3428',
    textAlign: 'center',
    marginRight: windowWidth * 0.1,
  },
  scrollView: {
    flex: 1,
  },
  couponList: {
    padding: windowWidth * 0.04,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: windowWidth * 0.04,
    padding: windowWidth * 0.04,
    marginBottom: windowWidth * 0.04,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cardIcon: {
    width: windowWidth * 0.15,
    height: windowWidth * 0.15,
    marginRight: windowWidth * 0.03,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: windowWidth * 0.045,
    fontWeight: '700',
    color: '#4A3428',
    marginBottom: windowHeight * 0.005,
  },
  cafeName: {
    fontSize: windowWidth * 0.035,
    color: '#666',
    marginBottom: windowHeight * 0.005,
  },
  expiryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  expiryLabel: {
    fontSize: windowWidth * 0.032,
    color: '#666',
    marginRight: windowWidth * 0.02,
  },
  expiryValue: {
    fontSize: windowWidth * 0.032,
    fontWeight: '600',
    color: '#4A3428',
  },
  cardRight: {
    backgroundColor: '#4A3428',
    paddingVertical: windowHeight * 0.01,
    paddingHorizontal: windowWidth * 0.04,
    borderRadius: windowWidth * 0.02,
  },
  useText: {
    color: '#FFF',
    fontSize: windowWidth * 0.035,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: windowWidth * 0.08,
  },
  emptyIcon: {
    width: windowWidth * 0.25,
    height: windowWidth * 0.25,
    marginBottom: windowHeight * 0.03,
    opacity: 0.5,
  },
  noCouponsText: {
    fontSize: windowWidth * 0.045,
    fontWeight: '600',
    color: '#4A3428',
    textAlign: 'center',
    marginBottom: windowHeight * 0.01,
  },
  noCouponsSubText: {
    fontSize: windowWidth * 0.035,
    color: '#666',
    textAlign: 'center',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: windowWidth * 0.05,
    padding: windowWidth * 0.06,
    width: windowWidth * 0.85,
    alignItems: 'center',
  },
  modalHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: windowHeight * 0.02,
    position: 'relative',
  },
  modalTitle: {
    fontSize: windowWidth * 0.05,
    fontWeight: '600',
    color: '#4A3428',
  },
  closeButton: {
    position: 'absolute',
    right: 0,
    padding: windowWidth * 0.02,
  },
  closeButtonText: {
    fontSize: windowWidth * 0.06,
    color: '#666',
    fontWeight: '600',
  },
  qrContainer: {
    padding: windowWidth * 0.05,
    backgroundColor: '#FFF',
    borderRadius: windowWidth * 0.03,
    marginBottom: windowHeight * 0.02,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  modalInstructions: {
    fontSize: windowWidth * 0.035,
    color: '#666',
    textAlign: 'center',
  },
});

export default Kuponlarım;
