import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import BackBtn from "./BackBtn";
import AppTextInput from "./AppTextInput";
import AppList from "./AppList";
import AppText from "./AppText";
import RemixIcon from "react-native-remix-icon";

const AsyncSearchInput = ({
  loadOptions,
  value,
  onChange,
  placeholder,
  onCancel,
}: any) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    loadOptions('', setData);
  }, []);

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 15,
        }}
      >
        <BackBtn />

        <AppTextInput
          placeholder={placeholder}
          icon="search-line"
          value={value}
          onChangeText={(text: string) => loadOptions(text, setData)}
          style={{ flex: 1 }}
        />

        <TouchableOpacity
          style={{
            marginLeft: 10,
          }}
          onPress={onCancel}
        >
          <RemixIcon name="close-line" />
        </TouchableOpacity>
      </View>

      <AppList
        data={data}
        renderItem={(item: any) => {
          return (
            <TouchableOpacity
              onPress={() => onChange(item)}
              style={styles.menu}
            >
              <AppText style={styles.name}>{item.label}</AppText>
            </TouchableOpacity>
          );
        }}
        noDataContent={`Sorry, the keyword you entered cannot be found, please check again or search with another keyword.`}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  menu: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#EAECF0",
    marginVertical: 8,
    padding: 10,
  },
  name: {
    fontSize: 16,
    color: "#344054",
    fontWeight: "500",
  },
});

export default AsyncSearchInput;
