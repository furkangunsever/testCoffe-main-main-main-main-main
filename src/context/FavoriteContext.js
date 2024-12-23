import React, {createContext, useState, useContext, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FavoriteContext = createContext();

export const FavoriteProvider = ({children}) => {
  const [favorites, setFavorites] = useState([]);

  // Favorileri AsyncStorage'dan yükle
  useEffect(() => {
    loadFavorites();
  }, []);

  // Favorileri yükle
  const loadFavorites = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem('favorites');
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error('Favoriler yüklenirken hata:', error);
    }
  };

  // Favori ekle/çıkar
  const toggleFavorite = async cafe => {
    try {
      const isFavorite = favorites.some(fav => fav.id === cafe.id);
      let newFavorites;

      if (isFavorite) {
        newFavorites = favorites.filter(fav => fav.id !== cafe.id);
      } else {
        newFavorites = [...favorites, cafe];
      }

      setFavorites(newFavorites);
      await AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
    } catch (error) {
      console.error('Favori işlemi sırasında hata:', error);
    }
  };

  // Favori kontrolü
  const isFavorite = cafeId => {
    return favorites.some(fav => fav.id === cafeId);
  };

  return (
    <FavoriteContext.Provider value={{favorites, toggleFavorite, isFavorite}}>
      {children}
    </FavoriteContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoriteContext);
