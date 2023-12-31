import React from "react";
import { KeyboardTypeOptions, StyleSheet, TextInput, View } from "react-native";
import RemixIcon from "react-native-remix-icon";

interface AppTextInputProps {
  value: string;
  placeholder: string;
  onChangeText: any;
  onKeyPress?: any;
  icon: string;
  type?: KeyboardTypeOptions;
  secureTextEntry?: boolean;
  autoFocus?: boolean;
  style?: any;
}

const AppTextInput = ({
  value,
  icon,
  type,
  placeholder,
  onChangeText,
  onKeyPress,
  secureTextEntry = false,
  autoFocus = false,
  style,
}: AppTextInputProps) => {
  return (
    <View style={{ ...style }}>
      <RemixIcon name={icon} style={styles.icon} color="#667085" size={23} />

      <TextInput
        style={styles.input}
        placeholder={placeholder}
        onChangeText={onChangeText}
        keyboardType={type}
        secureTextEntry={secureTextEntry}
        placeholderTextColor="#667085"
        onKeyPress={onKeyPress}
        value={value}
        autoFocus={autoFocus}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontWeight: "500",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 7.5,
    height: 43,
    paddingHorizontal: 15,
    fontSize: 16,
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 2,

    backgroundColor: "#ffffff",
    borderColor: "#D0D5DD",
    color: "#000000",
    shadowColor: "#D0D5DD",

    paddingLeft: 40,
  },
  icon: {
    position: "absolute",
    top: 10,
    left: 10,
    zIndex: 9,
    color: "#D0D5DD",
  },
});

export default AppTextInput;
