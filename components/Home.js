import React, { useState } from "react";
import { View, TouchableOpacity, Text, TextInput, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { setBaseUrl } from "../config"; // Adjust the import path if necessary

const Home = () => {
  const [isConnecting, setIsConnecting] = useState(false); // To toggle between views
  const [serverAddress, setServerAddress] = useState(""); // To store the server address input
  const [connectionStatus, setConnectionStatus] = useState(null); // null, 'success', 'error'
  const [isLoading, setIsLoading] = useState(false); // To manage the "Conectado" display
  const [isButtonDisabled, setIsButtonDisabled] = useState(true); // Disable "Crear nuevo marcador" button initially

  const navigation = useNavigation();

  const handleButtonPress = () => {
    console.log("Current server address:", serverAddress);
    if (serverAddress) {
      navigation.navigate("Scoreboard", { url: serverAddress });
    }
  };

  const handleControlScoreboard = () => {
    console.log("Current server address:", serverAddress);
    if (serverAddress) {
      navigation.navigate("Scoreboard_Control", { url: serverAddress });
    }
  };

  const handleServerConnectPress = () => {
    setIsConnecting(true); // Show the textfield and buttons for connecting
    setConnectionStatus(null); // Clear any previous connection status
    setIsButtonDisabled(true); // Disable "Crear nuevo marcador" while connecting
  };

  const handleBackPress = () => {
    setIsConnecting(false); // Return to the original view
    setServerAddress(""); // Clear the input field
    setConnectionStatus(null); // Reset connection status
  };

  const handleConnectPress = async () => {
    // Simulate checking if the entered URL can connect
    setConnectionStatus(null); // Reset any previous status
    try {
      const response = await fetch(serverAddress);
      if (response.ok) {
        // Simulating a successful connection
        setIsLoading(true); // Start showing "Conectado" message
        setBaseUrl(serverAddress);
        setTimeout(() => {
          setIsLoading(false); // Hide "Conectado" message after 2 seconds
          setIsConnecting(false); // Return to original view
          setIsButtonDisabled(false); // Enable "Crear nuevo marcador" after successful connection
        }, 2000); // Show for 2 seconds
        setConnectionStatus("success");
      } else {
        // Simulating a failed connection
        setConnectionStatus("error");
        setIsButtonDisabled(true); // Keep "Crear nuevo marcador" disabled if the connection fails
      }
    } catch (error) {
      setConnectionStatus("error");
      setIsButtonDisabled(true); // Keep "Crear nuevo marcador" disabled if the connection fails
    }
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        // Show "Conectado" message in green for 2 seconds
        <View style={styles.connectionMessageContainer}>
          <Text style={styles.connectionMessageSuccess}>Conectado</Text>
        </View>
      ) : (
        <View style={styles.buttonContainer}>
          {isConnecting ? (
            <>
              {/* Text input field for server address */}
              <TextInput
                style={styles.textInput}
                placeholder="Enter server address"
                value={serverAddress}
                onChangeText={(text) => {
                  console.log("Server address updated:", text); // Debugging input
                  setServerAddress(text); // Ensure the state is being updated correctly
                }}
                autoCapitalize="none"
              />

              {/* Show error message if connection fails */}
              {connectionStatus === "error" && (
                <Text style={styles.errorMessage}>
                  Unable to connect. Check the URL and try again.
                </Text>
              )}

              {/* Buttons: Volver and Conectar, placed next to each other */}
              <View style={styles.actionButtonsContainer}>
                <TouchableOpacity style={styles.actionButton} onPress={handleBackPress}>
                  <Text style={styles.buttonText}>Volver</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton} onPress={handleConnectPress}>
                  <Text style={styles.buttonText}>Conectar</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              {/* Original buttons */}
              <TouchableOpacity style={styles.button} onPress={handleServerConnectPress}>
                <Text style={styles.buttonText}>Conectar a servidor</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, isButtonDisabled && styles.buttonDisabled]}
                onPress={handleButtonPress}
              >
                <Text style={styles.buttonText}>Crear nuevo marcador</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, isButtonDisabled && styles.buttonDisabled]}
                onPress={handleControlScoreboard}
              >
                <Text style={styles.buttonText}>Control marcador</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  buttonContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#d53030",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 20,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  textInput: {
    width: "80%",
    borderColor: "#d53030",
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
    borderRadius: 10,
  },
  actionButtonsContainer: {
    flexDirection: "row", // Place the buttons side by side
    justifyContent: "space-between",
    width: "80%", // Same width as the other buttons
  },
  actionButton: {
    backgroundColor: "#d53030",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: "48%", // 48% to fit two buttons side by side
    alignItems: "center",
  },
  errorMessage: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
    width: "80%",
  },
  connectionMessageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  connectionMessageSuccess: {
    color: "green",
    fontSize: 20,
    fontWeight: "bold",
  },
  buttonDisabled: {
    backgroundColor: "#A9A9A9", // Grey background when button is disabled
  },
});

export default Home;
