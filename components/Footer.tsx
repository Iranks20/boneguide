import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import AppText from "../components/AppText";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

const Footer = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();

  return (
    <View style={styles.container}>
      <View style={styles.item}>
        <TouchableOpacity style={styles.link}>
          <AppText style={styles.linkText}>About us</AppText>
        </TouchableOpacity>
      </View>

      <View style={styles.item}>
        <TouchableOpacity style={styles.link}>
          <AppText style={styles.linkText}>Contact</AppText>
        </TouchableOpacity>
      </View>

      <View style={styles.item}>
        <TouchableOpacity
          style={styles.link}
          onPress={() => navigation.push("LegalScreen")}
        >
          <AppText style={styles.linkText}>Legal</AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  item: {
    width: "50%",
  },
  link: {
    paddingVertical: 8,
  },
  linkText: {
    fontWeight: "600",
    fontSize: 16,
    color: "#475467",
  },
});

export default Footer;
