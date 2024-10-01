import React, { useState, useEffect } from "react";
import { View, Image, Text, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import * as FileSystem from "expo-file-system";
import { Image as ExpoImage } from "expo-image";

// Load credentials from a local JSON file
const creds = require("../creds.json");

const Scoreboard_Control = ({ route }) => {
  const { url } = route.params;
  const [team1Logo, setTeam1Logo] = useState(null);
  const [team2Logo, setTeam2Logo] = useState(null);
  const [team1Score, setTeam1Score] = useState(0);
  const [team2Score, setTeam2Score] = useState(0);
  const [team1Faltas, setTeam1Faltas] = useState(0);
  const [team2Faltas, setTeam2Faltas] = useState(0);
  const [period, setPeriod] = useState(1);

  useEffect(() => {
    console.log("URL received in Scoreboard_Control:", url); // Debugging the URL passed
    loadGitHubImages();
    fetchInitialScores();
  }, [url]);

  const loadGitHubImages = async () => {
    try {
      const { git_user, git_repo, git_pat } = creds;
      const githubApiBaseUrl = `https://raw.githubusercontent.com/${git_user}/${git_repo}/master/`;

      // Fetch team1Logo.png
      const team1LogoUrl = `${githubApiBaseUrl}team1Logo.png?timestamp=${new Date().getTime()}`;
      console.log("TEAMLOGO 1 URL: " + team1LogoUrl);
      // const team1LogoResponse = await fetch(team1LogoUrl, {
      //   headers: {
      //     Authorization: `Bearer ${git_pat}`,
      //     "Cache-Control": "no-cache", // Force no cache
      //     Pragma: "no-cache", // Ensure no cache on legacy proxies
      //     Expires: "0",
      //   },
      // });
      // const team1LogoData = await team1LogoResponse.json();
      // const team1LogoImageUrl = `${team1LogoData.download_url}?timestamp=${new Date().getTime()}`;
      setTeam1Logo(team1LogoUrl);

      // Fetch team2Logo.png
      const team2LogoUrl = `${githubApiBaseUrl}team2Logo.png?timestamp=${new Date().getTime()}`;
      console.log("TEAMLOGO 2 URL: " + team2LogoUrl);
      // const team2LogoResponse = await fetch(team2LogoUrl, {
      //   headers: {
      //     Authorization: `Bearer ${git_pat}`,
      //     "Cache-Control": "no-cache", // Force no cache
      //     Pragma: "no-cache", // Ensure no cache on legacy proxies
      //     Expires: "0",
      //   },
      // });
      // const team2LogoData = await team2LogoResponse.json();
      // const team2LogoImageUrl = `${team2LogoData.download_url}?timestamp=${new Date().getTime()}`;
      setTeam2Logo(team2LogoUrl);
    } catch (error) {
      alert("Error fetching images from GitHub:", error);
    }
  };

  const fetchInitialScores = async () => {
    try {
      const response = await fetch(`${url}`);
      const data = await response.json();
      setTeam1Score(data.team1Score);
      setTeam2Score(data.team2Score);
      setTeam1Faltas(data.faltas1 || 0);
      setTeam2Faltas(data.faltas2 || 0);
      setPeriod(data.period || 1);
    } catch (error) {
      console.error("Error fetching initial scores:", error);
    }
  };

  const updateScore = async (newTeam1Score, newTeam2Score, newFaltas1, newFaltas2, newPeriod) => {
    try {
      const body = {
        period: newPeriod,
        team1Score: newTeam1Score,
        team2Score: newTeam2Score,
        faltas1: newFaltas1,
        faltas2: newFaltas2,
      };

      const response = await fetch(`${url}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        console.log("Scores updated successfully");
      } else {
        console.error("Failed to update scores");
      }
    } catch (error) {
      console.error("Error updating scores:", error);
    }
  };

  const handleScoreChange = (team, increment) => {
    if (team === "team1") {
      const newScore = team1Score + increment;
      setTeam1Score(newScore);
      updateScore(newScore, team2Score);
    } else if (team === "team2") {
      const newScore = team2Score + increment;
      setTeam2Score(newScore);
      updateScore(team1Score, newScore);
    }
  };

  const handleFaltasChange = (team, increment) => {
    if (team === "team1") {
      const newFaltas = (team1Faltas + increment + 10) % 10; // Modulo 10 to keep it between 0 and 9
      setTeam1Faltas(newFaltas);
      updateScore(team1Score, team2Score, newFaltas, team2Faltas);
    } else if (team === "team2") {
      const newFaltas = (team2Faltas + increment + 10) % 10;
      setTeam2Faltas(newFaltas);
      updateScore(team1Score, team2Score, team1Faltas, newFaltas);
    }
  };

  const handlePeriodChange = () => {
    const newPeriod = period === 1 ? 2 : 1;
    setPeriod(newPeriod);
    updateScore(team1Score, team2Score, team1Faltas, team2Faltas, newPeriod);
  };

  const handleReset = () => {
    setTeam1Score(0);
    setTeam2Score(0);
    setTeam1Faltas(0);
    setTeam2Faltas(0);
    setPeriod(1);
    updateScore(0, 0, 0, 0, 1); // Reset all values and send to server
  };

  return (
    <View style={styles.container}>
      <View style={styles.scoreboard}>
        {team1Logo && (
          <ExpoImage key={team1Logo} source={team1Logo} style={styles.logo} cachePolicy="none" />
        )}
        <View style={styles.scoreControl}>
          <TouchableOpacity style={styles.button} onPress={() => handleScoreChange("team1", 1)}>
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
          <Text style={styles.scoreText}>{team1Score}</Text>
          <TouchableOpacity style={styles.button} onPress={() => handleScoreChange("team1", -1)}>
            <Text style={styles.buttonText}>-</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.scoreControl}>
          <TouchableOpacity style={styles.button} onPress={() => handleScoreChange("team2", 1)}>
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
          <Text style={styles.scoreText}>{team2Score}</Text>
          <TouchableOpacity style={styles.button} onPress={() => handleScoreChange("team2", -1)}>
            <Text style={styles.buttonText}>-</Text>
          </TouchableOpacity>
        </View>
        {team2Logo && (
          <ExpoImage key={team2Logo} source={team2Logo} style={styles.logo} cachePolicy="none" />
        )}
      </View>
      <Text style={styles.faultsText}>FALTAS</Text>
      {/* Fault Counters */}
      <View style={styles.faltasContainer}>
        <View style={styles.faltasControl}>
          <TouchableOpacity style={styles.button} onPress={() => handleFaltasChange("team1", 1)}>
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
          <Text style={styles.scoreText}>{team1Faltas}</Text>
          <TouchableOpacity style={styles.button} onPress={() => handleFaltasChange("team1", -1)}>
            <Text style={styles.buttonText}>-</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.faltasControl}>
          <TouchableOpacity style={styles.button} onPress={() => handleFaltasChange("team2", 1)}>
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
          <Text style={styles.scoreText}>{team2Faltas}</Text>
          <TouchableOpacity style={styles.button} onPress={() => handleFaltasChange("team2", -1)}>
            <Text style={styles.buttonText}>-</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* Period and Reset Controls */}
      <View style={styles.periodContainer}>
        <Text style={styles.periodText}>Periodo: {period}</Text>
        <TouchableOpacity style={styles.button} onPress={handlePeriodChange}>
          <Text style={styles.buttonText}>Cambiar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.resetButton]} onPress={handleReset}>
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  scoreboard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "90%",
    height: Dimensions.get("window").height * 0.25, // Reduced height for the scoreboard
    marginTop: 10,
  },
  logo: {
    width: Dimensions.get("window").width / 8, // Smaller logo size
    height: Dimensions.get("window").width / 8,
    resizeMode: "contain",
  },
  scoreControl: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10, // Reduced horizontal space
  },
  scoreText: {
    fontSize: 28, // Reduced font size for the score
    fontWeight: "bold",
    marginVertical: 5, // Reduced margin
  },
  faultsText: {
    fontSize: 24, // Reduced font size for the fault counter
    fontWeight: "bold",
    marginVertical: 5,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 5, // Reduced padding
    paddingHorizontal: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 20, // Smaller button text
    fontWeight: "bold",
  },
  faltasContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "90%",
    marginTop: 10, // Reduced margin between sections
  },
  faltasControl: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  periodControl: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
    marginTop: 50,
  },
  periodLabel: {
    color: "black",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  periodContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 80, // Reduced margin for the period container
  },
  periodText: {
    fontSize: 20, // Smaller font size for the period
    fontWeight: "bold",
    marginHorizontal: 10,
  },
  resetButton: {
    backgroundColor: "#FF3B30",
    paddingVertical: 5, // Reduced padding for the reset button
    paddingHorizontal: 15,
    borderRadius: 5,
    marginLeft: 10,
  },
  resetButtonText: {
    color: "white",
    fontSize: 16, // Smaller text for the reset button
    fontWeight: "bold",
  },
});

export default Scoreboard_Control;
