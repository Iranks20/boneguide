import React from "react";
import { View, StyleSheet, ScrollView, SafeAreaView } from "react-native";

interface ScreenProps {
  children: any;
  style?: any;
  innerStyle?: any;
  showFooter?: boolean;
}

const Screen = ({ style, children, innerStyle }: ScreenProps) => {
  return (
    <SafeAreaView style={{ ...styles.container }}>
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={{
            ...style,
            flexGrow: 1,
          }}
        >
          <View style={{ ...styles.inner, ...innerStyle }}>{children}</View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  inner: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    flex: 1,
  },
});

export default Screen;
