import { View, Text, StyleSheet } from "react-native";
import { WeatherInfo } from "@/app/weather/Weather";
import React from "react";
import dayjs from "dayjs";
import { BlurView } from "expo-blur";

const ForecastItem = ({ forecast }: { forecast: WeatherInfo }) => {
  return (
    <BlurView intensity={25} style={styles.container}>
      <Text style={styles.temp}>{Math.round(forecast.main.temp)}°C</Text>
      <Text style={styles.date}>
        {dayjs(forecast.dt * 1000).format("ddd ha")}
      </Text>
    </BlurView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "white",
    borderWidth: 1.02,
    borderRadius: 30, 
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.2, 
    shadowRadius: 8, 
    overflow: "hidden", 
  },
  temp: {
    color: "white",
    fontSize: 16, 
    fontWeight: "bold",
    fontFamily: "Times New Roman",
  },
  date: {
    color: "white", 
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "Comic Sans",
  },
});

export default ForecastItem;
