import React from "react";
import { View } from "react-native";
import NodeElement from "../models/NodeElement";
import AppList from "./AppList";
import MenuItem from "./MenuItem";
import Maintenance from "./Maintenance";
import TipTapView from "./TipTapView";

interface NodeViewProps {
  isMaintenanceMode: any;
  children: any;
  content: any;
}

const NodeView = ({ isMaintenanceMode, children, content }: NodeViewProps) => {
  if (isMaintenanceMode) return <Maintenance />;

  return (
    <View>
      {content && <TipTapView content={content} />}

      {children.length > 0 && (
        <View style={{ marginTop: 15 }}>
          <AppList
            data={children}
            renderItem={(node: NodeElement) => {
              return <MenuItem nodeElement={node} />;
            }}
            loading={false}
          />
        </View>
      )}
    </View>
  );
};

export default NodeView;
