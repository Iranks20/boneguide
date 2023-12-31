import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import Screen from "../components/Screen";
import { callEndpoint } from "../utils/api";
import Switcher from "../components/Switcher";
import TipTapView from "../components/TipTapView";
import BackBtn from "../components/BackBtn";

const LegalScreen = () => {
  const [content, setContent] = useState(null);
  const [legalIndex, setLegalIndex] = useState(0);

  const load = async () => {
    try {
      const { messageType, data } = await callEndpoint({
        endpoint: `application/${legalIndex == 0 ? "terms" : "privacy"}`,
      });

      if (messageType == "success") {
        if (data) {
          setContent(JSON.parse(`${data}`));
        }
      }
    } catch (e) {}
  };

  useEffect(() => {
    load();
  }, [legalIndex]);

  return (
    <Screen>
      <BackBtn />

      <Switcher
        data={[
          {
            id: 0,
            text: "Terms and conditions",
          },
          {
            id: 1,
            text: "Privacy policy",
          },
        ]}
        currentId={legalIndex}
        onSwitch={(id: any) => setLegalIndex(id)}
      />

      {content && <TipTapView content={content} />}
    </Screen>
  );
};

const styles = StyleSheet.create({
  title: {
    color: "#101828",
    fontSize: 20,
    fontWeight: "600",
    lineHeight: 30,
    marginTop: 15,
  },
});

export default LegalScreen;
