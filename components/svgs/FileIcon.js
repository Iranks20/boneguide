import React from "react";
import Svg, { Rect, Path } from "react-native-svg";

const FileIcon = () => {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={36}
      height={36}
      fill="none"
    >
      <Rect width={32} height={32} x={2} y={2} fill="#DCDFFF" rx={16} />
      <Path
        stroke="#4353FF"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.333}
        d="M19.333 11.513v2.754c0 .373 0 .56.073.702a.667.667 0 0 0 .291.292c.143.072.33.072.703.072h2.754m.18 1.326v4.808c0 1.12 0 1.68-.219 2.108a2 2 0 0 1-.874.874c-.427.218-.988.218-2.108.218h-4.266c-1.12 0-1.68 0-2.108-.218a2 2 0 0 1-.874-.874c-.218-.428-.218-.988-.218-2.108v-6.934c0-1.12 0-1.68.218-2.108a2 2 0 0 1 .874-.874c.428-.218.988-.218 2.108-.218h2.14c.49 0 .735 0 .965.056a2 2 0 0 1 .578.239c.202.124.375.297.72.643l2.126 2.125c.346.346.519.519.643.72a2 2 0 0 1 .24.579c.054.23.054.475.054.964Z"
      />
      <Rect
        width={32}
        height={32}
        x={2}
        y={2}
        stroke="#F0F4FF"
        strokeWidth={4}
        rx={16}
      />
    </Svg>
  );
};

export default FileIcon;
