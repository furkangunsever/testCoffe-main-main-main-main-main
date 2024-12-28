import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native';
import {back_icon} from '../../assets/icons';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Privacy_policy = ({navigation}) => {
  const policyText = `Sadakat Uygulaması ("Uygulama"), kullanıcıların kahve tüketimlerini takip etmelerini ve belirli bir sayıya ulaştıklarında ücretsiz kahve kazanmalarını sağlayan bir mobil uygulamadır. Bu Gizlilik Politikası, Uygulamayı kullanırken topladığımız kişisel verilerinizi nasıl kullandığımız, koruduğumuz ve haklarınız hakkında daha detaylı bilgi sunmaktadır.

1. Toplanan Veriler

Kimlik Bilgileri: E-posta adresi, kullanıcı adı, şifre, doğum tarihi (isteğe bağlı).
Kahve Tüketim Bilgileri: Hangi kahve türlerini tercih ettiğiniz, kaç kahve tükettiğiniz, satın alma tarihleri, harcama tutarları, ödülleriniz, tercih ettiğiniz kahve dükkanları.
Cihaz Bilgileri: Cihazın türü (iOS, Android), işletim sistemi versiyonu, cihaz kimliği (UUID), IP adresi, mobil ağ bilgileri.
Konum Bilgileri: Uygulamaya izin vermeniz durumunda genel konumunuz (şehir, ülke), uygulama kullanımı sırasında ziyaret ettiğiniz kahve dükkanlarının konumu.
Kullanım Verileri: Uygulama içindeki etkinlikleriniz (kahve siparişi verme, ödülleri kullanma, bildirimleri açma/kapatma), uygulamaya giriş/çıkış tarihleri ve süreleri, uygulama içindeki gezinme davranışlarınız.
Pazarlama Verileri: Pazarlama e-postalarına tıklama oranlarınız, pazarlama mesajlarına verdiğiniz tepkiler.

2. Verilerin Kullanım Amaçları

Uygulama İşlevselliği: Hesabınızı yönetmek, kahve tüketiminizi takip etmek, ödüllerinizi sunmak, kişiselleştirilmiş kahve önerileri sunmak.
Pazarlama: Hedefli pazarlama kampanyaları oluşturmak, yeni ürün veya hizmetler hakkında bilgilendirmek, anketler ve araştırmalar yapmak.
Analiz: Uygulamanın performansını analiz etmek, kullanıcı deneyimini geliştirmek, yeni özellikler ve hizmetler geliştirmek.
Hile Önleme: Uygulama kötüye kullanımını önlemek ve güvenliği sağlamak.

3. Verilerin Paylaşımı

Hizmet Sağlayıcılar: Bulut depolama, analiz, ödeme sistemleri gibi hizmetleri sunan üçüncü taraflarla verilerinizi paylaşabiliriz.
İş Ortakları: Pazarlama kampanyaları veya özel etkinlikler için güvenilir iş ortaklarımızla verilerinizi paylaşabiliriz (örneğin, kahve dükkanları).
Yasal Zorunluluk: Kanun veya yasal bir süreç gereği verilerinizi paylaşmamız istenebilir (örneğin, mahkeme kararı).

4. Verilerin Güvenliği

Verilerinizi korumak için aşağıdaki önlemleri alıyoruz:

Güçlü Şifreleme: Verilerinizi şifreleyerek yetkisiz erişimi önlüyoruz.
Güvenlik Duvarları: Uygulamamıza yapılan saldırılara karşı koruma sağlıyoruz.
Erişim Kontrolü: Verilere erişimi sadece yetkili personelimizle sınırlıyoruz.
Güncel Güvenlik Yazılımları: Sistemlerimizi düzenli olarak güncelliyoruz.

5. Kullanıcının Hakları

Verilere Erişim: Hangi kişisel verilerinizi tuttuğumuz hakkında bilgi isteme ve bu verilere erişim sağlama hakkınız vardır.
Verilerin Düzeltmesi: Yanlış veya eksik olan verilerinizi düzeltme hakkınız vardır.
Verilerin Silinmesi: Hesabınızı silerek veya bizimle iletişime geçerek verilerinizin silinmesini talep edebilirsiniz.
Veri İşleme İtirazı: Pazarlama amaçlı veri işlemelerine itiraz etme hakkınız vardır.
Veri Taşınabilirliği: Belirli koşullar altında verilerinizi başka bir veri sorumlusuna aktarma hakkınız vardır.

6. Çocukların Gizliliği

Uygulamamız 13 yaş altı çocuklara yönelik değildir. Eğer 13 yaşından küçükseniz, lütfen uygulamamızı kullanmayın.

7. Değişiklikler

Bu Gizlilik Politikasını herhangi bir zamanda güncelleme hakkımız saklıdır. Güncellemeler uygulamada yayınlandığında veya size bildirildiğinde geçerli olacaktır.

8. İletişim

Gizlilik politikasıyla ilgili herhangi bir sorunuz veya endişeniz varsa, lütfen support@sadakatapp.com adresinden bizimle iletişime geçin.`;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Image source={back_icon} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Gizlilik Politikası</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.policyCard}>
          <Text style={styles.policyText}>{policyText}</Text>
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
    padding: windowWidth * 0.04,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: windowWidth * 0.02,
    marginRight: windowWidth * 0.02,
  },
  backIcon: {
    width: windowWidth * 0.06,
    height: windowWidth * 0.06,
    tintColor: '#4A3428',
  },
  headerTitle: {
    fontSize: windowWidth * 0.05,
    fontWeight: '600',
    color: '#4A3428',
  },
  content: {
    flex: 1,
    padding: windowWidth * 0.04,
  },
  policyCard: {
    backgroundColor: '#FFF',
    borderRadius: windowWidth * 0.03,
    padding: windowWidth * 0.04,
    marginBottom: windowWidth * 0.04,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  policyText: {
    fontSize: windowWidth * 0.035,
    color: '#333',
    lineHeight: windowWidth * 0.055,
  },
});

export default Privacy_policy;
