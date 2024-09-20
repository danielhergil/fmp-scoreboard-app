import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Scoreboard_Team from "./Scoreboard_Team";
import { useNavigation } from "@react-navigation/native";

const Scoreboard = () => {
  const navigation = useNavigation();

  const [team1, setTeam1] = useState("");
  const [team2, setTeam2] = useState("");

  const handleCreateScoreboard = () => {
    navigation.navigate("ScoreboardSetup", { team1, team2 });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Scrollable content */}
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* First Team */}
        <Scoreboard_Team teamNumber={1} onTeamSelect={setTeam1} />

        {/* Second Team */}
        <Scoreboard_Team teamNumber={2} onTeamSelect={setTeam2} />
      </ScrollView>

      {/* Footer with fixed position */}
      <View style={styles.footer}>
        {/* Secondary Button (Volver) */}
        <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.goBack()}>
          <Text style={styles.secondaryButtonText}>Volver</Text>
        </TouchableOpacity>

        {/* Primary Button (Crear marcador) */}
        <TouchableOpacity
          style={[
            styles.primaryButton,
            { backgroundColor: team1 && team2 ? "#d53030" : "#d3d3d3" }, // Disable button color if teams are not selected
          ]}
          onPress={handleCreateScoreboard}
          disabled={team1 === "" || team2 === ""}
        >
          <Text style={styles.primaryButtonText}>Crear marcador</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: "#fff",
  },
  scrollViewContent: {
    paddingHorizontal: 20, // Add padding around the scrollable content
    paddingVertical: 20, // Ensure there is padding above and below the form elements
    flexGrow: 1,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: "#fff",
  },
  secondaryButton: {
    width: "40%",
    backgroundColor: "#d3d3d3",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  secondaryButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  primaryButton: {
    width: "40%",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default Scoreboard;
