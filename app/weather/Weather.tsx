import Constants from "expo-constants";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import React, { useEffect, useState } from "react";
import * as Location from "expo-location";

const Base_URL = `https://api.openweathermap.org/data/2.5`;

const Open_Weather_Key = Constants.expoConfig?.extra?.expoPublicOpenWeatherKey;

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
type WeatherInfo = {
  name: string;
  main: MainWeather;
};

const Weather = () => {
  const [weather, setWeather] = useState<WeatherInfo>();
  const [Forecase, setForecast] = useState<WeatherInfo[]>();
  const [location, setLocation] = useState<Location.LocationObject>();
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    if (location) 
      {
        fetchWeather();
        fetchForcast();
      }
  }, [location]);

  const fetchWeather = async () => {
  
        if (!location) 
          {
            return;
          }
          const WeatherAns = await fetch(`${Base_URL}/weather?lat=${location.coords.latitude}&lon=${location.coords.longitude}&appid=${Open_Weather_Key}&units=metric`);
          const WeatherData = await WeatherAns.json(); // This is written in the JSON mode. lke Proper Json mode.
  
        // console.log(JSON.stringify(WeatherData, null, 2)); // Json stringify is the method which converts the objects into the string. Where the parameters are val, replacer, Space_number.
        setWeather(WeatherData);
     
    };

  const fetchForcast = async () => {
  
        if (!location) 
          {
            return;
          }
        const ForecastAns = await fetch(`${Base_URL}/forecast?lat=${location.coords.latitude}&lon=${location.coords.longitude}&appid=${Open_Weather_Key}&units=metric`);
        const ForecastData = await ForecastAns.json(); // This is written in the JSON mode. lke Proper Json mode.
  
        console.log("Forecast Data:- ",JSON.stringify(ForecastData.list.slice(0, 5), null, 2)); // Json stringify is the method which converts the objects into the string. Where the parameters are val, replacer, Space_number.
        setForecast(ForecastData.list);
    };
  


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

  return (
    <View style={styles.container}>
      {weather && (
        <>
          <Text style={styles.text1}>{weather.name}</Text>
          <Text style={styles.text1}>{weather.main.temp}°C</Text>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "yellow",
    justifyContent: "center",
    alignItems: "center",
  },
  text1: {
    color: "black",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 70,
    fontFamily: "Inter",
  },
  text: {
    flex: 0.5,
    color: "black",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Weather;
