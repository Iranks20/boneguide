import React from "react";
import { StyleProp, Text } from "react-native";
import {
  useFonts,
  Inter_100Thin,
  Inter_200ExtraLight,
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
  Inter_900Black,
} from "@expo-google-fonts/inter";

interface AppTextProps {
  style?: StyleProp<any>;
  onPress?: any;
  children: any;
}

const AppText = ({ style, children, onPress }: AppTextProps) => {
  let [fontsLoaded] = useFonts({
    Inter_100Thin,
    Inter_200ExtraLight,
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    Inter_900Black,
  });

  if (!fontsLoaded) {
    return null;
  }

  const fontFamily = () => {
    if (!style || !style?.fontWeight) return null;

    switch (style.fontWeight) {
      case "100":
        return "Inter_100Thin";
      case "200":
        return "Inter_200ExtraLight";
      case "300":
        return "Inter_300Light";
      case "400":
        return "Inter_400Regular";
      case "500":
        return "Inter_500Medium";
      case "600":
        return "Inter_600SemiBold";
      case "700":
        return "Inter_700Bold";
      case "800":
        return "Inter_800ExtraBold";
      case "900":
        return "Inter_900Black";
      default:
        return null;
    }
  };

  return (
    <Text onPress={onPress} style={{ ...style, fontFamily: fontFamily() }}>
      {children}
    </Text>
  );
};

export default AppText;
