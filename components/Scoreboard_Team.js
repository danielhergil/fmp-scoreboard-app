import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker"; // Import ImagePicker from Expo

const TEAM_STORAGE_KEY = "@teams_list"; // Key for storing teams in AsyncStorage

const Scoreboard_Team = ({ teamNumber, onTeamSelect }) => {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [isOtherSelected, setIsOtherSelected] = useState(false);
  const [otherTeam, setOtherTeam] = useState("");
  const [otherTeamShortName, setOtherTeamShortName] = useState("");
  const [otherTeamIcon, setOtherTeamIcon] = useState(null); // Store the image URI
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  // Request permission to access media library
  useEffect(() => {
    const getPermission = async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Permission to access media library is needed to upload a logo."
        );
      }
    };
    getPermission();
  }, []);

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
      setOtherTeamShortName("");
      setOtherTeamIcon(null);
    }
  };

  // Enable/disable button based on text input validation for all fields
  useEffect(() => {
    const isOtherValid =
      otherTeam.trim() !== "" &&
      otherTeamShortName.trim() !== "" &&
      otherTeamShortName.length <= 5 &&
      otherTeamIcon !== null; // Check if image has been uploaded

    setIsButtonDisabled(!isOtherValid);
  }, [otherTeam, otherTeamShortName, otherTeamIcon]);

  const handleAddTeam = async () => {
    if (!isButtonDisabled) {
      const teamIconName = `${otherTeam.trim().toLowerCase().replace(/\s+/g, "_")}.png`;

      const newTeam = {
        id: teams.length + 1, // Increment ID
        name: otherTeam.trim(),
        sh_name: otherTeamShortName.trim(),
        icon: otherTeamIcon, // Use the image URI
      };

      // Add the new team to the current teams list and save to AsyncStorage
      const updatedTeams = [...teams, newTeam];
      setTeams(updatedTeams);
      setSelectedTeam(newTeam.name);
      setIsOtherSelected(false);
      setOtherTeam("");
      setOtherTeamShortName("");
      setOtherTeamIcon(null);
      onTeamSelect(newTeam.name); // Pass the new team name to parent

      try {
        await AsyncStorage.setItem(TEAM_STORAGE_KEY, JSON.stringify(updatedTeams)); // Persist the updated teams
        Alert.alert("Team added", `${newTeam.name} has been added!`);

        // Print all teams stored in AsyncStorage
        // printAllTeams();
      } catch (error) {
        console.error("Error saving team:", error);
      }
    }
  };

  const handlePickImage = async () => {
    // Open image picker to allow user to select a PNG file
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      const selectedImage = result.assets[0].uri; // Get the URI of the selected image
      setOtherTeamIcon(selectedImage); // Save the image URI to the state
    }
  };

  const printAllTeams = async () => {
    try {
      const storedTeams = await AsyncStorage.getItem(TEAM_STORAGE_KEY);
      if (storedTeams !== null) {
        const allTeams = JSON.parse(storedTeams);
        console.log("All stored teams:", allTeams);
        Alert.alert("Stored Teams", JSON.stringify(allTeams, null, 2)); // Display stored teams in an alert
      } else {
        Alert.alert("No Teams Found", "No teams are stored.");
      }
    } catch (error) {
      console.error("Error printing teams:", error);
    }
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.keyboardView}>
      <ScrollView contentContainerStyle={styles.container}>
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

            <TextInput
              style={styles.textInput}
              placeholder="Introduce a short name (max 5 chars)"
              value={otherTeamShortName}
              maxLength={5} // Limit short name to 5 characters
              onChangeText={setOtherTeamShortName}
            />

            {/* Button to pick an image for the team logo */}
            <TouchableOpacity style={styles.uploadButton} onPress={handlePickImage}>
              <Text style={styles.uploadButtonText}>Upload Logo</Text>
            </TouchableOpacity>

            {/* Show selected image preview */}
            {otherTeamIcon && <Image source={{ uri: otherTeamIcon }} style={styles.imagePreview} />}

            {/* Add the "Añadir equipo" button */}
            <TouchableOpacity
              style={[styles.addButton, isButtonDisabled && styles.addButtonDisabled]}
              onPress={handleAddTeam}
              disabled={isButtonDisabled}
            >
              <Text style={styles.addButtonText}>Añadir equipo</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
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
  uploadButton: {
    backgroundColor: "#4e7d35",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
  },
  uploadButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  imagePreview: {
    width: 100,
    height: 100,
    resizeMode: "contain",
    marginTop: 10,
    borderColor: "#d3d3d3",
    borderWidth: 1,
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
