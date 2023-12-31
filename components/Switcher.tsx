import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import AppText from "./AppText";

const Switcher = ({ data, currentId, onSwitch, disabled }: any) => {
  if (!data || data.length == 0) return null;

  return (
    <>
      <View style={styles.switcher}>
        {data.map((item: any) => (
          <TouchableOpacity
            key={`switch-${item.id}`}
            onPress={() => onSwitch(item.id)}
            style={{
              ...styles.switcherItem,
              ...(item.id == currentId && styles.switcherItemActive),
            }}
            disabled={disabled}
          >
            <AppText
              style={{
                ...styles.switcherText,
                ...(item.id == currentId && styles.switcherTextActive),
              }}
            >
              {item.text?.trim().split(/\s+/)[0]}
            </AppText>
          </TouchableOpacity>
        ))}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  switcher: {
    flexDirection: "row",
    justifyContent: "space-between",

    padding: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#F2F4F7",
    borderStyle: "solid",
    backgroundColor: "#F9FAFB",
    marginBottom: 15,
  },
  switcherItem: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 6,
    alignItems: "center",

    zIndex: 99,
    flex: 1,
    width: "100%",

    shadowColor: "transparent",
    elevation: 4,
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  switcherItemActive: {
    shadowColor: "#101828",
    backgroundColor: "white",
  },
  switcherText: {
    color: "#667085",
    fontSize: 15,
    fontWeight: "600",
  },
  switcherTextActive: {
    color: "#344054",
  },
});

export default Switcher;
