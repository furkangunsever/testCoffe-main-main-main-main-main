import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import {addAdmin} from '../../config/firebase';
import {
  add_user_icon,
  email_icon,
  eye,
  eye_off,
  password_icon,
} from '../../assets/icons';

const AdminEkle = ({cafeName}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleAddAdmin = async () => {
    if (!email || !password || !name || !surname) {
      Alert.alert('Uyarı', 'Lütfen tüm alanları doldurunuz.');
      return;
    }

    if (!cafeName) {
      Alert.alert('Hata', 'Cafe bilgisi bulunamadı.');
      return;
    }

    setLoading(true);
    try {
      const result = await addAdmin(email, password, name, surname, cafeName);
      if (result.success) {
        Alert.alert('Başarılı', 'Admin başarıyla eklendi.');
        setEmail('');
        setPassword('');
        setName('');
        setSurname('');
      } else {
        Alert.alert(
          'Hata',
          result.error || 'Admin eklenirken bir hata oluştu.',
        );
      }
    } catch (error) {
      console.error('Admin ekleme hatası:', error);
      Alert.alert('Hata', 'Admin eklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Admin Ekle</Text>
        <Text style={styles.headerSubtitle}>
          Yeni admin bilgilerini aşağıya giriniz
        </Text>
      </View>

      <ScrollView
        style={styles.formContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="none">
        <View style={styles.inputContainer}>
          <Image source={add_user_icon} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Ad"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            returnKeyType="next"
            blurOnSubmit={false}
            autoCorrect={false}
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputContainer}>
          <Image source={add_user_icon} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Soyad"
            value={surname}
            onChangeText={setSurname}
            autoCapitalize="words"
            returnKeyType="next"
            blurOnSubmit={false}
            autoCorrect={false}
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputContainer}>
          <Image source={email_icon} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="E-mail"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            returnKeyType="next"
            blurOnSubmit={false}
            autoCorrect={false}
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputContainer}>
          <Image source={password_icon} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Şifre"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            returnKeyType="done"
            blurOnSubmit={true}
            autoCorrect={false}
            placeholderTextColor="#999"
            onSubmitEditing={() => {
              Keyboard.dismiss();
              handleAddAdmin();
            }}
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
          style={[styles.addButton, loading && styles.disabledButton]}
          onPress={handleAddAdmin}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <>
              <Image source={add_user_icon} style={styles.addIcon} />
              <Text style={styles.addButtonText}>Admin Ekle</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  formContainer: {
    flex: 1,
    padding: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: {
    width: 20,
    height: 20,
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  eyeButton: {
    padding: 8,
  },
  eyeIcon: {
    width: 24,
    height: 24,
    tintColor: '#666',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2C3E50',
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
  },
  disabledButton: {
    backgroundColor: '#95A5A6',
  },
  addIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
    tintColor: '#FFF',
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AdminEkle;
