import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import RNModal from 'react-native-modal';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const CustomModal = ({
  isVisible,
  onClose,
  title,
  message,
  buttonText = 'Tamam',
  icon,
  iconTintColor = '#4A3428',
}) => {
  return (
    <RNModal
      isVisible={isVisible}
      onBackdropPress={onClose}
      animationIn="bounceIn"
      animationOut="fadeOut"
      backdropOpacity={0.5}
      style={styles.modal}>
      <View style={styles.modalContent}>
        <View style={styles.modalHeader}>
          {icon && (
            <Image
              source={icon}
              style={[styles.modalIcon, {tintColor: iconTintColor}]}
            />
          )}
          <Text style={styles.modalTitle}>{title}</Text>
        </View>
        <Text style={styles.modalMessage}>{message}</Text>
        <TouchableOpacity style={styles.modalButton} onPress={onClose}>
          <Text style={styles.modalButtonText}>{buttonText}</Text>
        </TouchableOpacity>
      </View>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: windowWidth * 0.05,
    padding: windowWidth * 0.06,
    width: windowWidth * 0.85,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: windowHeight * 0.02,
  },
  modalIcon: {
    width: windowWidth * 0.15,
    height: windowWidth * 0.15,
    marginBottom: windowHeight * 0.01,
  },
  modalTitle: {
    fontSize: windowWidth * 0.06,
    fontWeight: 'bold',
    color: '#4A3428',
    marginBottom: windowHeight * 0.01,
  },
  modalMessage: {
    fontSize: windowWidth * 0.04,
    color: '#666',
    textAlign: 'center',
    lineHeight: windowWidth * 0.06,
    marginBottom: windowHeight * 0.02,
  },
  modalButton: {
    backgroundColor: '#4A3428',
    paddingVertical: windowHeight * 0.015,
    paddingHorizontal: windowWidth * 0.08,
    borderRadius: windowWidth * 0.02,
    elevation: 2,
  },
  modalButtonText: {
    color: 'white',
    fontSize: windowWidth * 0.04,
    fontWeight: '600',
  },
});

export default CustomModal;
