import Constants from "expo-constants";
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
  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [isLoading, setisLoading] = useState(true);
  const [location, setLocation] = useState<any>(null);

  // This is the effect which is like taking the geolocation of the user and more.
  useEffect(() => {
    async function getCurrentLocation() {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      console.log("Location:", location);
      setLocation(location);
    }

    getCurrentLocation();
  }, []);

  useEffect(() => {
    if (coordinates) {
      fetchWeather();
      fetchForcast();
    }
  }, [coordinates]);

  // FetchWeather function for current weather data.
  const fetchWeather = async () => {
    if (!coordinates) {
      return;
    }
    /*
    -----------------------------------------------------------------------------------------------------------------------------------------------
    || Change Here @2 :- The locaiton(lat, lng) from API @1 should be replaced here and then it will give the weather fo the location acc..ly.   ||
    ----------------------------------------------------------------------------------------------------------------------------------------------- 
*/
    const WeatherAns = await fetch(
      `${Base_URL}/weather?lat=${coordinates.lat}&lon=${coordinates.lng}&appid=${Open_Weather_Key}&units=metric`
    );

    console.log("WeatherAns",WeatherAns);

    const WeatherData = await WeatherAns.json(); // This is written in the JSON mode. lke Proper Json mode.

    // console.log(JSON.stringify(WeatherData, null, 2)); // Json stringify is the method which converts the objects into the string. Where the parameters are val, replacer, Space_number.
    setWeather(WeatherData);
    setisLoading(false);
  };

  // FetchForecast function for days of weather like 1 - 16 days or between.
  const fetchForcast = async () => {
    if (!coordinates) {
      return;
    }
    const ForecastAns = await fetch(
      `${Base_URL}/forecast?lat=${coordinates.lat}&lon=${coordinates.lng}&appid=${Open_Weather_Key}&units=metric`
    );
    const ForecastData = await ForecastAns.json(); // This is written in the JSON mode. lke Proper Json mode.

    console.log(
      "Forecast Data:- ",
      JSON.stringify(ForecastData.list.slice(0, 5), null, 2)
    ); // Json stringify is the method which converts the objects into the string. Where the parameters are val, replacer, Space_number.
    setForecast(ForecastData.list);
  };

  const handleCoordinates = (coords: { lat: number; lng: number }) => {
    setCoordinates(coords);
  };

  // You can call handleCoordinates with your lat/lng
  // if (coordinates) {
  //   const { lat, lng } = coordinates;
  //   handleCoordinates({ lat, lng });
  // }

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
    backgroundColor: "linear-gradient(45deg, #1e3c72, #2a5298)", // Gradient background
    alignItems: "center",
    justifyContent: "center",
  },
  loaderWrapper: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
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
    transform: [{ rotate: "360deg" }], // Adds smooth rotation animation
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
