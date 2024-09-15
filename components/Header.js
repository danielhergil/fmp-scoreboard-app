import React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';

const Header = () => {
  return (
    <View style={styles.headerContainer}>
      <Image 
        source={require('../assets/fmp_logo.png')} 
        style={styles.logo} 
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
    headerContainer: {
        width: '100%', // Ensure the header takes the full width of the screen
        height: Dimensions.get('window').height * 0.25, // 25% of the screen height
        backgroundColor: '#d53030',
        justifyContent: 'center',  // Center the logo vertically
        alignItems: 'center',      // Center the logo horizontally
        paddingHorizontal: 0,      // Ensure no padding on the sides
        marginHorizontal: 0,       // Ensure no margin on the sides
      },
    logo: {
      width: 150 * 2.8,  // Scale width by 4x
      height: 100 * 2.8, // Scale height by 4x
    },
  });

export default Header;
