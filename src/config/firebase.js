import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

export const signUp = async (email, password, name, surname) => {
  try {
    // Kullanıcı oluştur
    const userCredential = await auth().createUserWithEmailAndPassword(
      email,
      password,
    );

    // Email doğrulama maili gönder
    await userCredential.user.sendEmailVerification();

    // Kullanıcı bilgilerini database'e kaydet
    await database().ref(`users/${userCredential.user.uid}`).set({
      email: email,
      name: name,
      surname: surname,
      role: 'user',
      cafename: 'usercafe',
      emailVerified: false,
      createdAt: database.ServerValue.TIMESTAMP,
    });

    // Kullanıcının oturumunu kapat (email doğrulaması yapılana kadar)
    await auth().signOut();

    return {
      success: true,
      message:
        'Kayıt işlemi başarılı! Lütfen email adresinize gönderilen doğrulama linkine tıklayın.',
    };
  } catch (error) {
    let errorMessage = 'Kayıt işlemi sırasında bir hata oluştu.';

    switch (error.code) {
      case 'auth/email-already-in-use':
        errorMessage = 'Bu email adresi zaten kullanımda.';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Geçersiz email adresi.';
        break;
      case 'auth/operation-not-allowed':
        errorMessage = 'Email/şifre girişi aktif değil.';
        break;
      case 'auth/weak-password':
        errorMessage = 'Şifre çok zayıf.';
        break;
      default:
        errorMessage = 'Kayıt işlemi sırasında bir hata oluştu.';
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
};

export const signIn = async (email, password) => {
  try {
    const userCredential = await auth().signInWithEmailAndPassword(
      email,
      password,
    );
    const user = userCredential.user;

    // Kullanıcı verilerini veritabanından al
    const snapshot = await database().ref(`users/${user.uid}`).once('value');
    const userData = snapshot.val();

    if (!userData) {
      throw new Error('Kullanıcı verileri bulunamadı');
    }

    // Email doğrulaması kontrolü
    if (!user.emailVerified) {
      await auth().signOut(); // Doğrulanmamış kullanıcının oturumunu kapat
      return {
        success: false,
        error: 'EMAIL_NOT_VERIFIED',
        message: 'Lütfen email adresinizi doğrulayın.',
      };
    }

    // Email doğrulandıysa, veritabanındaki emailVerified değerini güncelle
    if (user.emailVerified && !userData.emailVerified) {
      await database().ref(`users/${user.uid}`).update({
        emailVerified: true,
      });
    }

    return {success: true, user, userData};
  } catch (error) {
    console.error('Giriş hatası:', error);
    return {success: false, error};
  }
};

export const signOut = async () => {
  try {
    const currentUser = auth().currentUser;
    if (currentUser) {
      await auth().signOut();
    }
    return {success: true};
  } catch (error) {
    console.error('Çıkış hatası:', error);
    throw error; // Hatayı yukarı fırlat
  }
};

export const checkEmailVerification = async () => {
  try {
    await auth().currentUser.reload();
    return {
      success: true,
      isVerified: auth().currentUser.emailVerified,
    };
  } catch (error) {
    return {success: false, error: error.message};
  }
};

export const resendVerificationEmail = async () => {
  try {
    await auth().currentUser.sendEmailVerification();
    return {
      success: true,
      message: 'Doğrulama e-postası tekrar gönderildi.',
    };
  } catch (error) {
    return {success: false, error: error.message};
  }
};

export const checkUserRole = async userId => {
  try {
    const snapshot = await database().ref(`users/${userId}`).once('value');

    const userData = snapshot.val();
    return {
      success: true,
      role: userData?.role || 'user',
    };
  } catch (error) {
    return {success: false, error: error.message};
  }
};

// Var olan addAdmin fonksiyonunu güncelleyelim
export const addAdmin = async (email, password, name, surname, cafeName) => {
  try {
    // Önce Firebase Authentication'da kullanıcı oluştur
    const userCredential = await auth().createUserWithEmailAndPassword(
      email,
      password,
    );
    const user = userCredential.user;

    // Kullanıcı verilerini veritabanına kaydet
    await database().ref(`users/${user.uid}`).set({
      email: email,
      name: name,
      surname: surname,
      role: 'admin',
      cafename: cafeName,
      createdAt: database.ServerValue.TIMESTAMP,
    });

    return {success: true, user};
  } catch (error) {
    console.error('Admin ekleme hatası:', error);
    return {success: false, error: error.message};
  }
};

// Admin silme fonksiyonu - Sadece database'den silme
export const deleteAdmin = async adminId => {
  try {
    // Delete from database
    await database().ref(`users/${adminId}`).remove();

    return {
      success: true,
      message: 'Admin başarıyla silindi.',
    };
  } catch (error) {
    return {success: false, error: error.message};
  }
};

// QR kodunun kullanılıp kullanılmadığını kontrol et
const checkQRUsage = async qrData => {
  try {
    const qrRef = database().ref(
      `usedQRCodes/${qrData.userId}/${qrData.timestamp}`,
    );
    const snapshot = await qrRef.once('value');

    if (snapshot.exists()) {
      return {
        success: false,
        error: 'Bu QR kod daha önce kullanılmış. Lütfen yeni QR kod oluşturun.',
      };
    }

    // QR kodu kullanıldı olarak işaretle
    await qrRef.set({
      cafeName: qrData.cafeName,
      usedAt: database.ServerValue.TIMESTAMP,
    });

    return {success: true};
  } catch (error) {
    return {success: false, error: error.message};
  }
};

// Kahve sayısını artır ve hediye durumunu kontrol et
export const incrementCoffeeCount = async (userId, cafeName, qrData) => {
  try {
    // Önce QR kodunun kullanılıp kullanılmadığını kontrol et
    const qrCheck = await checkQRUsage(qrData);
    if (!qrCheck.success) {
      return qrCheck;
    }

    // Önce kullanıcının bu kafede daha önce QR okutup okutmadığını kontrol et
    const customerRef = database().ref(`cafeCustomers/${cafeName}/${userId}`);
    const customerSnapshot = await customerRef.once('value');

    // Eğer bu kullanıcı ilk defa bu kafede QR okutuyorsa
    if (!customerSnapshot.exists()) {
      // Kafenin müşteri listesine ekle
      await customerRef.set({
        firstVisit: database.ServerValue.TIMESTAMP,
        name: qrData.userName || '',
      });
    }

    const userCafeRef = database().ref(`users/${userId}/cafes/${cafeName}`);
    const snapshot = await userCafeRef.once('value');
    const cafeData = snapshot.val();

    // Kahve sayısını artır
    let coffeeCount = (cafeData?.coffeeCount || 0) + 1;
    const hasGift = coffeeCount >= 5;

    // Önce mevcut durumu kaydet
    await userCafeRef.update({
      coffeeCount: coffeeCount,
      hasGift: hasGift,
    });

    // 5 kahveye ulaşıldıysa kupon oluştur ve sayacı sıfırla
    if (coffeeCount >= 5) {
      // Kupon oluştur
      const couponRef = database().ref(`/coupons/${userId}`).push();
      await couponRef.set({
        cafeName: cafeName,
        createdAt: database.ServerValue.TIMESTAMP,
        expiryDate: new Date(
          Date.now() + 3 * 24 * 60 * 60 * 1000,
        ).toISOString(), // 3 gün geçerli
        isUsed: false,
      });

      // Sayacı sıfırla
      await userCafeRef.update({
        coffeeCount: 0,
        hasGift: true,
      });

      coffeeCount = 0;
    }

    return {
      success: true,
      coffeeCount: coffeeCount,
      hasGift: hasGift,
    };
  } catch (error) {
    return {success: false, error: error.message};
  }
};

// Hediye kullanımını işle
export const redeemGift = async (userId, cafeName, couponId) => {
  try {
    // Önce kullanıcı bilgilerini al
    const userSnapshot = await database().ref(`users/${userId}`).once('value');
    const userData = userSnapshot.val();

    if (!userData) {
      return {
        success: false,
        error: 'Kullanıcı bulunamadı.',
      };
    }

    // Kuponu kontrol et
    const couponRef = database().ref(`coupons/${userId}/${couponId}`);
    const couponSnapshot = await couponRef.once('value');
    const coupon = couponSnapshot.val();

    if (!coupon) {
      return {
        success: false,
        error: 'Kupon bulunamadı.',
      };
    }

    if (coupon.cafeName !== cafeName) {
      return {
        success: false,
        error: 'Bu kupon başka bir kafeye aittir.',
      };
    }

    // Kuponu sil
    await couponRef.remove();

    return {
      success: true,
      message: 'Hediye başarıyla kullanıldı.',
      userName: `${userData.name} ${userData.surname}`,
    };
  } catch (error) {
    return {success: false, error: error.message};
  }
};

// Bildirim gönderme fonksiyonu
export const sendPushNotification = async (userId, title, body, data = {}) => {
  try {
    // Kullanıcının token'ını al
    const userSnapshot = await database()
      .ref(`users/${userId}/fcmToken`)
      .once('value');
    const fcmToken = userSnapshot.val();

    if (!fcmToken) return;

    // Cloud Function'a istek at
    const response = await fetch('YOUR_CLOUD_FUNCTION_URL', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: fcmToken,
        title,
        body,
        data,
      }),
    });

    return response.json();
  } catch (error) {
    console.error('Send notification error:', error);
    return null;
  }
};
