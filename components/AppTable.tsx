import React from "react";
import { StyleSheet, View, ScrollView, PanResponder } from "react-native";
import { Table } from "react-native-table-component";

export default function AppTable({ children, style, borderStyle }: any) {
  const panResponder = React.useMemo(() => {
    let isHorizontalScroll = false;
    let isVerticalScroll = false;

    return PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        // Check if the movement is mostly horizontal
        isHorizontalScroll = Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
        isVerticalScroll = !isHorizontalScroll;
        return isHorizontalScroll || isVerticalScroll;
      },
      onPanResponderMove: (evt, gestureState) => {
        if (isHorizontalScroll) {
          // Handle horizontal scroll
          console.log('Horizontal Scroll');
        } else if (isVerticalScroll) {
          // Handle vertical scroll
          console.log('Vertical Scroll');
        }
      },
    });
  }, []);

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <ScrollView horizontal>
        <View>
          <ScrollView style={styles.dataWrapper}>
            <Table style={style} borderStyle={borderStyle}>
              {children}
            </Table>
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}




// export default function AppTable({ children, style, borderStyle }: any) {
//   return (
//     <View style={styles.container}>
//       <ScrollView horizontal>
//         <View>
//           <ScrollView style={styles.dataWrapper}>
//             <Table style={style} borderStyle={borderStyle}>
//               {children}
//             </Table>
//           </ScrollView>
//         </View>
//       </ScrollView>
//     </View>
//   );
// }

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: { backgroundColor: "#537791" },
  text: { textAlign: "center" },
  dataWrapper: {
    marginVertical: 10
  },
  row: { backgroundColor: "#E7E6E1" },
});
