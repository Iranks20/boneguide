import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { colors } from "../utils/colors";
import AppText from "./AppText";
import Icon from "react-native-remix-icon";

interface AppButtonProps {
  onPress: any;
  text?: string;
  icon?: string;
  children?: any;
  style?: any;
  styleText?: any;
  disabled?: any;
  theme?: "primary" | "light";
}

const AppButton = ({
  onPress,
  text,
  icon,
  children,
  style,
  styleText,
  theme = "primary",
}: AppButtonProps) => {
  const themeStyle = () => {
    if (theme === "primary")
      return {
        backgroundColor: colors.MAIN,
        borderWidth: 1,
        borderColor: colors.MAIN,
      };

    if (theme === "light")
      return {
        backgroundColor: "#ffffff",
        borderWidth: 1,
        borderColor: "#D0D5DD",
      };
  };

  const themeTextStyle = () => {
    if (theme === "primary")
      return {
        color: "white",
      };

    if (theme === "light")
      return {
        color: "#344054",
      };

    return {
      color: "#000000",
    };
  };

  const buttonContent = () => {
    if (children) return children;

    const additionalTextStyle = themeTextStyle();

    return (
      <>
        {text && (
          <>
            {icon && (
              <Icon
                name={icon}
                size="23"
                color={additionalTextStyle.color}
                style={{
                  marginRight: 8,
                }}
              />
            )}

            <AppText
              style={{ ...styles.text, ...additionalTextStyle, ...styleText }}
            >
              {text}
            </AppText>
          </>
        )}
      </>
    );
  };

  return (
    <TouchableOpacity
      style={[styles.container, themeStyle(), style]}
      onPress={onPress}
    >
      {buttonContent()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 7,
    paddingHorizontal: 18,
    height: 45,
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
  },
});

export default AppButton;
