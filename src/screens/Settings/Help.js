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

const Help = ({navigation}) => {
  const faqItems = [
    {
      question: 'Nasıl kahve puanı kazanabilirim?',
      answer:
        'Her kahve alışverişinizde QR kodunuzu okutarak puan kazanabilirsiniz. 5 kahve puanı topladığınızda 1 kahve hediye kazanırsınız.',
    },
    {
      question: 'Kazandığım kahve hediyemi nasıl kullanabilirim?',
      answer:
        'Kuponlarım sayfasından hediye kahve kuponunuzu görebilir ve kafelerde QR kodunuzu okutarak kullanabilirsiniz.',
    },
    {
      question: 'QR kodum çalışmıyor, ne yapmalıyım?',
      answer:
        'İnternet bağlantınızı kontrol edin ve uygulamayı yeniden başlatın. Sorun devam ederse müşteri hizmetlerimizle iletişime geçin.',
    },
  ];

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
        <Text style={styles.headerTitle}>Yardım</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sıkça Sorulan Sorular</Text>
          {faqItems.map((item, index) => (
            <View key={index} style={styles.faqItem}>
              <Text style={styles.question}>{item.question}</Text>
              <Text style={styles.answer}>{item.answer}</Text>
            </View>
          ))}
        </View>

        <View style={styles.contactSection}>
          <Text style={styles.sectionTitle}>İletişim</Text>
          <TouchableOpacity style={styles.contactItem}>
            <Image
              source={require('../../styles/email_icon.png')}
              style={styles.contactIcon}
            />
            <Text style={styles.contactText}>destek@kahveapp.com</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactItem}>
            <Image
              source={require('../../styles/phone_icon.png')}
              style={styles.contactIcon}
            />
            <Text style={styles.contactText}>0850 123 45 67</Text>
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
    marginBottom: 16,
  },
  faqItem: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  question: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4A3428',
    marginBottom: 8,
  },
  answer: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  contactSection: {
    marginBottom: 24,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  contactIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
    tintColor: '#4A3428',
  },
  contactText: {
    fontSize: 16,
    color: '#4A3428',
  },
});

export default Help;
