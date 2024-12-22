import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from 'react-native';

const Notifications = ({navigation}) => {
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [promotionalNotifications, setPromotionalNotifications] =
    useState(false);

  const handlePushToggle = value => setPushNotifications(value);
  const handleEmailToggle = value => setEmailNotifications(value);
  const handlePromotionalToggle = value => setPromotionalNotifications(value);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Image
            source={require('../../styles/back_icon.png')}
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bildirimler</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Push Bildirimleri</Text>
              <Text style={styles.settingDescription}>
                Anlık bildirimler alın
              </Text>
            </View>
            <Switch
              value={pushNotifications}
              onValueChange={handlePushToggle}
              trackColor={{false: '#D1D1D6', true: '#4A3428'}}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>E-posta Bildirimleri</Text>
              <Text style={styles.settingDescription}>
                Önemli güncellemeler için e-posta alın
              </Text>
            </View>
            <Switch
              value={emailNotifications}
              onValueChange={handleEmailToggle}
              trackColor={{false: '#D1D1D6', true: '#4A3428'}}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Promosyon Bildirimleri</Text>
              <Text style={styles.settingDescription}>
                Özel teklifler ve kampanyalar hakkında bilgi alın
              </Text>
            </View>
            <Switch
              value={promotionalNotifications}
              onValueChange={handlePromotionalToggle}
              trackColor={{false: '#D1D1D6', true: '#4A3428'}}
            />
          </View>
        </View>
      </View>
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
    padding: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  backIcon: {
    width: 24,
    height: 24,
    tintColor: '#4A3428',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#4A3428',
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: '#FFF',
    marginTop: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#666',
  },
});

export default Notifications;
