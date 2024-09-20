import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, Switch } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import teamLogos from "../assets/data/team_logos"; // Import the static mapping of logos

const TEAM_STORAGE_KEY = "@teams_list"; // Key for storing teams in AsyncStorage

const Scoreboard_Setup = ({ route }) => {
  const { team1, team2 } = route.params;
  const [team1Logo, setTeam1Logo] = useState(null);
  const [team2Logo, setTeam2Logo] = useState(null);
  const [team1ShortName, setTeam1ShortName] = useState("");
  const [team2ShortName, setTeam2ShortName] = useState("");
  const [team1Score, setTeam1Score] = useState(0);
  const [team2Score, setTeam2Score] = useState(0);
  const [team1Fouls, setTeam1Fouls] = useState(0);
  const [team2Fouls, setTeam2Fouls] = useState(0);
  const [period, setPeriod] = useState(1);

  // State to manage switches
  const [showLogos, setShowLogos] = useState(true); // Initially checked
  const [showFaltas, setShowFaltas] = useState(true); // Initially checked

  // Load the team logos based on the selected team names
  useEffect(() => {
    const loadTeamsFromStorage = async () => {
      try {
        const storedTeams = await AsyncStorage.getItem(TEAM_STORAGE_KEY);
        if (storedTeams !== null) {
          const teams = JSON.parse(storedTeams);

          const team1Data = teams.find((t) => t.name === team1);
          const team2Data = teams.find((t) => t.name === team2);

          if (team1Data) {
            if (team1Data.icon.startsWith("file://") || team1Data.icon.startsWith("http")) {
              setTeam1Logo({ uri: team1Data.icon }); // Set logo as URI
            } else {
              setTeam1Logo(teamLogos[team1Data.icon]); // Load logo from static mapping
            }
            setTeam1ShortName(team1Data.sh_name);
          }

          if (team2Data) {
            if (team2Data.icon.startsWith("file://") || team2Data.icon.startsWith("http")) {
              setTeam2Logo({ uri: team2Data.icon }); // Set logo as URI
            } else {
              setTeam2Logo(teamLogos[team2Data.icon]); // Load logo from static mapping
            }
            setTeam2ShortName(team2Data.sh_name);
          }
        }
      } catch (error) {
        console.error("Error loading team logos from AsyncStorage:", error);
      }
    };

    loadTeamsFromStorage();
  }, [team1, team2]);

  return (
    <View style={styles.container}>
      {/* Switches for toggling logos and faltas */}
      <View style={styles.switchContainer}>
        <View style={styles.switchWrapper}>
          <Switch value={showLogos} onValueChange={setShowLogos} />
          <Text style={styles.switchLabel}>Mostrar logos</Text>
        </View>
        <View style={styles.switchWrapper}>
          <Switch value={showFaltas} onValueChange={setShowFaltas} />
          <Text style={styles.switchLabel}>Mostrar faltas</Text>
        </View>
      </View>

      {/* Scoreboard */}
      <View style={styles.scoreboardWrapper}>
        {/* Period */}
        <View style={styles.periodContainer}>
          <Text style={styles.periodText}>PERIODO {period}</Text>
        </View>

        {/* Scoreboard Content */}
        <View style={styles.scoreboardContainer}>
          {/* Team 1 Logo */}
          {showLogos && team1Logo && <Image source={team1Logo} style={styles.teamLogoLeft} />}

          {/* Team 1 Name */}
          <View style={styles.teamNameContainer}>
            <Text style={styles.teamNameText}>{team1ShortName}</Text>
          </View>

          {/* Score */}
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreText}>
              {team1Score} - {team2Score}
            </Text>
          </View>

          {/* Team 2 Name */}
          <View style={styles.teamNameContainer}>
            <Text style={styles.teamNameText}>{team2ShortName}</Text>
          </View>

          {/* Team 2 Logo */}
          {showLogos && team2Logo && <Image source={team2Logo} style={styles.teamLogoRight} />}
        </View>

        {/* Faults */}
        {showFaltas && (
          <View style={styles.faultsContainer}>
            <>
              <Text style={[styles.faultsText, styles.paddedFaultsText]}>{team1Fouls}</Text>
              <Text style={styles.faultsLabel}>FALTAS</Text>
              <Text style={[styles.faultsText, styles.paddedFaultsText]}>{team2Fouls}</Text>
            </>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start", // Align items towards the top of the screen
    alignItems: "center", // Center horizontally
    backgroundColor: "#fff",
    paddingTop: 50, // Add padding from the top for better spacing
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 40, // Increase bottom margin to move switches higher
  },
  switchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
  },
  switchLabel: {
    marginLeft: 5,
    fontSize: 16,
  },
  scoreboardWrapper: {
    width: "60%", // Fixed width for scoreboard wrapper
    marginTop: 20, // Move the scoreboard a bit higher
  },
  periodContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    height: 40,
    backgroundColor: "#000", // Dark background
    borderBottomWidth: 2,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderColor: "#000080", // Dark blue line
  },
  periodText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff", // White text
  },
  scoreboardContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    justifyContent: "space-between",
    borderTopmWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 1,
    borderBottomWidth: 2,
    borderColor: "#000080", // Dark blue line
    position: "relative", // For absolute positioning of logos
  },
  teamLogoLeft: {
    position: "absolute",
    left: -80, // Positioned to the left of Team 1
    width: 70,
    height: 70,
    resizeMode: "contain",
  },
  teamLogoRight: {
    position: "absolute",
    right: -80, // Positioned to the right of Team 2
    width: 70,
    height: 70,
    resizeMode: "contain",
  },
  teamNameContainer: {
    flex: 1.7, // Team names are wider than the score
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#6c4ba0", // Purple background
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderColor: "#000080", // Dark blue line
  },
  teamNameText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  scoreContainer: {
    flex: 1.25, // Score section is narrower than the team name sections
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#4e7d35", // Green background
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "#000080", // Dark blue line
  },
  scoreText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#fce859",
  },
  faultsContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 40,
    backgroundColor: "#000", // Dark background
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderColor: "#000080", // Dark blue line
  },
  faultsText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  paddedFaultsText: {
    paddingHorizontal: 40, // Padding for "0" on both sides
  },
  faultsLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
});

export default Scoreboard_Setup;
