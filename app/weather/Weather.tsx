import Constants from "expo-constants";
import { useSearchParams } from "next/navigation";
import { useLocalSearchParams } from "expo-router";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ImageBackground,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Link } from "expo-router";
import React, { useEffect, useState } from "react";
import * as Location from "expo-location";
import ForecastItem from "@/components/ForecastItem";
import { Stack } from "expo-router";

// Base URL for fetching the weather data for different forecast.
const Base_URL = `https://api.openweathermap.org/data/2.5`;

// API Key used for services like auth, Tracking real time data, etc.
const Open_Weather_Key = Constants.expoConfig?.extra?.expoPublicOpenWeatherKey;
const bg_image =
  "https://plus.unsplash.com/premium_photo-1671229652411-4468b946b787?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cmFpbnxlbnwwfHwwfHx8MA%3D%3D";

// Type format for the data custamize.
type MainWeather = {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
  sea_level: number;
  grnd_level: number;
};
export type WeatherInfo = {
  main: MainWeather;
  dt: number;
  name: string;
};
type weather = {
  name: string;
  main: MainWeather;
};

// Weather Function is the main component. Where having fetch weather and forecast has diff function.
const Weather = () => {
  const [weather, setWeather] = useState<WeatherInfo>();
  const [forecast, setForecast] = useState<WeatherInfo[]>();
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [isLoading, setisLoading] = useState(true);
  const [location, setLocation] = useState<any>(null);
  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lon: number;
  } | null>(null);

  const searchParams = useLocalSearchParams();

  useEffect(() => {
    const lat = Array.isArray(searchParams.lat)
      ? searchParams.lat[0]
      : searchParams.lat;
    const lng = Array.isArray(searchParams.lng)
      ? searchParams.lng[0]
      : searchParams.lng;

    if (lat && lng) {
      const newLat = parseFloat(lat);
      const newLng = parseFloat(lng);
      console.log("in here ", { lat, lng });
      if (coordinates?.lat !== newLat || coordinates?.lon !== newLng) {
        console.log("updating ", { lat, lng });
        setCoordinates({ lat: newLat, lon: newLng });
      }
    } else {
      console.log("No URL parameters found");
    }
  }, [searchParams, coordinates]);

  useEffect(() => {
    const fetchData = async () => {
      if (coordinates) {
        await fetchWeather();
        await fetchForcast();
      }
    };
    fetchData();
  }, [coordinates]);

  const fetchWeather = async () => {
    if (!coordinates) {
      console.error("Coordinates are missing!");
      return;
    }

    try {
      const apiUrl = `${Base_URL}/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${Open_Weather_Key}&units=metric`;
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`API request failed with status: ${response.status}`);
      }

      const weatherData = await response.json();
      setWeather(weatherData);
      setisLoading(false);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setErrorMsg("Failed to fetch weather data. Please try again later.");
    }
  };

  // FetchForecast function for days of weather like 1 - 16 days or between.
  const fetchForcast = async () => {
    if (!coordinates) {
      return;
    }

    const ForecastAns = await fetch(
      `${Base_URL}/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${Open_Weather_Key}&units=metric`
    );
    const ForecastData = await ForecastAns.json(); // This is written in the JSON mode. lke Proper Json mode.
    setForecast(ForecastData.list);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.isLoadingContainer}>
        <View style={styles.loaderWrapper}>
          <ActivityIndicator size="large" color="white" style={styles.loader} />
          <Text style={styles.loadingText}>Fetching the latest weather...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Return statement where we have to display the data which has been fetched.
  return (
    <ImageBackground source={{ uri: bg_image }} style={styles.container}>
      <View
        style={{
          ...StyleSheet.absoluteFillObject,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      />
      <Stack.Screen options={{ headerShown: false }} />
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        {weather && (
          <>
            <Text style={styles.name}>{weather.name}</Text>
            <Text style={styles.temp}>{Math.round(weather.main.temp)}°C</Text>
          </>
        )}
      </View>

      <FlatList
        data={forecast}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ height: 110, flexGrow: 0, marginBottom: 40 }}
        contentContainerStyle={{ gap: 10, paddingHorizontal: 10 }}
        renderItem={({ item }) => <ForecastItem forecast={item} />}
      />
    </ImageBackground>
  );
};

// Styleing sheet for all the components custamized.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "yellow",
    justifyContent: "center",
    alignItems: "center",
  },
  name: {
    color: "#FEFEFE",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 50,
    fontFamily: "Times New Roman",
  },
  temp: {
    color: "#FEFEFE",
    fontSize: 70,
    fontWeight: "bold",
    fontFamily: "Times New Roman",
  },
  isLoadingContainer: {
    flex: 1,
    backgroundColor: "linear-gradient(45deg, #1e3c72, #2a5298)",
    alignItems: "center",
    justifyContent: "center",
  },
  loaderWrapper: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 6,
  },
  loader: {
    marginBottom: 20,
    transform: [{ rotate: "360deg" }],
  },
  loadingText: {
    fontSize: 18,
    color: "white",
    textAlign: "center",
    fontWeight: "600",
    fontFamily: "Arial",
    marginTop: 10,
  },
});

// Exporting for other files to import it with out curly brackets.
export default Weather;
