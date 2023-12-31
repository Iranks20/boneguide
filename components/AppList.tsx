import React from "react";
import { View } from "react-native";
import Loading from "./Loading";
import NoData from "./NoData";

interface AppListProps {
  loading?: boolean;
  data: any[];
  renderItem: any;
  noDataContent?: string;
}

const AppList = ({ loading = false, data, renderItem }: AppListProps) => {
  if (loading) return <Loading />;

  if (!data || data.length === 0)
    return (
      <NoData
        title="Oops! No results found."
        content="Please try again with different keywords."
      />
    );

  return (
    <>
      {data.map((item: any, index: number) => (
        <View key={`app-list-item-${index}`}>
          <View key={`app-list-${index}`}>{renderItem(item, index)}</View>

          {index < data.length - 1 && (
            <View
              style={{
                height: 1,
                marginHorizontal: 10,
              }}
            />
          )}
        </View>
      ))}
    </>
  );
};

export default AppList;
