import React from "react";
import Svg, { Path } from "react-native-svg";

const WarningIcon = () => {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} fill="none">
      <Path
        stroke="#DC6803"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.667}
        d="M10 7.5v3.333m0 3.334h.008M8.846 3.243 1.992 15.082c-.38.657-.57.985-.542 1.254a.833.833 0 0 0 .338.588c.22.16.599.16 1.358.16h13.708c.759 0 1.138 0 1.357-.16a.833.833 0 0 0 .339-.588c.028-.27-.162-.597-.542-1.254L11.154 3.243c-.38-.654-.569-.981-.816-1.091a.833.833 0 0 0-.677 0c-.247.11-.436.437-.815 1.091Z"
      />
    </Svg>
  );
};

export default WarningIcon;
