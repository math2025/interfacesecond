// highlightLatex.js

import { Mark } from "@tiptap/core";
import { Plugin } from "prosemirror-state"; // ✅ Correct import
import { Decoration, DecorationSet } from "prosemirror-view";

export const HighlightLatex = Mark.create({
  name: "highlightLatex",

  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          decorations: ({ doc }) => {
            const decorations = [];
            const regex = /(\${1,2})([^\$]+?)\1/g;

            doc.descendants((node, pos) => {
              if (!node.isText) return;

              let match;
              while ((match = regex.exec(node.text))) {
                const start = pos + match.index;
                const end = start + match.index + match[0].length;

                decorations.push(
                  Decoration.inline(start, end, {
                    class: "math-highlight",
                    "data-math": true,
                  })
                );
              }
            });

            return DecorationSet.create(doc, decorations);
          },
        },
      }),
    ];
  },
});
