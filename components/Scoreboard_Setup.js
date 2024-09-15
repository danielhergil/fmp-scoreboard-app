import React from "react";
import { View, Text, StyleSheet } from "react-native";

const Scoreboard_Setup = ({ route }) => {
  const { team1, team2 } = route.params; // Get team names from navigation params

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configurar marcador</Text>
      <Text style={styles.teamName}>Equipo 1: {team1}</Text>
      <Text style={styles.teamName}>Equipo 2: {team2}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  teamName: {
    fontSize: 18,
    marginBottom: 10,
  },
});

export default Scoreboard_Setup;
