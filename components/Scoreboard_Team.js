import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TEAM_STORAGE_KEY = "@teams_list"; // Key for storing teams in AsyncStorage

const Scoreboard_Team = ({ teamNumber, onTeamSelect }) => {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [isOtherSelected, setIsOtherSelected] = useState(false);
  const [otherTeam, setOtherTeam] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  // Load teams from AsyncStorage or default JSON file
  useEffect(() => {
    const loadTeams = async () => {
      try {
        const storedTeams = await AsyncStorage.getItem(TEAM_STORAGE_KEY);
        if (storedTeams !== null) {
          setTeams(JSON.parse(storedTeams)); // Load saved teams
        } else {
          const teamsData = require("../assets/data/teams.json"); // Load from JSON if no saved data
          setTeams(teamsData);
        }
      } catch (error) {
        console.error("Error loading teams:", error);
      }
    };
    loadTeams();
  }, []);

  const handleTeamSelection = (value) => {
    setSelectedTeam(value);
    onTeamSelect(value); // Pass selected team name to parent component
    if (value === "Other") {
      setIsOtherSelected(true);
    } else {
      setIsOtherSelected(false);
      setOtherTeam(""); // Clear the "Other" input if another team is selected
    }
  };

  // Enable/disable button based on text input
  useEffect(() => {
    setIsButtonDisabled(otherTeam.trim() === "");
  }, [otherTeam]);

  const handleAddTeam = async () => {
    if (otherTeam.trim() !== "") {
      const newTeam = {
        id: teams.length + 1, // Increment ID
        name: otherTeam.trim(),
      };

      // Add the new team to the current teams list and save to AsyncStorage
      const updatedTeams = [...teams, newTeam];
      setTeams(updatedTeams);
      setSelectedTeam(newTeam.name);
      setIsOtherSelected(false);
      setOtherTeam("");
      onTeamSelect(newTeam.name); // Pass the new team name to parent

      try {
        await AsyncStorage.setItem(
          TEAM_STORAGE_KEY,
          JSON.stringify(updatedTeams)
        ); // Persist the updated teams
        Alert.alert("Team added", `${newTeam.name} has been added!`);
      } catch (error) {
        console.error("Error saving team:", error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Añadir Equipo {teamNumber} al marcador</Text>

      {/* Dropdown for team selection */}
      <Picker
        selectedValue={selectedTeam}
        onValueChange={handleTeamSelection}
        style={styles.picker}
      >
        <Picker.Item label="Select a team..." value="" />
        {teams.map((team) => (
          <Picker.Item key={team.id} label={team.name} value={team.name} />
        ))}
        <Picker.Item label="Other..." value="Other" />
      </Picker>

      {/* Conditionally render text input if "Other..." is selected */}
      {isOtherSelected && (
        <>
          <TextInput
            style={styles.textInput}
            placeholder="Introduce a team name"
            value={otherTeam}
            onChangeText={setOtherTeam}
          />

          {/* Add the "Añadir equipo" button */}
          <TouchableOpacity
            style={[
              styles.addButton,
              isButtonDisabled && styles.addButtonDisabled,
            ]}
            onPress={handleAddTeam}
            disabled={isButtonDisabled}
          >
            <Text style={styles.addButtonText}>Añadir equipo</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  picker: {
    height: 50,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#d3d3d3",
  },
  textInput: {
    height: 40,
    borderColor: "#d3d3d3",
    borderWidth: 1,
    paddingHorizontal: 10,
    marginTop: 10,
  },
  addButton: {
    backgroundColor: "#d53030",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
  },
  addButtonDisabled: {
    backgroundColor: "#d3d3d3", // Light grey color when disabled
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Scoreboard_Team;
