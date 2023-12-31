import React from "react";
import Svg, { Path, Defs, G, ClipPath } from "react-native-svg";

const SuccessIcon = () => {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} fill="none">
      <G clipPath="url(#a)">
        <Path
          stroke="#039855"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.667}
          d="m6.25 10 2.5 2.5 5-5m4.583 2.5a8.333 8.333 0 1 1-16.666 0 8.333 8.333 0 0 1 16.666 0Z"
        />
      </G>
      <Defs>
        <ClipPath id="a">
          <Path fill="#fff" d="M0 0h20v20H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
};

export default SuccessIcon;
