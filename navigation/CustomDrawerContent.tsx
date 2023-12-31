import React from "react";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import AppText from "../components/AppText";
import ShareApp from "../components/ShareApp";
import Logo from "../components/Logo";
import Icon from "react-native-remix-icon";
import { DrawerActions, useNavigation } from "@react-navigation/native";

const CustomDrawerContent = (props: any) => {
  const navigation = useNavigation();

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={styles.container}
    >
      <View style={styles.innerContainer}>
        <View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 15,
              paddingVertical: 10,
              borderBottomColor: "#EEF4FF",
              borderBottomWidth: 1,
            }}
          >
            <Logo />

            <TouchableOpacity
              onPress={() => navigation.dispatch(DrawerActions.closeDrawer())}
              style={{
                width: 40,
                height: 50,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Icon name="close-line" color="#667085" size={30} />
            </TouchableOpacity>
          </View>

          <View style={styles.block}>
            <TouchableOpacity style={styles.menuItem}>
              <AppText style={styles.menuItemText}>About us</AppText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <AppText style={styles.menuItemText}>
                Terms and conditions
              </AppText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <AppText style={styles.menuItemText}>Privacy Policy</AppText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <AppText style={styles.menuItemText}>Pricing</AppText>
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={{
            ...styles.block,
            borderTopColor: "#EEF4FF",
            borderTopWidth: 1,
          }}
        >
          <ShareApp />
        </View>
      </View>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  block: {
    paddingHorizontal: 15,
    paddingVertical: 25,
  },
  menuItem: {
    paddingVertical: 15,
  },
  menuItemText: {
    color: "#101828",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default CustomDrawerContent;
