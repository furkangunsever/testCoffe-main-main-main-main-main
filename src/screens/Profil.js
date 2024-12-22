import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import auth from '@react-native-firebase/auth';

const Profil = ({navigation}) => {
  const currentUser = auth().currentUser;
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState(
    currentUser?.displayName?.split(' ')[0] || '',
  );
  const [lastName, setLastName] = useState(
    currentUser?.displayName?.split(' ')[1] || '',
  );

  const handleSave = async () => {
    try {
      const newDisplayName = `${firstName} ${lastName}`.trim();
      await currentUser.updateProfile({
        displayName: newDisplayName,
      });
      setIsEditing(false);
      Alert.alert('Başarılı', 'Profil bilgileriniz güncellendi.');
    } catch (error) {
      Alert.alert('Hata', 'Profil güncellenirken bir hata oluştu.');
    }
  };

  const handleLogout = async () => {
    Alert.alert('Çıkış Yap', 'Çıkış yapmak istediğinizden emin misiniz?', [
      {
        text: 'İptal',
        style: 'cancel',
      },
      {
        text: 'Çıkış Yap',
        style: 'destructive',
        onPress: async () => {
          try {
            await auth().signOut();
          } catch (error) {
            Alert.alert('Hata', 'Çıkış yapılırken bir hata oluştu.');
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profil</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image
              source={require('../styles/user_icon.png')}
              style={styles.avatar}
            />
            {!isEditing && (
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => setIsEditing(true)}>
                <Image
                  source={require('../styles/edit_icon.png')}
                  style={styles.editIcon}
                />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.infoContainer}>
            {isEditing ? (
              <>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Ad</Text>
                  <TextInput
                    style={styles.input}
                    value={firstName}
                    onChangeText={setFirstName}
                    placeholder="Adınız"
                    placeholderTextColor="#999"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Soyad</Text>
                  <TextInput
                    style={styles.input}
                    value={lastName}
                    onChangeText={setLastName}
                    placeholder="Soyadınız"
                    placeholderTextColor="#999"
                  />
                </View>

                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleSave}>
                  <Text style={styles.saveButtonText}>Kaydet</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.nameText}>
                  {currentUser?.displayName || 'İsimsiz Kullanıcı'}
                </Text>
                <Text style={styles.emailText}>{currentUser?.email}</Text>
              </>
            )}
          </View>
        </View>

        <View style={styles.settingsSection}>
          <TouchableOpacity
            style={styles.settingsItem}
            onPress={() => navigation.navigate('Notifications')}>
            <Image
              source={require('../styles/notification_icon.png')}
              style={styles.settingsIcon}
            />
            <Text style={styles.settingsText}>Bildirimler</Text>
            <Image
              source={require('../styles/arrow_right.png')}
              style={styles.arrowIcon}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingsItem}
            onPress={() => navigation.navigate('Privacy')}>
            <Image
              source={require('../styles/privacy_icon.png')}
              style={styles.settingsIcon}
            />
            <Text style={styles.settingsText}>Gizlilik</Text>
            <Image
              source={require('../styles/arrow_right.png')}
              style={styles.arrowIcon}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingsItem}
            onPress={() => navigation.navigate('Help')}>
            <Image
              source={require('../styles/help_icon.png')}
              style={styles.settingsIcon}
            />
            <Text style={styles.settingsText}>Yardım</Text>
            <Image
              source={require('../styles/arrow_right.png')}
              style={styles.arrowIcon}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Image
          source={require('../styles/logout_icon.png')}
          style={styles.logoutIcon}
        />
        <Text style={styles.logoutText}>Çıkış Yap</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    padding: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#4A3428',
  },
  scrollView: {
    flex: 1,
  },
  profileSection: {
    backgroundColor: '#FFF',
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F5E6D3',
    padding: 20,
  },
  editButton: {
    position: 'absolute',
    right: -8,
    bottom: -8,
    backgroundColor: '#4A3428',
    padding: 8,
    borderRadius: 20,
    elevation: 2,
  },
  editIcon: {
    width: 20,
    height: 20,
    tintColor: '#FFF',
  },
  infoContainer: {
    width: '100%',
    alignItems: 'center',
  },
  nameText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#4A3428',
    marginBottom: 4,
  },
  emailText: {
    fontSize: 16,
    color: '#666',
  },
  inputGroup: {
    width: '100%',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#000',
  },
  saveButton: {
    backgroundColor: '#4A3428',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 16,
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  settingsSection: {
    backgroundColor: '#FFF',
    marginTop: 16,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  settingsIcon: {
    width: 24,
    height: 24,
    marginRight: 16,
  },
  settingsText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  arrowIcon: {
    width: 20,
    height: 20,
    tintColor: '#666',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  logoutIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  logoutText: {
    fontSize: 16,
    color: '#FF3B30',
    fontWeight: '600',
  },
});

export default Profil;
