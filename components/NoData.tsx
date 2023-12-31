import React from "react";
import { Image, StyleSheet, View } from "react-native";
import AppText from "./AppText";

interface NoDataProps {
  title: string;
  content: string;
}

const NoData = ({ title, content }: NoDataProps) => {
  return (
    <View style={styles.noDataContainer}>
      <Image
        source={require("../assets/search-icon.png")}
        style={{
          width: 150,
          height: 150,
        }}
      />

      <AppText style={styles.noDataTitle}>{title}</AppText>
      <AppText style={styles.noDataContent}>{content}</AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  noDataContainer: {
    alignItems: "center",
    marginTop: 30,
    marginBottom: 40,
    paddingHorizontal: 40,
  },
  noDataTitle: {
    marginTop: 20,
    marginBottom: 15,
    color: "#101828",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
    lineHeight: 28,
    letterSpacing: -0.36,
  },
  noDataContent: {
    color: "#475467",
    textAlign: "center",
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
  },
});

export default NoData;
