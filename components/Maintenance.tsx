import React from "react";
import Screen from "./Screen";
import NoData from "./NoData";

const Maintenance = () => {
  return (
    <Screen
      style={{
        flex: 1,
        justifyContent: "center",
      }}
    >
      <NoData
        title=" BoneGuide App Undergoing Maintenance."
        content="BoneGuide app is temporarily unavailable. Our team is working on improving the app's performance. We apologize for any inconvenience and appreciate your patience."
      />
    </Screen>
  );
};

export default Maintenance;
