import React, { useEffect, useState } from "react";
import { Image, View, useWindowDimensions } from "react-native";

interface AppImageProps {
  uri: string;
  initialWidth?: number;
  style?: any;
}

const AppImage = ({ uri, initialWidth = 0, style = {} }: AppImageProps) => {
  const { width: screenWidth } = useWindowDimensions();
  const [loading, setLoading] = useState(true);

  const [size, setSize] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    Image.getSize(uri, (width, height) => {
      let newWidth = initialWidth || width;

      const space = 100;
      if (newWidth > screenWidth) newWidth = screenWidth - space;

      setSize({
        width: newWidth,
        height: (height / width) * newWidth,
      });

      setLoading(false);
    });
  }, []);

  if (loading) return null;

  return (
    <View>
      <Image
        source={{ uri }}
        resizeMode="contain"
        style={{
          ...style,
          width: size.width,
          height: size.height,
        }}
      />
    </View>
  );
};

export default AppImage;
