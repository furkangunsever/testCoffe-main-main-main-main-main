import React, {useState, useEffect} from 'react';
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
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import {user_icon} from '../../assets/images';
import {
  arrow_right,
  edit_icon,
  help_icon,
  logout_icon,
  notification_icon,
  privacy_icon,
  delete_icon,
} from '../../assets/icons';
import NotificationService from '../../services/NotificationService';
import {signOut} from '../../config/firebase';
import database from '@react-native-firebase/database';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Profil = ({navigation}) => {
  const currentUser = auth().currentUser;
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  // Kullanıcı bilgilerini yükle
  useEffect(() => {
    if (currentUser) {
      const userRef = database().ref(`users/${currentUser.uid}`);
      userRef.once('value').then(snapshot => {
        const userData = snapshot.val();
        if (userData) {
          setFirstName(userData.name || '');
          setLastName(userData.surname || '');
        }
      });
    }
  }, [currentUser]);

  const handleSave = async () => {
    try {
      if (!firstName.trim() || !lastName.trim()) {
        Alert.alert('Hata', 'Ad ve soyad alanları boş bırakılamaz.');
        return;
      }

      // Database'i güncelle
      await database().ref(`users/${currentUser.uid}`).update({
        name: firstName.trim(),
        surname: lastName.trim(),
      });

      setIsEditing(false);
      Alert.alert('Başarılı', 'Profil bilgileriniz güncellendi.');
    } catch (error) {
      console.error('Profile update error:', error);
      Alert.alert('Hata', 'Profil güncellenirken bir hata oluştu.');
    }
  };

  const handleLogout = () => {
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
            const currentUser = auth().currentUser;

            await AsyncStorage.removeItem('selectedCafe');

            if (currentUser) {
              await auth().signOut();
            }

            navigation.reset({
              index: 0,
              routes: [{name: 'Login'}],
            });
          } catch (error) {
            console.error('Çıkış hatası:', error);
            navigation.reset({
              index: 0,
              routes: [{name: 'Login'}],
            });
          }
        },
      },
    ]);
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      'Hesap Silme',
      'Hesabınızı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.',
      [
        {
          text: 'İptal',
          style: 'cancel',
        },
        {
          text: 'Evet, Sil',
          style: 'destructive',
          onPress: async () => {
            try {
              const currentUser = auth().currentUser;

              if (currentUser) {
                await database().ref(`users/${currentUser.uid}`).remove();

                await currentUser.delete();

                Alert.alert('Başarılı', 'Hesabınız başarıyla silindi.');

                navigation.reset({
                  index: 0,
                  routes: [{name: 'Login'}],
                });
              }
            } catch (error) {
              console.error('Delete Account Error:', error);

              if (error.code === 'auth/requires-recent-login') {
                Alert.alert(
                  'Hata',
                  'Güvenlik nedeniyle hesabınızı silmek için yeniden giriş yapmanız gerekmektedir.',
                  [
                    {
                      text: 'Tamam',
                      onPress: async () => {
                        await signOut();
                        navigation.reset({
                          index: 0,
                          routes: [{name: 'Login'}],
                        });
                      },
                    },
                  ],
                );
              } else {
                Alert.alert(
                  'Hata',
                  'Hesap silinirken bir hata oluştu. Lütfen tekrar deneyin.',
                );
              }
            }
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profil</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarWrapper}>
              <Image source={user_icon} style={styles.avatar} />
              {!isEditing && (
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => setIsEditing(true)}>
                  <Image source={edit_icon} style={styles.editIcon} />
                </TouchableOpacity>
              )}
            </View>
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
                  {`${firstName} ${lastName}`.trim() || 'İsimsiz Kullanıcı'}
                </Text>
                <Text style={styles.emailText}>{currentUser?.email}</Text>
              </>
            )}
          </View>
        </View>

        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Ayarlar</Text>
          <View style={styles.settingsCard}>
            <TouchableOpacity
              style={styles.settingsItem}
              onPress={() => navigation.navigate('Notifications')}>
              <View style={styles.settingsLeft}>
                <View style={[styles.iconWrapper, styles.notificationIcon]}>
                  <Image
                    source={notification_icon}
                    style={styles.settingsIcon}
                  />
                </View>
                <Text style={styles.settingsText}>Bildirimler</Text>
              </View>
              <Image source={arrow_right} style={styles.arrowIcon} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.settingsItem}
              onPress={() => navigation.navigate('Privacy')}>
              <View style={styles.settingsLeft}>
                <View style={[styles.iconWrapper, styles.privacyIcon]}>
                  <Image source={privacy_icon} style={styles.settingsIcon} />
                </View>
                <Text style={styles.settingsText}>Gizlilik</Text>
              </View>
              <Image source={arrow_right} style={styles.arrowIcon} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.settingsItem}
              onPress={() => navigation.navigate('Help')}>
              <View style={styles.settingsLeft}>
                <View style={[styles.iconWrapper, styles.helpIcon]}>
                  <Image source={help_icon} style={styles.settingsIcon} />
                </View>
                <Text style={styles.settingsText}>Yardım</Text>
              </View>
              <Image source={arrow_right} style={styles.arrowIcon} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.settingsItem, styles.deleteAccountItem]}
              onPress={handleDeleteAccount}>
              <View style={styles.settingsLeft}>
                <View style={[styles.iconWrapper, styles.deleteAccountIcon]}>
                  <Image source={delete_icon} style={styles.settingsIcon} />
                </View>
                <Text style={styles.deleteAccountText}>Hesabı Sil</Text>
              </View>
              <Image source={arrow_right} style={styles.arrowIcon} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.logoutContainer}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Çıkış Yap</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    padding: windowHeight * 0.02,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: windowWidth * 0.06,
    fontWeight: '600',
    color: '#4A3428',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  profileCard: {
    backgroundColor: '#FFF',
    borderRadius: windowWidth * 0.05,
    margin: windowWidth * 0.04,
    padding: windowWidth * 0.05,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  avatarContainer: {
    marginBottom: windowHeight * 0.02,
  },
  avatarWrapper: {
    position: 'relative',
    padding: windowWidth * 0.02,
  },
  avatar: {
    width: windowWidth * 0.25,
    height: windowWidth * 0.25,
    borderRadius: windowWidth * 0.125,
    backgroundColor: '#F5E6D3',
  },
  editButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#4A3428',
    padding: windowWidth * 0.025,
    borderRadius: windowWidth * 0.06,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  editIcon: {
    width: windowWidth * 0.045,
    height: windowWidth * 0.045,
    tintColor: '#FFF',
  },
  infoContainer: {
    width: '100%',
    alignItems: 'center',
  },
  nameText: {
    fontSize: windowWidth * 0.055,
    fontWeight: '600',
    color: '#4A3428',
    marginBottom: windowHeight * 0.01,
  },
  emailText: {
    fontSize: windowWidth * 0.04,
    color: '#666',
  },
  inputGroup: {
    width: '100%',
    marginBottom: windowHeight * 0.02,
  },
  label: {
    fontSize: windowWidth * 0.035,
    color: '#666',
    marginBottom: windowHeight * 0.01,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: windowWidth * 0.02,
    padding: windowWidth * 0.04,
    fontSize: windowWidth * 0.04,
    color: '#000',
  },
  saveButton: {
    backgroundColor: '#4A3428',
    paddingVertical: windowHeight * 0.015,
    paddingHorizontal: windowWidth * 0.08,
    borderRadius: windowWidth * 0.02,
    marginTop: windowHeight * 0.02,
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: windowWidth * 0.04,
    fontWeight: '600',
  },
  settingsSection: {
    padding: windowWidth * 0.04,
  },
  sectionTitle: {
    fontSize: windowWidth * 0.045,
    fontWeight: '600',
    color: '#4A3428',
    marginBottom: windowHeight * 0.015,
    marginLeft: windowWidth * 0.02,
  },
  settingsCard: {
    backgroundColor: '#FFF',
    borderRadius: windowWidth * 0.05,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: windowWidth * 0.04,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  settingsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    width: windowWidth * 0.1,
    height: windowWidth * 0.1,
    borderRadius: windowWidth * 0.02,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: windowWidth * 0.03,
  },
  notificationIcon: {
    backgroundColor: '#FFE5E5',
  },
  privacyIcon: {
    backgroundColor: '#E5F1FF',
  },
  helpIcon: {
    backgroundColor: '#E5FFE5',
  },
  settingsIcon: {
    width: windowWidth * 0.055,
    height: windowWidth * 0.055,
    tintColor: '#4A3428',
  },
  settingsText: {
    fontSize: windowWidth * 0.04,
    color: '#333',
  },
  arrowIcon: {
    width: windowWidth * 0.05,
    height: windowWidth * 0.05,
    tintColor: '#666',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    width: windowWidth * 0.4,
    justifyContent: 'center',
    backgroundColor: '#D44747FF',
    padding: windowHeight * 0.02,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    borderRadius: windowWidth * 0.1,
  },
  logoutIcon: {
    width: windowWidth * 0.06,
    height: windowWidth * 0.06,
    marginRight: windowWidth * 0.02,
    tintColor: 'white',
  },
  logoutText: {
    fontSize: windowWidth * 0.04,
    color: 'white',
    fontWeight: '600',
  },
  deleteAccountItem: {
    borderBottomWidth: 0,
  },
  deleteAccountIcon: {
    backgroundColor: '#FFE5E5',
  },
  deleteAccountText: {
    color: '#FF3B30',
    fontSize: windowWidth * 0.04,
  },
  logoutContainer: {
    alignItems: 'center',
    width: '100%',
    marginTop: windowWidth * 0.05,
    marginBottom: 20,
  },
});

export default Profil;
