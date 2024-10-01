import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, Switch, TextInput, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import { Asset } from "expo-asset"; // Import the Asset API for resolving static assets
import { useNavigation } from "@react-navigation/native";
import teamLogos from "../assets/data/team_logos"; // Import the static mapping of logos
import teamsData from "../assets/data/teams.json"; // Import the teams data
import creds from "../creds.json";

const TEAM_STORAGE_KEY = "@teams_list"; // Key for storing teams in AsyncStorage

// Utility function to generate HTML content
const generateHTMLContent = (
  team1Name,
  team2Name,
  team1Logo,
  team2Logo,
  showLogos,
  showFaltas,
  url,
  team1Fouls,
  team2Fouls,
  period,
  team1Score,
  team2Score
) => {
  const logo1 =
    showLogos && team1Logo
      ? `<img src="team1Logo.png" alt="${team1Name}" style="width:90px;height:90px;">`
      : "";
  const logo2 =
    showLogos && team2Logo
      ? `<img src="team2Logo.png" alt="${team2Name}" style="width:90px;height:90px;">`
      : "";
  const faltas1 = showFaltas ? `<span id="team1-fouls">0</span>` : "";
  const faltas2 = showFaltas ? `<span id="team2-fouls">0</span>` : "";
  const faltas_display = showFaltas ? "flex" : "none";

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta http-equiv="Pragma" content="no-cache" />
        <meta http-equiv="Expires" content="0" />
        <title>Modern Scoreboard</title>
        <style>
          @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap");

          body {
            margin: 0;
            background-color: transparent;
            font-family: 'Poppins', sans-serif;
          }

          .scoreboard {
              display: grid;
              grid-template-rows: 10px 40px 10px;
              grid-template-columns: 1fr;
              gap: 5px;
              background-color: transparent;
              color: white;
              width: 260px; /* Adjusted width to fit in the corner */
              position: fixed;
              top: 10px; /* Positioned in the top-left corner */
              left: 90px;
              z-index: 9999;
          }

          /* Period - Row 1 */
          .period {
              display: flex;
              justify-content: center;
              align-items: center;
              font-size: 10px;
              background-color: rgba(51, 51, 51, 0.8); /* Slight transparency */
              color: #fff;
              letter-spacing: 2px;
              font-weight: 600;
              border-top-left-radius: 10px;
              border-top-right-radius: 10px;
          }

          /* Team logos */
          .team-logo-left, .team-logo-right {
              position: absolute;
              width: 50px; /* Smaller logos */
              height: 75px;
              display: flex;
              justify-content: center;
              align-items: center;
              background-color: transparent;
          }

          .team-logo-left {
              left: -60px;
          }

          .team-logo-right {
              right: -60px;
          }

          .team-logo img {
              max-width: 90%;
              height: auto;
              object-fit: contain;
          }

          /* Team names and scores - Row 2 */
          .team-names-score {
              display: flex;
              justify-content: space-between;
              align-items: stretch;
              font-size: 24px;
              background-color: rgba(68, 68, 68, 0.8); /* Slight transparency */
              padding: 10px;
              color: #fff;
              border-radius: 10px;
          }

          .team-name {
              display: flex;
              align-items: center;
              font-size: 16px;
              font-weight: 600;
              padding: 0 10px;
              color: #e0e0e0;
          }

          .score {
              display: flex;
              justify-content: center;
              align-items: center;
              font-size: 20px;
              color: #fff;
              background-color: rgba(93, 138, 110, 0.8); /* Slight transparency */
              padding: 0 20px;
              border-radius: 8px;
              flex-grow: 1;
              box-shadow: inset 0 4px 6px rgba(0, 0, 0, 0.15);
          }

          /* Fouls - Row 3 */
          .fouls {
              display: ${faltas_display};
              justify-content: space-around;
              align-items: center;
              font-size: 10px;
              background-color: rgba(51, 51, 51, 0.8); /* Slight transparency */
              padding: 5px;
              letter-spacing: 2px;
              border-bottom-left-radius: 10px;
              border-bottom-right-radius: 10px;
              color: #fff;
          }

          .fouls span {
              font-weight: 600;
          }
        </style>
      </head>
      <body>
        <div class="scoreboard">
          <!-- Period -->
          <div class="period" id="period">PERIODO 0</div>

          <!-- Team 1 logo (outside row width) -->
          <div class="team-logo team-logo-left">
            ${logo1}
          </div>

          <!-- Team names and score (row 2 with logo width included) -->
          <div class="team-names-score">
            <div class="team-name" id="team1-name">${team1Name}</div>
            <div class="score" id="score">0 - 0</div>
            <div class="team-name" id="team2-name">${team2Name}</div>
          </div>

          <!-- Team 2 logo (outside row width) -->
          <div class="team-logo team-logo-right">
          ${logo2}
          </div>

          <!-- Fouls -->
          <div class="fouls">
            ${faltas1}
            ${showFaltas ? "<span>FALTAS</span>" : ""}
            ${faltas2}
          </div>
        </div>
        <script>
          const fetchData = async () => {
            try {
              const response = await fetch("${url}");
              const data = await response.json();

              // Update scoreboard elements
              document.getElementById("score").innerText = data.team1Score + " - " + data.team2Score; // String concatenation
              document.getElementById("period").innerText = "PERIODO " + data.period; // String concatenation

              // Update fouls if necessary
              if (data.faltas1 !== undefined && data.faltas2 !== undefined) {
                document.getElementById("team1-fouls").innerText = data.faltas1;
                document.getElementById("team2-fouls").innerText = data.faltas2;
                document.getElementById("fouls-label").innerText = "FALTAS";
              }
            } catch (error) {
              console.error("Error fetching scoreboard data:", error);
            }
          };

          // Fetch data every 3 seconds
          setInterval(fetchData, 3000);
        </script>
      </body>
    </html>
  `;
};

const Scoreboard_Setup = ({ route }) => {
  const { team1, team2, url } = route.params;
  const navigation = useNavigation();

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

  // State to handle server connection
  const [isServerConnected, setIsServerConnected] = useState(false);
  const [serverUrl, setServerUrl] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);

  // Load the team logos based on the selected team names
  useEffect(() => {
    // console.log("useEffect triggered");
    const loadTeamsFromStorage = async () => {
      try {
        const storedTeams = await AsyncStorage.getItem(TEAM_STORAGE_KEY);
        // console.log("Raw stored teams data:", storedTeams);
        if (storedTeams !== null) {
          const teams = JSON.parse(storedTeams);

          // console.log("Stored teams:", teams); // Print the parsed teams

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

  useEffect(() => {
    console.log("URL received in Scoreboard Setup:", url); // Debugging the URL passed
    setServerUrl(url);
  }, [url]);

  // const handleConnectServer = async () => {
  //   try {
  //     const response = await fetch(serverUrl);
  //     if (response.ok) {
  //       setIsServerConnected(true);
  //       alert("Server connected!");
  //       try {
  //         const scriptPath = "../assets/scripts/fetchScoreboard.js";

  //         // Read the script file
  //         let script = await FileSystem.readAsStringAsync(scriptPath);

  //         // Replace the URL
  //         script = script.replace("http://localhost:5000/api/scoreboard", serverUrl);

  //         // Save the updated file back
  //         await FileSystem.writeAsStringAsync(scriptPath, script);
  //       } catch (error) {
  //         console.error("Failed to update the script:", error);
  //       }
  //     } else {
  //       alert("Failed to connect to server.");
  //     }
  //   } catch (error) {
  //     alert("Error connecting to server.");
  //   }
  // };

  // Custom btoa implementation for base64 encoding
  const btoa = (input) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    let str = input;
    let output = "";

    for (
      let block = 0, charCode, i = 0, map = chars;
      str.charAt(i | 0) || ((map = "="), i % 1);
      output += map.charAt(63 & (block >> (8 - (i % 1) * 8)))
    ) {
      charCode = str.charCodeAt((i += 3 / 4));

      if (charCode > 0xff) {
        throw new Error(
          "'btoa' failed: The string to be encoded contains characters outside of the Latin1 range."
        );
      }

      block = (block << 8) | charCode;
    }

    return output;
  };

  // Helper function to get the file SHA if the file exists
  const getFileSha = async (filePath, branch) => {
    const owner = creds.git_user; // replace with your GitHub username
    const repo = creds.git_repo; // replace with your repo name
    const gitPat = creds.git_pat;

    const githubApiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;

    try {
      const getFileResponse = await fetch(`${githubApiUrl}?ref=${branch}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${gitPat}`,
          Accept: "application/vnd.github.v3+json",
        },
      });

      if (getFileResponse.status === 200) {
        const fileData = await getFileResponse.json();
        return fileData.sha; // Return the SHA if the file exists
      } else if (getFileResponse.status === 404) {
        console.log(`File ${filePath} does not exist, creating a new one.`);
        return null; // File does not exist, return null
      } else {
        throw new Error(`Error fetching file: ${getFileResponse.status}`);
      }
    } catch (error) {
      console.error("Error fetching existing file:", error);
      throw error;
    }
  };

  const uploadFileToGitHub = async (contentBase64, filePath, message, branch) => {
    const owner = creds.git_user; // replace with your GitHub username
    const repo = creds.git_repo; // replace with your repo name
    const gitPat = creds.git_pat;

    const sha = await getFileSha(filePath, branch); // Get the SHA (if it exists)

    const githubApiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;

    const uploadResponse = await fetch(githubApiUrl, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${gitPat}`,
        Accept: "application/vnd.github.v3+json",
      },
      body: JSON.stringify({
        message: message,
        content: contentBase64,
        branch: branch,
        sha: sha, // Include SHA if replacing an existing file
      }),
    });

    if (uploadResponse.status === 201 || uploadResponse.status === 200) {
      return true;
    } else if (uploadResponse.status === 409 && retryCount < 3) {
      console.log("Conflict detected. Retrying upload with latest SHA...");

      // Fetch the latest SHA and try again
      return uploadFileToGitHub(contentBase64, filePath, message, branch, retryCount + 1);
    } else {
      const responseBody = await uploadResponse.json();
      console.log(responseBody);
      throw new Error(`Error uploading file: ${responseBody.message}`);
    }
  };

  const uploadLogoToGitHub = async (team, teamLogo, filePath, message) => {
    try {
      let contentBase64;

      if (teamLogo && teamLogo.uri) {
        // If the logo is a URI, upload it directly
        console.log(`Uploading logo from URI: ${teamLogo.uri}`);
        contentBase64 = await FileSystem.readAsStringAsync(teamLogo.uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
      } else {
        // If no URI, look into ../assets/data/teams.json for the correct logo
        const teamData = teamsData.find((t) => t.name === team);
        if (!teamData || !teamData.icon) {
          throw new Error(`No icon found for team: ${team}`);
        }

        // Get the static asset from the mapping
        const logoAsset = teamLogos[teamData.icon];
        if (!logoAsset) {
          throw new Error(`Logo asset not found for ${teamData.icon}`);
        }

        // Resolve the asset URI using Asset API
        const asset = Asset.fromModule(logoAsset);
        await asset.downloadAsync(); // Ensure the asset is downloaded

        // Copy the asset to a writable directory (FileSystem.documentDirectory)
        const localUri = `${FileSystem.documentDirectory}${asset.name}`;
        await FileSystem.copyAsync({
          from: asset.localUri || asset.uri,
          to: localUri,
        });
        // Read the image file content as base64 from the new local path
        contentBase64 = await FileSystem.readAsStringAsync(localUri, {
          encoding: FileSystem.EncodingType.Base64,
        });
      }

      if (!contentBase64) {
        throw new Error("Unable to read logo file content.");
      }

      // Now upload the base64-encoded content to GitHub
      const uploadSuccess = await uploadFileToGitHub(contentBase64, filePath, message, "master");

      if (uploadSuccess) {
        console.log(`Successfully uploaded ${filePath}`);
      }
    } catch (error) {
      console.error(`Error uploading logo: ${error}`);
    }
  };

  const saveHTMLFile = async () => {
    const storedTeams = await AsyncStorage.getItem(TEAM_STORAGE_KEY);
    console.log(storedTeams);
    const htmlContent = generateHTMLContent(
      team1ShortName, // team1 name
      team2ShortName, // team2 name
      team1Logo, // team1 logo
      team2Logo, // team2 logo
      showLogos, // show or hide logos
      showFaltas, // show or hide fouls
      serverUrl,
      team1Fouls, // initial team1 fouls
      team2Fouls, // initial team2 fouls
      period,
      team1Score,
      team2Score
    );

    const fileUri = `${FileSystem.documentDirectory}index.html`;

    try {
      // Save the file locally first
      await FileSystem.writeAsStringAsync(fileUri, htmlContent);
      // alert("HTML file has been saved locally!");

      // Read the HTML file content to upload it
      const htmlFileContent = await FileSystem.readAsStringAsync(fileUri);

      // GitHub repository information
      const path = "index.html";
      const branch = "master"; // or master, depending on your repo branch
      const gitPat = creds.git_pat;

      // Base64 encode the content using btoa
      const contentBase64 = btoa(htmlFileContent);
      const contentBase64HTML = btoa(htmlFileContent);

      // Upload the HTML file to GitHub
      await uploadFileToGitHub(contentBase64HTML, path, "Updated scoreboard index.html", branch);

      // Upload the team1Logo and team2Logo
      if (team1Logo) {
        await uploadLogoToGitHub(team1, team1Logo, "team1Logo.png", "Uploaded team1 logo");
      }

      if (team2Logo) {
        await uploadLogoToGitHub(team2, team2Logo, "team2Logo.png", "Uploaded team2 logo");
      }

      // alert("Files have been uploaded to GitHub!");
      navigation.navigate("Home"); // Navigate to home after the upload
    } catch (error) {
      console.error("Error saving and uploading files:", error);
    }
  };

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

      <TouchableOpacity style={styles.button} onPress={saveHTMLFile}>
        <Text style={styles.buttonText}>Deploy</Text>
      </TouchableOpacity>
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
  button: {
    backgroundColor: "#d53030",
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 70,
    borderRadius: 10, // Slightly rounded corners
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  disabledButton: {
    backgroundColor: "grey",
  },
  input: {
    height: 40,
    width: 300,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    marginTop: 30,
    paddingHorizontal: 10,
  },
  checkButton: {
    backgroundColor: "#28a745",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
});

export default Scoreboard_Setup;
