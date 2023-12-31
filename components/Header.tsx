import React, { useState, useEffect, useContext } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AnimatedSearchbox from "./AnimatedSearchbox";
import Logo from "./Logo";
import Icon from "react-native-remix-icon";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import GlobalContext from "../contexts/GlobalContext";

const Header = () => {
  const navigation: any = useNavigation();

  const { searchQuery } = useContext(GlobalContext);

  const [searchOpened, setSearchOpened] = useState(false);
  const [refSearchBox, setRefSearchBox] = useState<any>(null);
  const [searchIconColor, setSearchIconColor] = useState("#555");

  useEffect(() => {
    if (searchQuery) {
      navigation.navigate("LandingScreen");
    }
  }, [searchQuery]);

  return (
    <>
      <View style={styles.container}>
        {!searchOpened && <Logo />}

        <View style={styles.searchContainer}>
          <AnimatedSearchbox
            ref={(ref) => setRefSearchBox(ref)}
            placeholder={"Search"}
            searchIconColor={searchIconColor}
            onClosed={() => {
              setSearchIconColor("#fff");
            }}
            onOpening={() => {
              setSearchIconColor("#555");
            }}
            setSearchOpened={setSearchOpened}
          />
        </View>

        {!searchOpened && (
          <TouchableOpacity
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
            style={{
              width: 40,
              height: 50,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Icon name="more-fill" />
          </TouchableOpacity>
        )}
      </View>

      <LinearGradient
        colors={["#e3edfe", "#adcbfc", "#e1efed", "#eefae7", "#eefae6"]}
        start={[0, 1]}
        end={[1, 0]}
        style={styles.borderBottom}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-between",

    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  borderBottom: {
    height: 5,
  },

  searchContainer: {
    flex: 1,
  },

  buttonsArea: {
    flex: 1,
    marginBottom: 15,
    justifyContent: "flex-end",
  },
  row: {
    flex: 1,
    justifyContent: "center",
    flexDirection: "row",
    marginLeft: -10,
    marginRight: -10,
    maxHeight: 50,
    marginTop: 5,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.80)",
    margin: 10,
    height: 40,
    borderRadius: 40,
  },
  buttonText: {
    fontWeight: "bold",
    color: "#555",
  },
});

export default Header;
