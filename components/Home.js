import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';
import Header from './Header';
import { useNavigation } from '@react-navigation/native';



const Home = () => {
  
    const navigation = useNavigation();

    const handleButtonPress = () => {
        navigation.navigate('Scoreboard');  // Navigate to Scoreboard screen
    };


  return (
    <View style={styles.container}>
      {/* Button in the middle of the screen */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleButtonPress}>
          <Text style={styles.buttonText}>Crear nuevo marcador</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%', // Ensure the header takes the full width of the screen
        backgroundColor: '#fff', // Background color for the whole home screen
      },
      buttonContainer: {
        flex: 1,
        justifyContent: 'center', // Center the button vertically
        alignItems: 'center',     // Center the button horizontally
      },
      button: {
        backgroundColor: '#d53030',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10, // Slightly rounded corners
      },
      buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
      },
});

export default Home;