import { createDrawerNavigator } from "@react-navigation/drawer";
import StackNavigator from "./StackNavigator";
import CustomDrawerContent from "./CustomDrawerContent";
import { Dimensions } from "react-native";
import Header from "../components/Header";

const Drawer = createDrawerNavigator();
const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      initialRouteName="StackNavigator"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        header: (props: any) => <Header {...props} />,
        drawerStyle: {
          width: Dimensions.get("window").width,
        },
      }}
    >
      <Drawer.Screen name="StackNavigator" component={StackNavigator} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
