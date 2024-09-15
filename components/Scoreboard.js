import React, { useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import Scoreboard_Team from "./Scoreboard_Team";
import { useNavigation } from "@react-navigation/native";

const Scoreboard = () => {
  const navigation = useNavigation();

  const [team1, setTeam1] = useState("");
  const [team2, setTeam2] = useState("");

  const handleCreateScoreboard = () => {
    // Pass the team names to the next screen (or store globally as needed)
    navigation.navigate("ScoreboardSetup", { team1, team2 });
  };

  return (
    <View style={styles.container}>
      {/* Empty space to fill the area below the header */}
      <Scoreboard_Team teamNumber={1} onTeamSelect={setTeam1} />
      <Scoreboard_Team teamNumber={2} onTeamSelect={setTeam2} />
      <View style={styles.content} />
      {/* Buttons at the footer */}
      <View style={styles.footer}>
        {/* Secondary Button (Volver) */}
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.goBack()} // Navigate back to Home
        >
          <Text style={styles.secondaryButtonText}>Volver</Text>
        </TouchableOpacity>

        {/* Primary Button (Crear marcador) */}
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleCreateScoreboard}
          disabled={team1 === "" || team2 === ""} // Disable until both teams are selected
        >
          <Text style={styles.primaryButtonText}>Crear marcador</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between", // Ensure the footer is pushed to the bottom
    backgroundColor: "#fff",
  },
  content: {
    flex: 1, // Fill the space between the header and footer
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between", // Space between buttons
    paddingHorizontal: 20, // Padding around the footer
    paddingBottom: 20, // Add padding at the bottom
  },
  secondaryButton: {
    width: "40%",
    backgroundColor: "#d3d3d3", // Light grey for secondary button
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10, // Slightly rounded corners
  },
  secondaryButtonText: {
    color: "#000", // Black text color for secondary button
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  primaryButton: {
    width: "40%",
    backgroundColor: "#d53030", // Primary button (same as "Crear nuevo marcador")
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  primaryButtonText: {
    color: "#fff", // White text for primary button
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default Scoreboard;
