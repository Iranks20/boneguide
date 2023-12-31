import React, { useCallback } from "react";
import { Alert, Linking, TouchableOpacity } from "react-native";
import AppText from "./AppText";

type OpenURLButtonProps = {
  url: string;
  children: any;
  style?: any;
};

const OpenURLButton = ({ url, children, style }: OpenURLButtonProps) => {
  const handlePress = useCallback(async () => {
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert(`Don't know how to open this URL: ${url}`);
    }
  }, [url]);

  return (
    <AppText
      onPress={handlePress}
      style={{
        ...style,
        color: "#476ffc",
        textDecorationLine: "underline",
      }}
    >
      {children}
    </AppText>
  );
};

export default OpenURLButton;
