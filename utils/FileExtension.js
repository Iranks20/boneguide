import Paragraph from "@tiptap/extension-paragraph";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { NodeViewWrapper } from "@tiptap/react";

function FileComponent(props) {
  return (
    <NodeViewWrapper>
      <div draggable="true" data-drag-handle="" contenteditable="false">
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
