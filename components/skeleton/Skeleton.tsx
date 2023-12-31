import React, { useState } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { skeletonCoordinates } from "./skeleton-data";
import AppText from "../AppText";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

const WIDTH = Dimensions.get("window").width - 30;
const HEIGHT = WIDTH*2.6;

interface SkeletonProps {
  nodes: any[];
  age: "adult" | "paediatrics";
}

const Skeleton = ({ nodes, age = "adult" }: SkeletonProps) => {
  const navigation = useNavigation<StackNavigationProp<any>>();

  const [ready, setReady] = useState(false);

  function getNode(nodeTitle: string) {
    let source = skeletonCoordinates[nodeTitle.toLowerCase()];
    let x = source ? source[age].x : 0;
    let y = source ? source[age].y : 0;

    return { x, y, position: source?.position };
  }

  function placeNode(node: any) {
    const { x, y, position } = getNode(node.title);
    return { ...node, x, y, position };
  }

  function placeNodes(nodes: any[]) {
    return nodes.map((node) => placeNode(node));
  }

  return (
    <View
      style={{
        position: "relative",
        overflow: "visible",
      }}
    >
      {placeNodes(nodes).map(({ id, title, x, y, position }) => {
        if (!x || !y) return null;

        return (
          <View
            key={`skeleton-node-${id}`}
            style={{
              position: "absolute",
              zIndex: 9,
              top: (y * HEIGHT) / 100 - 17,
              left: (x * WIDTH) / 100 - 17,
            }}
          >
            <View
              style={{
                ...styles.skeletonPoint,
                width: 40,
                height: 40,
                backgroundColor: "rgba(71, 111, 252, 0.1)",
              }}
            >
              <View
                style={{
                  ...styles.skeletonPoint,
                  width: 24,
                  height: 24,
                  backgroundColor: "rgba(71, 111, 252, 0.2)",
                }}
              >
                <View
                  style={{
                    ...styles.skeletonPoint,
                    width: 8,
                    height: 8,
                    backgroundColor: "#476ffc",
                  }}
                />
              </View>
            </View>

            <TouchableOpacity
              onPress={() => navigation.navigate("NodeScreen", { nodeId: id })}
              style={{
                borderRadius: 16,
                alignItems: "center",
                backgroundColor: "#476ffc",
                paddingVertical: 2,
                paddingHorizontal: 6,

                ...(position == "top-left" && {
                  top: -50,
                  left: -50,
                }),
                ...(position == "top-right" && {
                  top: -50,
                  right: -30,
                }),
                ...(position == "right" && { left: 30, top: -30 }),
                ...(position == "left" && { right: "80%", top: -30 }),
                ...(position == "bottom" && { top: -10, left: -15 }),
              }}
            >
              <AppText
                style={{
                  fontWeight: 500,
                  fontSize: 13,
                  color: "white",
                }}
              >
                {title}
              </AppText>
            </TouchableOpacity>
          </View>
        );
      })}

      {age == "adult" && (
        <Image
          source={require("../../assets/skeleton/adult.png")}
          style={{
            ...styles.skeletonImage,
            ...(!ready && { opacity: 0 }),
          }}
          onLoadStart={() => setReady(false)}
          onLoadEnd={() => setReady(true)}
        />
      )}

      {age == "paediatrics" && (
        <Image
          source={require("../../assets/skeleton/paediatric.png")}
          style={{
            ...styles.skeletonImage,
            ...(!ready && { opacity: 0 }),
          }}
          onLoadStart={() => setReady(false)}
          onLoadEnd={() => setReady(true)}
        />
      )}
    </View>
  );
};

export default Skeleton;

const styles = StyleSheet.create({
  skeletonPoint: {
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },

  skeletonImage: {
    width: WIDTH,
    height: HEIGHT,
    resizeMode: "contain",
  },
});
