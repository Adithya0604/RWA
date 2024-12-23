import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

export default function Page() {
  return (
    <LinearGradient
      colors={["#1E3A8A", "#2563EB", "#60A5FA"]}
      style={styles.container}
    >
      <View style={styles.main}>
        <Text style={styles.title}>☀️ Weather Wizard 🌪️</Text>
        <Text style={styles.subtitle}>
          Forget boring forecasts! Will it rain, shine, or snow? Tap below to
          summon the ultimate weather spell! 🧙‍♂️
        </Text>

        <Link href="/weather" asChild>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>
              ✨ Abracadabra, Show Me Weather!
            </Text>
          </TouchableOpacity>
        </Link>

        <Link href="/screen" asChild>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>
              dummy screen
            </Text>
          </TouchableOpacity>
        </Link>

      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  main: {
    flex: 1,
    justifyContent: "center",
    maxWidth: 960,
    marginHorizontal: "auto",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#FFD700", // Vibrant gold
    textAlign: "center",
    marginBottom: 15,
    textShadowColor: "#FFA500", // Subtle orange glow
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  subtitle: {
    fontSize: 18,
    color: "#F0E68C", // Soft yellow for readability
    textAlign: "center",
    marginBottom: 25,
    lineHeight: 25,
  },
  button: {
    backgroundColor: "#4CAF50", // Lush green for a magical feel
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 6,
    borderWidth: 2,
    borderColor: "#FFD700", // Gold border for pop
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1.2, // Slightly spaced-out letters for impact
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});
