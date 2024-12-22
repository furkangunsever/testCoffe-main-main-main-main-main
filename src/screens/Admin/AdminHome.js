import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Image,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';

const {width} = Dimensions.get('window');
const CARD_WIDTH = width * 0.45;

const AdminHome = () => {
  const [stats, setStats] = useState(null);//yorum satırı
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

      statsRef.on('value', snapshot => {
        const data = snapshot.val() || {};
        const todayStats = data[today] || {coffeeCount: 0, giftCount: 0};

        let monthlyStats = {coffeeCount: 0, giftCount: 0};
        let yearlyStats = {coffeeCount: 0, giftCount: 0};
        let totalCustomers = new Set();

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

          if (dayData.users) {
            Object.keys(dayData.users).forEach(userId =>
              totalCustomers.add(userId),
            );
          }
        });

        setStats({
          today: todayStats,
          monthly: monthlyStats,
          yearly: yearlyStats,
          totalCustomers: totalCustomers.size,
        });
        setLoading(false);
      });

      return () => statsRef.off();
    };

    fetchStats();
  }, [cafeName]);

  const StatCard = ({title, value, icon, subtitle, color = '#2C3E50'}) => (
    <View
      style={[styles.statCard, {borderLeftColor: color, borderLeftWidth: 4}]}>
      <View style={styles.statHeader}>
        <Image source={icon} style={[styles.statIcon, {tintColor: color}]} />
        <Text style={styles.statTitle}>{title}</Text>
      </View>
      <Text style={[styles.statValue, {color}]}>{value}</Text>
      {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2C3E50" />
        <Text style={styles.loadingText}>Veriler yükleniyor...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTitleContainer}>
          <Image
            source={require('../../styles/coffee_icon.png')}
            style={styles.headerIcon}
          />
          <Text style={styles.headerTitle}>{cafeName}</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.todaySection}>
          <Text style={styles.sectionTitle}>Bugünün İstatistikleri</Text>
          <View style={styles.cardGrid}>
            <StatCard
              title="Satılan Kahve"
              value={stats?.today.coffeeCount || 0}
              icon={require('../../styles/coffee_icon.png')}
              color="#E67E22"
            />
            <StatCard
              title="Hediye Edilen"
              value={stats?.today.giftCount || 0}
              icon={require('../../styles/gift_icon.png')}
              color="#27AE60"
            />
          </View>
        </View>

        <View style={styles.monthlySection}>
          <Text style={styles.sectionTitle}>Bu Ay</Text>
          <View style={styles.cardGrid}>
            <StatCard
              title="Toplam Satış"
              value={stats?.monthly.coffeeCount || 0}
              icon={require('../../styles/chart_icon.png')}
              subtitle="Kahve"
              color="#3498DB"
            />
            <StatCard
              title="Toplam Hediye"
              value={stats?.monthly.giftCount || 0}
              icon={require('../../styles/reward_icon.png')}
              subtitle="Kahve"
              color="#9B59B6"
            />
          </View>
        </View>

        <View style={styles.customerSection}>
          <Text style={styles.sectionTitle}>Müşteri İstatistikleri</Text>
          <StatCard
            title="Toplam Müşteri"
            value={stats?.totalCustomers || 0}
            icon={require('../../styles/customer_icon.png')}
            subtitle="Tekil müşteri sayısı"
            color="#34495E"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
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
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIcon: {
    width: 28,
    height: 28,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  content: {
    flex: 1,
    padding: 16,
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
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
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
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statSubtitle: {
    fontSize: 12,
    color: '#95A5A6',
  },
  todaySection: {
    marginBottom: 24,
  },
  monthlySection: {
    marginBottom: 24,
  },
  customerSection: {
    marginBottom: 24,
  },
});

export default AdminHome;
