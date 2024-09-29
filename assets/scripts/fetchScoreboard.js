// fetchScoreboard.js
import { baseUrl } from "../../config"; // Adjust the import path if necessary

const scriptTag = document.currentScript;
const baseUrl = scriptTag.getAttribute("url") || "http://localhost:5000/api/scoreboard"; // Default URL

const fetchData = async () => {
  try {
    const response = await fetch(`${baseUrl}?v=` + new Date().getTime());
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
