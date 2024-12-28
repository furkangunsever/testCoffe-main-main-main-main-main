import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import {signIn} from '../../config/firebase';
import auth from '@react-native-firebase/auth';
import {splash_coffe} from '../../assets/images';
import {eye, eye_off, google_icon} from '../../assets/icons';
import database from '@react-native-firebase/database';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {signInWithGoogle} from '../../config/firebase';

const Login = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurunuz.');
      return;
    }

    try {
      setLoading(true);

      // Firebase auth işlemini bekle
      const result = await signIn(email, password);

      if (!result.success || !result.user) {
        let errorMessage = 'Giriş yapılamadı.';
        if (result.error?.code) {
          switch (result.error.code) {
            case 'auth/invalid-email':
              errorMessage = 'Geçersiz e-posta adresi.';
              break;
            case 'auth/user-disabled':
              errorMessage = 'Bu hesap devre dışı bırakılmış.';
              break;
            case 'auth/user-not-found':
            case 'auth/invalid-credential':
              errorMessage = 'Böyle bir hesap bulunamamaktadır.';
              break;
            case 'auth/wrong-password':
              errorMessage = 'Hatalı şifre.';
              break;
            default:
              errorMessage =
                'Giriş yapılamadı. Lütfen bilgilerinizi kontrol edin.';
          }
        }
        Alert.alert('Hata', errorMessage);
        setLoading(false);
        return;
      }

      // Kullanıcı rolünü kontrol et
      const userSnapshot = await database()
        .ref(`users/${result.user.uid}`)
        .once('value');

      const userData = userSnapshot.val();
      const userRole = userData?.role || 'user';

      // Giriş başarılı olduğunda navigation stack'i temizle ve yeni route'a yönlendir
      let targetRoute = 'Kafeler'; // Varsayılan route

      if (userRole === 'superadmin') {
        targetRoute = 'SuperAdmin';
      } else if (userRole === 'admin') {
        targetRoute = 'AdminScreen';
      }

      // Navigation stack'i temizle ve yeni route'a yönlendir
      navigation.reset({
        index: 0,
        routes: [
          {
            name: targetRoute,
            params: {
              initialLogin: true,
            },
          },
        ],
      });
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Hata', 'Böyle bir hesap bulunamamaktadır.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = () => {
    navigation.navigate('Kayıt');
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);

      // Google Sign-In işlemi başlatılıyor
      const result = await signInWithGoogle();

      if (!result.success) {
        if (result.error?.code === 'SIGN_IN_CANCELLED') {
          // Kullanıcı işlemi iptal etti
          return;
        }
        Alert.alert('Hata', 'Google ile giriş yapılırken bir hata oluştu.');
        return;
      }

      // Kullanıcı Firebase'e kaydedildi, rolünü kontrol et
      const userSnapshot = await database()
        .ref(`users/${result.user.uid}`)
        .once('value');

      const userData = userSnapshot.val();
      const userRole = userData?.role || 'user';

      // Başarılı giriş mesajı
      Alert.alert(
        'Başarılı',
        `${result.user.displayName || 'Kullanıcı'} olarak giriş yapıldı.`,
        [
          {
            text: 'Tamam',
            onPress: () => {
              // Kullanıcı rolüne göre yönlendirme
              let targetRoute = 'Kafeler';
              if (userRole === 'superadmin') {
                targetRoute = 'SuperAdmin';
              } else if (userRole === 'admin') {
                targetRoute = 'AdminScreen';
              }

              navigation.reset({
                index: 0,
                routes: [{name: targetRoute}],
              });
            },
          },
        ],
      );
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      Alert.alert(
        'Hata',
        'Google ile giriş yapılırken bir hata oluştu. Lütfen tekrar deneyin.',
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#4A3428" />
        <Text style={styles.loadingText}>Giriş yapılıyor...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled">
        <View style={styles.topSection}>
          <Image
            source={splash_coffe}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.bottomSection}>
          <Text style={styles.welcomeText}>HOŞGELDİNİZ</Text>
          <Text style={styles.instructionText}>
            Giriş yapmak veya kayıt olmak için e-posta ve şifrenizi giriniz.
          </Text>

          <TextInput
            style={styles.input}
            placeholder="E-mail"
            placeholderTextColor="#666"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loading}
          />
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Password"
              placeholderTextColor="#666"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              editable={!loading}
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowPassword(!showPassword)}>
              <Image
                source={showPassword ? eye_off : eye}
                style={styles.eyeIcon}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.rememberMeContainer}
            onPress={() => setRememberMe(!rememberMe)}
            disabled={loading}>
            <View
              style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
              {rememberMe && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.rememberMeText}>Beni Hatırla</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.loginButton, loading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={loading}>
            <Text style={styles.loginButtonText}>
              {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.googleButton}
            onPress={handleGoogleSignIn}
            disabled={loading}>
            <View style={styles.googleButtonContent}>
              <Image source={google_icon} style={styles.googleIcon} />
              <Text style={styles.googleButtonText}>
                {loading ? 'Giriş yapılıyor...' : 'Google ile Giriş Yap'}
              </Text>
            </View>
          </TouchableOpacity>

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Hesabınız yok mu? </Text>
            <TouchableOpacity onPress={handleRegister} disabled={loading}>
              <Text style={styles.registerLink}>Kayıt Olun</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollContent: {
    flexGrow: 1,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#4A3428',
    fontSize: 16,
  },
  topSection: {
    flex: 0.4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  logo: {
    width: 200,
    height: 200,
  },
  bottomSection: {
    flex: 0.6,
    backgroundColor: '#C8B39E82',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    marginTop: 20,
  },
  instructionText: {
    fontSize: 16,
    color: 'black',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    color: '#000',
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#4A3428',
    borderRadius: 4,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#4A3428',
  },
  checkmark: {
    color: 'white',
    fontSize: 14,
  },
  rememberMeText: {
    fontSize: 14,
    color: '#4A3428',
  },
  loginButton: {
    backgroundColor: 'black',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  loginButtonDisabled: {
    backgroundColor: '#666',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
  },
  registerText: {
    fontSize: 16,
    color: 'black',
  },
  registerLink: {
    fontSize: 16,
    color: 'blue',
    fontWeight: 'bold',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 15,
  },
  passwordInput: {
    flex: 1,
    padding: 15,
    fontSize: 16,
    color: '#000',
  },
  eyeButton: {
    padding: 10,
  },
  eyeIcon: {
    width: 24,
    height: 24,
    tintColor: '#666',
  },
  googleButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#4A3428',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  googleButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  googleButtonText: {
    color: '#4A3428',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Login;