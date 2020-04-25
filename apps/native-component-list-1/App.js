import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Constants from "expo-constants";
import * as Linking from "./Linking";
// import { Linking } from "expo";

export default function App() {
  console.log(Linking.makeUrl("bacon"));
  console.log(Constants.manifest.developer);
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
    </View>
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
