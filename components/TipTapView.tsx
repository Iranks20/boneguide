import React from "react";
import {
  TipTapRender,
  NodeHandlers,
  NodeHandler,
} from "@troop.com/tiptap-react-render";
import { View, ScrollView, StyleSheet, Image } from "react-native";
import AppText from "./AppText";
import OpenURLButton from "./OpenURLButton";
import DangerIcon from "./svgs/DangerIcon";
import WarningIcon from "./svgs/WarningIcon";
import SuccessIcon from "./svgs/SuccessIcon";
import FileIcon from "./svgs/FileIcon";
import AppImage from "./AppImage";
import { Row, Cell } from "react-native-table-component";
import AppTable from "./AppTable";

const CELL_WIDTH = 300;

const Doc: NodeHandler = ({ children }) => <>{children}</>;

function addColorToContent(content: any, color: any) {
  return {
    ...content,
    props: {
      ...content.props,
      node: {
        ...content.props.node,
        attrs: {
          ...(content.props.node.attrs ? content.props.node.attrs : {}),
          color: color,
        },
      },
    },
  };
}

function addColorToContents(contents: any[], color: any) {
  return contents.map((content: any) => addColorToContent(content, color));
}

function addTextAlignToContent(content: any, textAlign: string) {
  return {
    ...content,
    props: {
      ...content.props,
      node: {
        ...content.props.node,
        attrs: {
          ...(content.props.node.attrs ? content.props.node.attrs : {}),
          textAlign,
        },
      },
    },
  };
}

function addTextAlignToContents(contents: any[], textAlign: string) {
  return contents.map((content: any) =>
    addTextAlignToContent(content, textAlign)
  );
}

const Paragraph: NodeHandler = ({ node, children }) => {
  let content = React.Children.toArray(children);

  content = addColorToContents(content, node.attrs?.color);
  content = addTextAlignToContents(content, node.attrs?.textAlign);

  return (
    <AppText
      style={{
        minHeight: 20,
        flexDirection: "row",
        alignItems: "flex-start",
        flexWrap: "wrap",

        justifyContent:
          node.attrs?.textAlign == "right"
            ? "flex-end"
            : node.attrs?.textAlign == "center"
            ? "center"
            : "flex-start",
      }}
    >
      {content}
    </AppText>
  );
};

const TextNode: NodeHandler = ({ node }) => {
  const { marks = [], text } = node;

  let url = "";

  const style: any = marks?.reduce(
    (acc, mark) => {
      switch (mark.type) {
        case "bold":
          return { ...acc, fontWeight: "bold" };
        case "italic":
          return { ...acc, fontStyle: "italic" };
        case "underline":
          return { ...acc, textDecorationLine: "underline" };
        case "strike":
          return { ...acc, textDecorationLine: "line-through" };

        case "subscript":
          return { ...acc, fontSize: 11, lineHeight: 25 };
        case "superscript":
          return { ...acc, fontSize: 11 };

        case "link":
          url = mark.attrs.href;
          return { ...acc };
        default:
          return { ...acc };
      }
    },
    {
      ...styles.p,
      fontWeight: "normal",
      fontStyle: "normal",
      textDecorationLine: "none",
      textAlign: node.attrs?.textAlign ? node.attrs.textAlign : "left",
      color: node?.attrs?.color || "#475467",
    }
  );

  if (url)
    return (
      <OpenURLButton style={style} url={url}>
        {text}
      </OpenURLButton>
    );

  return <AppText style={style}>{text}</AppText>;
};

const OrderedList: NodeHandler = ({ node, children }) => {
  const listItems = React.Children.map(children, (child, index) => {
    return (
      <View style={styles.li}>
        <AppText
          style={{
            ...styles.p,
            marginRight: 8,
            color: node?.attrs?.color,
          }}
        >
          {index + 1 + "."}
        </AppText>
        <View style={{ flex: 1 }}>
          {addColorToContent(child, node?.attrs?.color)}
        </View>
      </View>
    );
  });

  return <View style={styles.ol}>{listItems}</View>;
};

const ListItem: NodeHandler = ({ node, children }) => {
  let content = React.Children.toArray(children);

  if (content.length) {
    content = addColorToContents(content, node.attrs?.color);
    return <View>{content}</View>;
  }

  return <></>;
};

const BulletList: NodeHandler = ({ node, children }) => {
  const listItems = React.Children.map(children, (child, index) => {
    return (
      <View style={styles.li}>
        <View
          style={{
            width: 5,
            height: 5,
            backgroundColor: node?.attrs?.color
              ? node?.attrs?.color
              : "#64748b",
            borderRadius: 100,
            marginRight: 8,
            marginTop: 9,
          }}
        />
        <View style={{ flex: 1 }}>
          {addColorToContent(child, node?.attrs?.color)}
        </View>
      </View>
    );
  });

  return <View style={styles.ol}>{listItems}</View>;
};

const ImageExtension: NodeHandler = ({ node }: any) => {
  return (
    <AppImage
      uri={node.attrs.src}
      initialWidth={node.attrs.isTable ? CELL_WIDTH - 20 : node.attrs.width}
      style={{ ...styles.img }}
    />
  );
};

const Heading: NodeHandler = ({ node, children }) => {
  let content = React.Children.toArray(children);

  if (content.length) {
    content = addColorToContents(content, node.attrs?.color);
    return <AppText style={styles.h1}>{content}</AppText>;
  }

  return <></>;
};

