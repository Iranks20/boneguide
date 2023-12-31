import Paragraph from "@tiptap/extension-paragraph";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { NodeViewWrapper } from "@tiptap/react";
// import { FiTrash2 } from "react-icons/fi";

function FileComponent(props) {
  return (
    <NodeViewWrapper>
      <div draggable="true" data-drag-handle="" contenteditable="false">
        {props.editor.isEditable && (
          <button className="closebtn" onClick={() => props.deleteNode()}>
            {/* <FiTrash2 /> */}
            delete
          </button>
        )}

        <a
          target="_blank"
          rel="noopener noreferrer nofollow"
          class="file-item editor-link"
          href={props.node.attrs.href}
        >
          {props.node.attrs.text}
        </a>
      </div>
    </NodeViewWrapper>
  );
}

const FileExtension = Paragraph.extend({
  name: "customFile",
  draggable: true,
  allowGapCursor: true,
  isolating: true,

  renderHTML({ node }) {
    return [
      "a",
      {
        class: "file-item",
        href: node?.attrs?.href,
        target: "_blank",
        rel: "noopener noreferrer nofollow",
      },
      node?.attrs?.text,
    ];
  },

  addAttributes() {
    return {
      href: {
        renderHTML: ({ href }) => {
          return {
            href,
          };
        },
      },
      text: {
        renderHTML: ({ text }) => {
          return {
            text,
          };
        },
      },
    };
  },
  addNodeView() {
    return ReactNodeViewRenderer(FileComponent);
  },
});

export default FileExtension;
