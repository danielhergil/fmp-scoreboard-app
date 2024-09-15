import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import Home from "./components/Home";
import Scoreboard from "./components/Scoreboard";
import Scoreboard_Setup from "./components/Scoreboard_Setup";
import Header from "./components/Header";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Header />
      <Stack.Navigator initialRouteName="Home">
        {/* Home Screen */}
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ headerShown: false }} // Disable navigation bar
        />
        {/* Scoreboard Screen */}
        <Stack.Screen
          name="Scoreboard"
          component={Scoreboard}
          options={{ headerShown: false }} // Disable navigation bar
        />
        <Stack.Screen
          name="ScoreboardSetup"
          component={Scoreboard_Setup}
          options={{ title: "Configurar marcador" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
