import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';

const Privacy = ({navigation}) => {
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
        <Text style={styles.headerTitle}>Gizlilik</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Veri Kullanımı</Text>
          <Text style={styles.sectionText}>
            Uygulamamız, size daha iyi hizmet verebilmek için bazı kişisel
            verilerinizi toplar ve işler. Bu veriler şunları içerir:
          </Text>
          <View style={styles.bulletPoints}>
            <Text style={styles.bulletPoint}>• Ad ve iletişim bilgileri</Text>
            <Text style={styles.bulletPoint}>
              • Kahve tüketim alışkanlıkları
            </Text>
            <Text style={styles.bulletPoint}>• Uygulama kullanım verileri</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Veri Güvenliği</Text>
          <Text style={styles.sectionText}>
            Verileriniz güvenli sunucularda saklanır ve endüstri standardı
            güvenlik önlemleriyle korunur.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Veri Paylaşımı</Text>
          <Text style={styles.sectionText}>
            Verileriniz üçüncü taraflarla paylaşılmaz ve sadece hizmet
            kalitesini artırmak için kullanılır.
          </Text>
        </View>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Gizlilik Politikası</Text>
        </TouchableOpacity>
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
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4A3428',
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
  bulletPoints: {
    marginTop: 8,
  },
  bulletPoint: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    paddingLeft: 8,
  },
  button: {
    backgroundColor: '#4A3428',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Privacy;
