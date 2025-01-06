import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import {
  admin_icon,
  coffee_icon,
  customer_icon,
  gift_icon,
  revenue_icon,
  reward_icon,
  sales_icon,
} from '../../assets/icons';

const {width} = Dimensions.get('window');
const CARD_WIDTH = width * 0.45;

const SuperAdminHome = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cafeName, setCafeName] = useState('');

  useEffect(() => {
    const fetchCafeName = async () => {
      const userId = auth().currentUser.uid;
      const snapshot = await database().ref(`users/${userId}`).once('value');
      const userData = snapshot.val();
      setCafeName(userData?.cafename || '');
    };

    fetchCafeName();
  }, []);

  useEffect(() => {
    if (!cafeName) return;

    const fetchStats = async () => {
      const now = new Date();
      const today = now.toISOString().split('T')[0];
      const currentMonth = now.getMonth() + 1;
      const currentYear = now.getFullYear();

      const statsRef = database().ref(`cafeStats/${cafeName}`);
      const customersRef = database().ref(`cafeCustomers/${cafeName}`);

      // Müşteri sayısını gerçek zamanlı dinle
      customersRef.on('value', customersSnapshot => {
        const customerCount = customersSnapshot.numChildren();

        statsRef.on('value', snapshot => {
          const data = snapshot.val() || {};
          const todayStats = data[today] || {coffeeCount: 0, giftCount: 0};

          let monthlyStats = {coffeeCount: 0, giftCount: 0};
          let yearlyStats = {coffeeCount: 0, giftCount: 0};
          let totalRevenue = 0;

          Object.entries(data).forEach(([date, dayData]) => {
            const [year, month] = date.split('-').map(Number);

            if (year === currentYear && month === currentMonth) {
              monthlyStats.coffeeCount += dayData.coffeeCount || 0;
              monthlyStats.giftCount += dayData.giftCount || 0;
            }

            if (year === currentYear) {
              yearlyStats.coffeeCount += dayData.coffeeCount || 0;
              yearlyStats.giftCount += dayData.giftCount || 0;
            }

            totalRevenue += (dayData.coffeeCount || 0) * 30;
          });

          setStats({
            today: todayStats,
            monthly: monthlyStats,
            yearly: yearlyStats,
            totalRevenue,
            totalCustomers: customerCount, // cafeCustomers'dan gelen gerçek müşteri sayısı
          });
          setLoading(false);
        });
      });

      // Cleanup function
      return () => {
        statsRef.off();
        customersRef.off();
      };
    };

    fetchStats();
  }, [cafeName]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A3428" />
        <Text style={styles.loadingText}>Veriler yükleniyor...</Text>
      </View>
    );
  }

  const StatCard = ({title, value, subtitle, icon}) => (
    <View style={styles.statCard}>
      <View style={styles.statHeader}>
        <Image source={icon} style={styles.statIcon} />
        <Text style={styles.statTitle}>{title}</Text>
      </View>
      <Text style={styles.statValue}>{value}</Text>
      {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
    </View>
  );

  const formatCurrency = value => {
    return `₺${(value || 0).toLocaleString('tr-TR')}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTitleContainer}>
          <Image source={admin_icon} style={styles.headerIcon} />
          <Text style={styles.headerSubtitle}>{cafeName}</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.overviewSection}>
          <Text style={styles.sectionTitle}>Genel Bakış</Text>
          <View style={styles.cardGrid}>
            <StatCard
              title="Müşteriler"
              value={stats?.yearly.coffeeCount || 0}
              icon={revenue_icon}
            />
          </View>
        </View>

        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Bugünün İstatistikleri</Text>
          <View style={styles.cardGrid}>
            <StatCard
              title="Satılan Kahve"
              value={stats?.today.coffeeCount || 0}
              icon={coffee_icon}
            />
            <StatCard
              title="Hediye Kahve"
              value={stats?.today.giftCount || 0}
              icon={gift_icon}
            />
          </View>
        </View>

        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Aylık İstatistikler</Text>
          <View style={styles.cardGrid}>
            <StatCard
              title="Toplam Satış"
              value={stats?.monthly.coffeeCount || 0}
              icon={sales_icon}
            />
            <StatCard
              title="Toplam Hediye"
              value={stats?.monthly.giftCount || 0}
              icon={reward_icon}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#2C3E50',
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
    paddingTop: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerSubtitle: {
    fontSize: 24,
    color: '#000',
    fontWeight: 'bold',
  },
  headerIcon: {
    width: 30,
    height: 30,
    tintColor: '#000',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  overviewSection: {
    marginBottom: 24,
  },
  statsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 16,
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: CARD_WIDTH,
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  statTitle: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  statSubtitle: {
    fontSize: 12,
    color: '#7F8C8D',
  },
});

export default SuperAdminHome;
