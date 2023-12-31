import Blockquote from "@tiptap/extension-blockquote";
import {
  NodeViewContent,
  NodeViewWrapper,
  ReactNodeViewRenderer,
} from "@tiptap/react";

function removeCallout(editor, calloutId) {
  const { state } = editor.view;
  const { tr } = state;

  state.doc.descendants((node, pos) => {
    if (node.type.name === "blockquote" && node.attrs.calloutId === calloutId) {
      try {
        const from = tr.mapping.map(pos);
        const to = tr.mapping.map(pos + node.nodeSize);

        tr.replaceRangeWith(from, to, node.content);

        editor.view.dispatch(tr);
      } catch (e) {
        console.log(e);
      }
    }
  });
}

function CalloutComponent(props) {
  const closeCallout = () => {
    removeCallout(props.editor, props.node.attrs.calloutId);
  };

  return (
    <NodeViewWrapper>
      <blockquote
        id={props.node.attrs.calloutId}
        className={`alert ${props.node.attrs.className}`}
      >
        <NodeViewContent />
      </blockquote>
    </NodeViewWrapper>
  );
}

const CalloutExtension = Blockquote.extend({
  draggable: true,

  addAttributes() {
    return {
      className: {
        default: "danger",
        renderHTML: ({ className }) => {
          return {
            class: className,
          };
        },
      },
      calloutId: {
        renderHTML: ({ calloutId }) => {
          return {
            calloutId,
          };
        },
      },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(CalloutComponent);
  },
});

export default CalloutExtension;
