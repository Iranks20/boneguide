import React from "react";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import RemixIcon from "react-native-remix-icon";
import { colors } from "../utils/colors";
import AppText from "./AppText";

interface Link {
  screen: string;
  text: string;
  parameters?: any;
}

interface BreadcrumbProps {
  links: Link[];
}

const Breadcrumb = ({ links }: BreadcrumbProps) => {
  const navigation = useNavigation<StackNavigationProp<any>>();

  return (
    <View style={styles.container}>
      {links.map(({ screen, text, parameters }, index) => {
        const isFirst: boolean = index === 1;
        const isNotLast: boolean = index < links.length - 1;

        if (index == 0) return null;
        return (
          <React.Fragment key={`breadcrumb-item-${index}`}>
            <TouchableOpacity
              onPress={() => {
                if (isFirst) navigation.navigate("LandingScreen")
                else navigation.push(screen, parameters);
              }}
            >
              <AppText
                style={{
                  ...styles.text,
                  ...(!isNotLast && styles.activeText),
                }}
              >
                {text}
              </AppText>
            </TouchableOpacity>

            {isNotLast && (
              <View style={{ height: 29 }}>
                <RemixIcon
                  name="arrow-right-s-line"
                  color="#D0D5DD"
                  size={20}
                />
              </View>
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    flexWrap: "wrap",
    marginBottom: 15,
    borderBottomColor: "#EAECF0",
    borderBottomWidth: 1,
    paddingVertical: 5,
  },
  text: {
    fontSize: 15,
    fontWeight: "500",
    color: "#475467",
    marginBottom: 10,
    backgroundColor: "#F5F5F5",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  activeText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.MAIN,
    backgroundColor: "#EEF4FF",
  },
});

export default Breadcrumb;
