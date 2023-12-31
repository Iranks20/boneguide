import React, { useState } from "react";
import { View, Dimensions, StyleSheet } from "react-native";
import Carousel, { Pagination } from "react-native-snap-carousel";
import Screen from "../components/Screen";
import { colors } from "../utils/colors";
import AppText from "../components/AppText";
import AppButton from "../components/AppButton";
import Hr from "../components/Hr";

const WelcomeScreen = () => {
  const [activeSlide, setActiveSlide] = useState(0);

  return (
    <View style={styles.screen}>
      <View style={styles.slider}>
        <View style={styles.sliderItem}>
          <AppText style={styles.title}>
            Welcome to BoneGuide
          </AppText>
          <AppText style={styles.content}>
            Your pocket guide for confident fracture management. Access
            comprehensive information at your fingertips to make informed
            bedside decisions.
          </AppText>
        </View>
      </View>

      <Hr />

      <View style={styles.bottomView}>
        <AppButton
          style={{ ...styles.btn, marginRight: 15 }}
          text="Skip"
          onPress={() => console.log()}
          theme="light"
        />
        <AppButton
          style={styles.btn}
          text="Next"
          onPress={() => console.log()}
        />
      </View>
    </View>
  );

  //   return (
  //     <Screen>
  //       <Carousel
  //         data={[
  //           {
  //             title: "Welcome to BoneGuide",
  //             content:
  //               "Your pocket guide for confident fracture management. Access comprehensive information at your fingertips to make informed bedside decisions.",
  //           },
  //           {
  //             title: "Welcome to BoneGuide",
  //             content:
  //               "Your pocket guide for confident fracture management. Access comprehensive information at your fingertips to make informed bedside decisions.",
  //           },
  //         ]}
  //         renderItem={({ item }) => (
  //           <View
  //             style={{
  //               paddingHorizontal: 25,
  //               paddingBottom: 10,
  //             }}
  //           >
  //             <View>
  //               <AppText>{item.title}</AppText>
  //               <AppText>{item.content}</AppText>
  //             </View>

  //             <View style={{ marginTop: 40 }}>
  //               <Pagination
  //                 dotsLength={3}
  //                 activeDotIndex={activeSlide}
  //                 containerStyle={{
  //                   marginTop: -45,
  //                 }}
  //                 dotStyle={{
  //                   width: 20,
  //                   height: 5,
  //                   borderRadius: 5,
  //                   backgroundColor: colors.MAIN,
  //                   marginHorizontal: -7,
  //                 }}
  //                 inactiveDotStyle={{
  //                   width: 5,
  //                   borderRadius: 5,
  //                   backgroundColor: "red",
  //                 }}
  //                 inactiveDotOpacity={1}
  //                 inactiveDotScale={1}
  //               />
  //             </View>
  //           </View>
  //         )}
  //         sliderWidth={Dimensions.get("window").width}
  //         itemWidth={Dimensions.get("window").width}
  //         activeSlideAlignment="start"
  //         inactiveSlideOpacity={1}
  //         inactiveSlideScale={1}
  //         onSnapToItem={(index) => setActiveSlide(index)}
  //       />
  //     </Screen>
  // );
};

const styles = StyleSheet.create({
  screen: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    flex: 1,
  },
  slider: {
    flex: 1,
  },
  sliderItem: {
    paddingHorizontal: 25,
  },
  title: {
    fontSize: 32,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 20,
  },
  content: {
    fontSize: 16,
    fontWeight: "400",
    textAlign: "center",
    color: "#424242",
  },
  bottomView: {
    flexDirection: "row",
    paddingVertical: 20,
  },
  btn: {
    flex: 1,
  },
});

export default WelcomeScreen;
