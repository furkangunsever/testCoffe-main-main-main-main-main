import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import {deleteAdmin} from '../../config/firebase';

const Adminler = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const adminsRef = database().ref('users');
    const onValueChange = adminsRef
      .orderByChild('role')
      .equalTo('admin')
      .on('value', snapshot => {
        const data = snapshot.val();
        if (data) {
          const adminList = Object.entries(data).map(([id, admin]) => ({
            id,
            ...admin,
          }));
          setAdmins(adminList);
        } else {
          setAdmins([]);
        }
        setLoading(false);
      });

    return () => adminsRef.off('value', onValueChange);
  }, []);

  const handleDeleteAdmin = async (adminId, adminName) => {
    Alert.alert(
      'Admin Sil',
      `${adminName} adlı admini silmek istediğinizden emin misiniz?`,
      [
        {
          text: 'İptal',
          style: 'cancel',
        },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: async () => {
            try {
              const result = await deleteAdmin(adminId);
              if (result.success) {
                Alert.alert('Başarılı', 'Admin başarıyla silindi.');
              } else {
                Alert.alert('Hata', result.error);
              }
            } catch (error) {
              Alert.alert('Hata', error.message);
            }
          },
        },
      ],
    );
  };

  const renderAdminItem = ({item}) => (
    <View style={styles.adminCard}>
      <View style={styles.adminInfo}>
        <View style={styles.avatarContainer}>
          <Image
            source={require('../../styles/user_icon.png')}
            style={styles.avatar}
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.adminName}>
            {item.name} {item.surname}
          </Text>
          <Text style={styles.adminEmail}>{item.email}</Text>
          <Text style={styles.adminCafe}>{item.cafename}</Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() =>
          handleDeleteAdmin(item.id, `${item.name} ${item.surname}`)
        }>
        <Image
          source={require('../../styles/delete_icon.png')}
          style={styles.deleteIcon}
        />
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2C3E50" />
        <Text style={styles.loadingText}>Adminler yükleniyor...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Adminler</Text>
        <Text style={styles.headerSubtitle}>
          Toplam {admins.length} admin bulunmaktadır
        </Text>
      </View>

      {admins.length > 0 ? (
        <FlatList
          data={admins}
          renderItem={renderAdminItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Image
            source={require('../../styles/empty_icon.png')}
            style={styles.emptyIcon}
          />
          <Text style={styles.emptyText}>Henüz admin bulunmamaktadır.</Text>
        </View>
      )}
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
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  listContainer: {
    padding: 16,
  },
  adminCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  adminInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatar: {
    width: 30,
    height: 30,
  },
  textContainer: {
    flex: 1,
  },
  adminName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 4,
  },
  adminEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  adminCafe: {
    fontSize: 12,
    color: '#95A5A6',
  },
  deleteButton: {
    padding: 8,
    backgroundColor: '#FFF0F0',
    borderRadius: 8,
  },
  deleteIcon: {
    width: 20,
    height: 20,
    tintColor: '#FF3B30',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    marginBottom: 16,
    tintColor: '#95A5A6',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default Adminler;
