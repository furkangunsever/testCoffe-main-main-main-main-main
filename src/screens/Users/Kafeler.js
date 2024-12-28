import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {arabica_logo, harputdibek_logo} from '../../assets/images';
import {
  close_icon,
  location_icon,
  search_icon,
  star,
  star_1,
} from '../../assets/icons';
import {useFavorites} from '../../context/FavoriteContext';

const {width} = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

const cafes = [
  {
    id: 1,
    name: 'Arabica Coffee',
    logoPath: '../styles/arabica_logo.png',
    description: 'Kaliteli kahvenin adresi',
    location: 'Kayseri',
  },
  {
    id: 2,
    name: 'Harput Dibek',
    logoPath: '../styles/harputdibek_logo.png',
    description: 'Geleneksel Türk kahvesi',
    location: 'Kayseri',
  },
];

const Kafeler = ({navigation}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const {favorites, toggleFavorite, isFavorite} = useFavorites();

  // Kafeleri favorilere göre sırala
  const sortedCafes = [...cafes].sort((a, b) => {
    const aFav = isFavorite(a.id);
    const bFav = isFavorite(b.id);
    if (aFav && !bFav) return -1;
    if (!aFav && bFav) return 1;
    return 0;
  });

  const filteredCafes = sortedCafes.filter(cafe =>
    cafe.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleCafeSelection = async (cafeName, logoPath) => {
    try {
      // Seçilen kafe bilgisini AsyncStorage'a kaydet
      await AsyncStorage.setItem('selectedCafe', cafeName);

      // Mudavim sayfasına yönlendir ve kafe bilgisini aktar
      navigation.navigate('MainTabs', {
        screen: 'Mudavim',
        params: {
          cafeName: cafeName,
        },
        initial: false,
      });
    } catch (error) {
      console.error('Kafe seçimi hatası:', error);
    }
  };

  const renderCafeCard = cafe => (
    <View key={cafe.id} style={styles.card}>
      <TouchableOpacity
        style={styles.cardContent}
        onPress={() => handleCafeSelection(cafe.name, cafe.logoPath)}>
        <View style={styles.cardImageContainer}>
          <Image
            source={
              cafe.name === 'Arabica Coffee' ? arabica_logo : harputdibek_logo
            }
            style={styles.cardImage}
            resizeMode="contain"
          />
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.cafeName}>{cafe.name}</Text>
          <Text style={styles.cafeDescription}>{cafe.description}</Text>
          <View style={styles.locationContainer}>
            <Image source={location_icon} style={styles.locationIcon} />
            <Text style={styles.locationText}>{cafe.location}</Text>
          </View>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={() => toggleFavorite(cafe)}>
        <Image
          source={isFavorite(cafe.id) ? star_1 : star}
          style={styles.favoriteIcon}
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      <View style={styles.header}>
        <View style={{alignItems: 'center'}}>
          <Text style={styles.headerTitle}>Kafeler</Text>
        </View>
        <Text style={styles.headerSubtitle}>
          Favori kafenizi seçin ve kahve kazanmaya başlayın
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <Image source={search_icon} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Kafe ara..."
          placeholderTextColor="#666"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => setSearchQuery('')}>
            <Image source={close_icon} style={styles.clearIcon} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.cardsContainer}>
          {filteredCafes.map(cafe => renderCafeCard(cafe))}
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
  header: {
    padding: 16,
    backgroundColor: '#FFF',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4A3428',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    margin: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  searchIcon: {
    width: 20,
    height: 20,
    tintColor: '#666',
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    fontSize: 16,
    color: '#000',
  },
  clearButton: {
    padding: 8,
  },
  clearIcon: {
    width: 16,
    height: 16,
    tintColor: '#666',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 16,
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#FFF',
    borderRadius: 16,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  cardImageContainer: {
    width: '100%',
    height: CARD_WIDTH * 0.9,
    backgroundColor: '#F6F6F6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 0,
    paddingTop: 10,
    borderRadius: 10,
  },
  cardImage: {
    width: '80%',
    height: '80%',
  },
  cardContent: {
    padding: 12,
  },
  cafeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A3428',
    marginBottom: 4,
  },
  cafeDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIcon: {
    width: 14,
    height: 14,
    tintColor: '#666',
    marginRight: 4,
  },
  locationText: {
    fontSize: 12,
    color: '#666',
  },
  favoriteButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    padding: 8,
    zIndex: 1,
    backgroundColor: 'white',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  favoriteIcon: {
    width: 24,
    height: 24,
    tintColor: '#FFD700',
  },
});

export default Kafeler;
