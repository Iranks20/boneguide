import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import NodeScreen from "../screens/NodeScreen";
import LegalScreen from "../screens/LegalScreen";
import LandingScreen from "../screens/LandingScreen";

const Stack = createStackNavigator();

const StackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: {
          backgroundColor: "white",
        },
      }}
    >
      <Stack.Screen name="LandingScreen" component={LandingScreen} />
      <Stack.Screen name="NodeScreen" component={NodeScreen} />
      <Stack.Screen name="LegalScreen" component={LegalScreen} />
    </Stack.Navigator>
  );
};

export default StackNavigator;
