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

  const filteredCafes = cafes.filter(cafe =>
    cafe.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleCafeSelection = (cafeName, logoPath) => {
    navigation.navigate('MainTabs', {
      screen: 'Anasayfa',
      params: {
        cafeName: cafeName,
        logoPath: logoPath,
      },
    });
  };

  const renderCafeCard = cafe => (
    <TouchableOpacity
      key={cafe.id}
      style={styles.card}
      onPress={() => handleCafeSelection(cafe.name, cafe.logoPath)}>
      <View style={styles.cardImageContainer}>
        <Image
          source={
            cafe.logoPath === '../styles/arabica_logo.png'
              ? require('../styles/arabica_logo.png')
              : require('../styles/harputdibek_logo.png')
          }
          style={styles.cardImage}
          resizeMode="contain"
        />
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cafeName}>{cafe.name}</Text>
        <Text style={styles.cafeDescription}>{cafe.description}</Text>
        <View style={styles.locationContainer}>
          <Image
            source={require('../styles/location_icon.png')}
            style={styles.locationIcon}
          />
          <Text style={styles.locationText}>{cafe.location}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Kafeler</Text>
        <Text style={styles.headerSubtitle}>
          Favori kafenizi seçin ve kahve kazanmaya başlayın
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <Image
          source={require('../styles/search_icon.png')}
          style={styles.searchIcon}
        />
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
            <Image
              source={require('../styles/close_icon.png')}
              style={styles.clearIcon}
            />
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
    height: CARD_WIDTH * 0.8,
    backgroundColor: '#F5E6D3',
    justifyContent: 'center',
    alignItems: 'center',
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
});

export default Kafeler;