const Blockquote: NodeHandler = ({ node, children }: any) => {
  let content = React.Children.toArray(children);

  let s: any = {};
  if (node.attrs.className.includes("danger")) {
    s = {
      backgroundColor: "#FFFBFA",
      borderColor: "#FDA29B",
      textColor: "#b42318",
    };
  } else if (node.attrs.className.includes("warning")) {
    s = {
      backgroundColor: "#FFFCF5",
      borderColor: "#FEC84B",
      textColor: "#b54708",
    };
  } else if (node.attrs.className.includes("success")) {
    s = {
      backgroundColor: "#F6FEF9",
      borderColor: "#6CE9A6",
      textColor: "#027a48",
    };
  }

  content = addColorToContents(content, s.textColor);

  return (
    <View
      style={{
        ...styles.alert,
        flexDirection: "row",
        ...s,
      }}
    >
      <View style={{ marginTop: 0, marginRight: 12 }}>
        {node.attrs.className.includes("danger") && <DangerIcon />}
        {node.attrs.className.includes("warning") && <WarningIcon />}
        {node.attrs.className.includes("success") && <SuccessIcon />}
      </View>

      <View style={{ flex: 1 }}>{content}</View>
    </View>
  );
};

const CustomFile: NodeHandler = ({ node }: any) => {
  return (
    <OpenURLButton url={node.attrs.href} style={styles.anchorContainer}>
      <View style={{ marginRight: 8 }}>
        <FileIcon />
      </View>
      <AppText style={styles.anchorText}>{node.attrs.text}</AppText>
    </OpenURLButton>
  );
};

const hardBreak: NodeHandler = ({ node }: any) => {
  return <AppText>{"\n"}</AppText>;
};

const TableHandler: NodeHandler = ({ node, children }: any) => {
  return (
    <AppTable
      style={styles.table}
      borderStyle={{ borderWidth: 1, borderColor: "#bdbdbd" }}
    >
      {children.map((child: any) => {
        return child;
      })}
    </AppTable>
  );
};

const TableRow: NodeHandler = ({ node, children }: any) => {
  return (
    <Row
      widthArr={new Array(React.Children.toArray(children).length).fill(
        CELL_WIDTH
      )}
      data={React.Children.toArray(children)}
      style={styles.tableRow}
    />
  );
};

const TableHeader: NodeHandler = ({ node, children }: any) => {
  return (
    <Cell
      data={children}
      style={{
        ...styles.tableCell,
        backgroundColor: "rgba(0, 0, 0, 0.08)",
        flex: 1,
      }}
    />
  );
};

const TableCell: NodeHandler = ({ node, children }: any) => {
  let contents = React.Children.toArray(children).map((content: any) => ({
    ...content,
    props: {
      ...content.props,
      node: {
        ...content.props.node,
        attrs: {
          ...(content.props.node.attrs ? content.props.node.attrs : {}),
          isTable: true,
        },
      },
    },
  }));

  return <Cell data={contents} style={styles.tableCell} />;
};

const HorizontalRule: NodeHandler = () => {
  return (
    <View
      style={{
        height: 1,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        marginVertical: 14,
      }}
    />
  );
};

const handlers: NodeHandlers = {
  doc: Doc,
  text: TextNode,
  paragraph: Paragraph,
  orderedList: OrderedList,
  listItem: ListItem,
  bulletList: BulletList,
  image: ImageExtension,
  heading: Heading,
  blockquote: Blockquote,
  customFile: CustomFile,
  hardBreak: hardBreak,
  table: TableHandler,
  tableRow: TableRow,
  tableCell: TableCell,
  tableHeader: TableHeader,
  horizontalRule: HorizontalRule,
};

interface TipTapViewProps {
  content: any;
}

const TipTapView = ({ content }: TipTapViewProps) => {
  return (
    <ScrollView>
      <TipTapRender handlers={handlers} node={content} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  h1: {
    fontSize: 17,
    fontWeight: "600",
    marginVertical: 10,
    color: "#101828",
  },
  p: {
    fontSize: 16,
  },
  img: {
    borderRadius: 8,
    marginVertical: 10,
  },
  ol: {
    marginVertical: 10,
  },
  li: {
    flexDirection: "row",
  },
  alert: {
    borderWidth: 1,
    borderStyle: "solid",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 18,
    marginVertical: 10,
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
  },
  alertText: {
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
    color: "red",
  },
  alertIcon: {
    width: 22,
    height: 22,
  },

  container: {
    paddingTop: 10,
  },
  imageWrapper: {
    borderRadius: 10,
    overflow: "hidden",
  },
  anchor: {},
  anchorContainer: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#eaecf0",
    borderRadius: 8,
    marginVertical: 10,

    padding: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  anchorText: {
    fontWeight: "500",
    fontSize: 15,
    lineHeight: 20,
    color: "#344054",
  },
  anchorIcon: {
    width: 37,
    height: 37,
  },
  table: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#bdbdbd",
  },
  tableHeader: {
    backgroundColor: "rgba(0, 0, 0, 0.08)",
  },
  tableRow: {
    borderBottomWidth: 1,
    borderColor: "#bdbdbd",
  },
  tableCell: {
    paddingVertical: 3,
    paddingHorizontal: 5,
    borderRightWidth: 1,
    borderColor: "#bdbdbd",
    flex: 1,
    justifyContent: "flex-start",
  },
});

export default TipTapView;
