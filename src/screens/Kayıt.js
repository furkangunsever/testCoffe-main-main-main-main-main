import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import {signUp} from '../config/firebase';

const {width} = Dimensions.get('window');

const Kayıt = ({navigation}) => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validatePassword = text => {
    setPassword(text);
    if (text.length < 6) {
      setPasswordError('Şifre en az 6 karakter olmalıdır!');
      return false;
    }
    if (confirmPassword && text !== confirmPassword) {
      setPasswordError('Şifreler eşleşmiyor!');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const validateConfirmPassword = text => {
    setConfirmPassword(text);
    if (text !== password) {
      setPasswordError('Şifreler eşleşmiyor!');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleSignUp = async () => {
    if (!email || !password || !name || !surname) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurunuz.');
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError('Şifreler eşleşmiyor!');
      return;
    }

    try {
      setLoading(true);
      const result = await signUp(email, password, name, surname);

      if (result.success) {
        Alert.alert('Başarılı', 'Kayıt işlemi başarıyla tamamlandı.');
        navigation.navigate('Kafeler');
      } else {
        Alert.alert('Hata', result.error);
      }
    } catch (error) {
      Alert.alert('Hata', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled">
        <View style={styles.logoContainer}>
          <Image
            source={require('../styles/splash_coffe.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.title}>Hesap Oluştur</Text>
          <Text style={styles.subtitle}>
            Lütfen bilgilerinizi eksiksiz doldurunuz
          </Text>

          <View style={styles.inputGroup}>
            <View style={styles.inputContainer}>
              <Image
                source={require('../styles/user_icon.png')}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Ad"
                placeholderTextColor="#666"
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={styles.inputContainer}>
              <Image
                source={require('../styles/user_icon.png')}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Soyad"
                placeholderTextColor="#666"
                value={surname}
                onChangeText={setSurname}
              />
            </View>

            <View style={styles.inputContainer}>
              <Image
                source={require('../styles/email_icon.png')}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="E-mail"
                placeholderTextColor="#666"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Image
                source={require('../styles/password_icon.png')}
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, styles.passwordInput]}
                placeholder="Şifre"
                placeholderTextColor="#666"
                value={password}
                onChangeText={validatePassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}>
                <Image
                  source={
                    showPassword
                      ? require('../styles/eye_off.png')
                      : require('../styles/eye.png')
                  }
                  style={styles.eyeIcon}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Image
                source={require('../styles/password_icon.png')}
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, styles.passwordInput]}
                placeholder="Şifre Tekrar"
                placeholderTextColor="#666"
                value={confirmPassword}
                onChangeText={validateConfirmPassword}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                <Image
                  source={
                    showConfirmPassword
                      ? require('../styles/eye_off.png')
                      : require('../styles/eye.png')
                  }
                  style={styles.eyeIcon}
                />
              </TouchableOpacity>
            </View>

            {passwordError ? (
              <Text style={styles.errorText}>{passwordError}</Text>
            ) : null}
          </View>

          <TouchableOpacity
            style={[styles.registerButton, loading && styles.disabledButton]}
            onPress={handleSignUp}
            disabled={loading}>
            <Text style={styles.registerButtonText}>
              {loading ? 'Kayıt yapılıyor...' : 'Kayıt Ol'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginLink}
            onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLinkText}>
              Zaten hesabınız var mı? Giriş yapın
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  scrollContent: {
    flexGrow: 1,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  logo: {
    width: width * 0.4,
    height: width * 0.4,
  },
  formContainer: {
    flex: 1,
    backgroundColor: '#F5E6D3',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    paddingTop: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4A3428',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginBottom: 15,
    paddingHorizontal: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  inputIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 16,
    color: '#000',
  },
  passwordInput: {
    flex: 1,
    marginRight: 40,
  },
  eyeButton: {
    position: 'absolute',
    right: 15,
    padding: 5,
  },
  eyeIcon: {
    width: 24,
    height: 24,
    tintColor: '#666',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 5,
  },
  registerButton: {
    backgroundColor: '#4A3428',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  disabledButton: {
    backgroundColor: '#A89B91',
  },
  registerButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  loginLinkText: {
    color: '#4A3428',
    fontSize: 16,
  },
});

export default Kayıt;
