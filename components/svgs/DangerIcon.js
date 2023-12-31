import React from "react";
import Svg, { ClipPath, Path, Defs, G } from "react-native-svg";

const DangerIcon = () => {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} fill="none">
      <G clipPath="url(#a)">
        <Path
          stroke="#D92D20"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.667}
          d="M10 6.667V10m0 3.333h.008M18.333 10a8.333 8.333 0 1 1-16.666 0 8.333 8.333 0 0 1 16.666 0Z"
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

export default DangerIcon;
