import React from "react";
import { Image, StyleSheet, View, ActivityIndicator } from "react-native";
import AppText from "../components/AppText";
import {colors} from "../utils/colors";


// interface NoDataProps {
//   title: string;
//   content: string;
// }
interface LoadingScreenProps {
    checkingUpdates: boolean;
    downloading: boolean;
    offlineUpdate: boolean;
    isCheckingLatestUpdated: boolean;
  }

  const LoadingScreen: React.FC<LoadingScreenProps> = ({ checkingUpdates, downloading, offlineUpdate, isCheckingLatestUpdated }) => {
    let title, content, showActivityIndicator = true;
  
    if (offlineUpdate) {
      title = "Missing Update!";
      content = "Connect online to download latest fracture guidelines for seamsless offline use";
      showActivityIndicator = false; 
    } else if (checkingUpdates) {
      title = "Checking for updates...";
      content = "Please wait";
    } else if (downloading) {
      title = "Downloading updates...";
      content = "This may take a moment";
    } else if (isCheckingLatestUpdated) {
      title = "old version !...";
      content = "You current have an old version of this hospital connect online to download the latest version";
      showActivityIndicator = false;
    } else {
      return null;
    }
  
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
        {showActivityIndicator && (
        <ActivityIndicator size="large" color={colors.MAIN} />
      )}
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

export default LoadingScreen;
