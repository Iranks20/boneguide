import React, { FC, ReactElement, useRef, useState } from "react";
import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
  View,
} from "react-native";
import RemixIcon from "react-native-remix-icon";
import { colors } from "../utils/colors";
import AppButton from "./AppButton";
import AppText from "./AppText";

interface Props {
  label: string;
  data: Array<{ label: string; value: string }>;
  onSelect: (item: { label: string; value: string }) => void;
}

const AppDropdown: FC<Props> = ({ label, data, onSelect }) => {
  const DropdownButton: any = useRef();
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState<any>(undefined);

  const onItemPress = (item: any): void => {
    setSelected(item);
    onSelect(item);
    setVisible(false);
  };

  const renderItem = ({ item }: any): ReactElement<any, any> => (
    <TouchableOpacity style={styles.item} onPress={() => onItemPress(item)}>
      <AppText style={styles.itemText}>{item.label}</AppText>
    </TouchableOpacity>
  );

  return (
    <>
      <Modal
        animationType={"slide"}
        transparent={false}
        visible={visible}
        onRequestClose={() => {
          console.log("Modal has been closed.");
        }}
      >
        <View style={styles.modal}>
          <AppText style={styles.modalTitle}>Choose a hospital</AppText>

          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
          />

          <AppButton
            text="Close"
            theme="light"
            onPress={() => setVisible(false)}
            style={{ marginTop: 30 }}
          />
        </View>
      </Modal>

      <TouchableOpacity
        ref={DropdownButton}
        style={styles.button}
        onPress={() => setVisible(true)}
      >
        <AppText style={styles.buttonText}>
          {(!!selected && selected.label) || label}
        </AppText>

        <View style={styles.buttonChange}>
          <AppText style={styles.buttonChangeText}>Change</AppText>
          <RemixIcon name="arrow-right-line" color={colors.MAIN} size={15} />
        </View>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#EEF4FF",
    borderRadius: 8,
    paddingHorizontal: 5,
    paddingLeft: 10,
    paddingVertical: 4,
    zIndex: 1,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.MAIN,
    flex: 0.7
  },
  buttonChange: {
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 100,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  buttonChangeText: {
    color: colors.MAIN,
    fontSize: 12,
    fontWeight: "500",
    marginRight: 5
  },

  item: {
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: "#eeeeee",
  },
  itemText: {
    fontSize: 16,
    fontWeight: "500",
  },

  modal: {
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 20,
  },
});

export default AppDropdown;
