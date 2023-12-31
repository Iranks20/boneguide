import React from "react";
import { useNavigation } from "@react-navigation/native";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import AppText from "./AppText";
import LogoSvg from "./svgs/LogoSvg";

const Logo = () => {
  const navigation = useNavigation<any>();

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => navigation.navigate("LandingScreen")}
    >
      <View style={{ marginTop: 10 }}>
        <LogoSvg />
      </View>

      <AppText style={styles.logoText}>BoneGuide</AppText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoText: {
    fontSize: 17,
    fontWeight: "900",
    lineHeight: 25,
    color: "#344054",
  },
});

export default Logo;
