import { Button, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { Dropdown, SelectCountry } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter } from "expo-router";

const countries = [
  { label: "India", value: "india" },
  { label: "USA", value: "usa" },
];
const statesData: { [key: string]: { label: string; value: string }[] } = {
  india: [
    { label: "Andhra Pradesh", value: "ap" },
    { label: "Bihar", value: "bihar" },
    { label: "Delhi", value: "delhi" },
    { label: "Maharashtra", value: "maharashtra" },
    { label: "Tamil Nadu", value: "tamil_nadu" },
  ],
  usa: [
    { label: "California", value: "california" },
    { label: "Texas", value: "texas" },
    { label: "Florida", value: "florida" },
    { label: "New York", value: "new_york" },
  ],
};
// const data3 = [
//   { label: "item31", value: "1" },
//   { label: "item32", value: "2" },
//   { label: "item33", value: "4" },
//   { label: "item34", value: "3" },
//   { label: "item35", value: "5" },
// ];

const DumScreen = () => {
  const router = useRouter();
  const [Selection, setSelection] = useState<{
    country: string | null;
    state: string | null;
  }>({ country: null, state: null });
  const [states, setStates] = useState<{ label: string; value: string }[]>([]);

  const handleCountry = (item: { label: string; value: string }) => {
    setSelection({ country: item.value, state: null });
    setStates(statesData[item.value] || []); // Update states based on selected country
  };

  const handleStateChange = (item: any) => {
    setSelection({ ...Selection, state: item.value });
  };

  /*
  ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  || Change here @1 :- link of the API to weather.tsx where i have to take the cordinates from the API @1 and give it to the weather API @2 such that it will be showing the weather acc..ly. ||
  ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
*/
const fetchCoordinates = async (country: string, state: string) => {
  const apiUrl = `https://maps.gomaps.pro/maps/api/geocode/json?address=${country}%20${state}&language=en&region=en&key=AlzaSyc702FzbhNY6FEixiVF6WpSXP0Ht_uZ6YC`;
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    if (data.results && data.results[0]) {
      const { lat, lng } = data.results[0].geometry.location;
      return { lat, lng };
    } else {
      console.error("No results found for these coordinates.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching coordinates:", error);
    return null;
  }
};

  const handleSubmit = async () => {
    if (!Selection.country || !Selection.state) {
      alert("Please select both country and state.");
      return;
    }

    // Fetch coordinates based on selected country and state
    const coordinates = await fetchCoordinates(
      Selection.country,
      Selection.state
    );

    if (coordinates) {
      const { lat, lng } = coordinates;
      // Pass these coordinates to the weather API
      router.push(`/weather?lat=${lat}&lng=${lng}`);
    } else {
      alert("Unable to fetch coordinates. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      {/* DropDown Component */}

      {/* 1 */}
      <Text style={styles.text}> Select the Country </Text>
      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={countries}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder="Select Country"
        searchPlaceholder="Search..."
        value={Selection.country}
        onChange={handleCountry}
        renderLeftIcon={() => (
          <AntDesign
            style={styles.icon}
            color="black"
            name="Safety"
            size={20}
          />
        )}
      />

      {/* 2 */}
      <Text style={styles.text}> Select the State </Text>
      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={states}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder="Select item"
        searchPlaceholder="Search..."
        value={Selection.state}
        onChange={handleStateChange}
        renderLeftIcon={() => (
          <AntDesign
            style={styles.icon}
            color="black"
            name="Safety"
            size={20}
          />
        )}
      />

      {/* 3 */}
      {/* <Text style = {styles.text}> Select the City </Text> */}
      {/* <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={data3}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder="Select item"
        searchPlaceholder="Search..."
        value={value3}
        onChange={(item) => {
          setValue3(item.value);
        }}
        renderLeftIcon={() => (
          <AntDesign
            style={styles.icon}
            color="black"
            name="Safety"
            size={20}
          />
        )}
      /> */}
      <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20, // Added padding for top-left alignment
    alignItems: "flex-start", // Align items to the left
    backgroundColor: "#e0f7fa",
  },
  text: {
    fontSize: 18, // Adjusted font size
    fontWeight: "bold",
    color: "#00796b",
    marginBottom: 8, //
  },
  dropdown: {
    marginBottom: 16, // Space between dropdowns
    height: 50,
    width: "100%", // Adjusted width for better alignment
    borderBottomColor: "gray",
    borderBottomWidth: 0.5,
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  submitButton: {
    width: "100%",
    paddingVertical: 15,
    backgroundColor: "#007BFF",
    alignItems: "center",
    borderRadius: 5, // Optional for rounded corners
  },
  submitButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

// drop down
// ABCD text
// submit button
// weather App open

export default DumScreen;