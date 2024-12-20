import Constants from "expo-constants";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ImageBackground,
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
const bg_image = 'https://plus.unsplash.com/premium_photo-1671229652411-4468b946b787?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cmFpbnxlbnwwfHwwfHx8MA%3D%3D';

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
}

// Weather Function is the main component. Where having fetch weather and forecast has diff function.
const Weather = () => {
  const [weather, setWeather] = useState<WeatherInfo>();
  const [forecast, setForecast] = useState<WeatherInfo[]>();
  const [location, setLocation] = useState<Location.LocationObject>();
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    if (location) {
      fetchWeather();
      fetchForcast();
    }
  }, [location]);

  // FetchWeather function for current weather data.
  const fetchWeather = async () => {
    if (!location) {
      return;
    }
    const WeatherAns = await fetch(
      `${Base_URL}/weather?lat=${location.coords.latitude}&lon=${location.coords.longitude}&appid=${Open_Weather_Key}&units=metric`
    );
    const WeatherData = await WeatherAns.json(); // This is written in the JSON mode. lke Proper Json mode.

    // console.log(JSON.stringify(WeatherData, null, 2)); // Json stringify is the method which converts the objects into the string. Where the parameters are val, replacer, Space_number.
    setWeather(WeatherData);
  };

  // FetchForecast function for days of weather like 1 - 16 days or between.
  const fetchForcast = async () => {
    if (!location) {
      return;
    }
    const ForecastAns = await fetch(
      `${Base_URL}/forecast?lat=${location.coords.latitude}&lon=${location.coords.longitude}&appid=${Open_Weather_Key}&units=metric`
    );
    const ForecastData = await ForecastAns.json(); // This is written in the JSON mode. lke Proper Json mode.

    console.log(
      "Forecast Data:- ",
      JSON.stringify(ForecastData.list.slice(0, 5), null, 2)
    ); // Json stringify is the method which converts the objects into the string. Where the parameters are val, replacer, Space_number.
    setForecast(ForecastData.list);
  };

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

  // Return statement where we have to display the data which has been fetched.
  return (
    <ImageBackground source={{ uri: bg_image}}
    style={styles.container}>
      <View style={{...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0, 0, 0, 0.5)'}}/>

      <Stack.Screen options={{headerShown: false}}/>
      <View style={{flex:1,justifyContent: "center", alignItems: "center"}}>
      {weather && (<>
          <Text style={styles.name}>{weather.name}</Text>
          <Text style={styles.temp}>{Math.round(weather.main.temp)}°C</Text>
        </>
      )}
      </View>

      <FlatList
        data={forecast}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ height:110, flexGrow:0, marginBottom:40}}
        contentContainerStyle={{gap:10, paddingHorizontal:10}}
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
    fontWeight:"bold",
    fontFamily: "Times New Roman",
  },
});


// Exporting for other files to import it with out curly brackets.
export default Weather;
