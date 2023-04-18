import { useCallback, useEffect, useMemo, useState } from "preact/hooks";
import { basicSetup } from "codemirror";
import { EditorView, keymap, placeholder } from "@codemirror/view";
import { defaultKeymap, indentWithTab } from "@codemirror/commands";
import { languages } from "@codemirror/language-data";
import { Compartment, EditorState } from "@codemirror/state";
import { nordInit } from "@uiw/codemirror-theme-nord";
import { ModelOperations, ModelResult } from "@vscode/vscode-languagedetection";
import MODEL_JSON from "@vscode/vscode-languagedetection/model/model.json?url";
import MODEL_WEIGHTS from "@vscode/vscode-languagedetection/model/group1-shard1of1.bin?url";

// Initialize language recognition model
const modelOps = new ModelOperations({
  modelJsonLoaderFunc: async () => {
    const response = await fetch(MODEL_JSON.toString());
    try {
      const modelJSON = await response.json();
      return modelJSON;
    } catch (e) {
      const message = `Failed to parse model JSON.`;
      throw new Error(message);
    }
  },
  weightsLoaderFunc: async () => {
    const response = await fetch(MODEL_WEIGHTS.toString());
    const buffer = await response.arrayBuffer();
    return buffer;
  },
  minContentSize: 8,
});

function Editor({
  content,
  setContent,
  lang,
  setLang,
}: {
  content: string;
  setContent: (content: string) => void;
  lang: ModelResult | null;
  setLang: (lang: ModelResult | null) => void;
}) {
  const [editorElement, setEditorElement] = useState<HTMLElement>();
  let [editorView, setEditorView] = useState<EditorView | null>(null);

  const langConf = useMemo(() => new Compartment(), []);
  const autoLang = useMemo(() => new Compartment(), []);

  async function guessLang(content: string) {
    const predictions = await modelOps.runModel(content);
    if (predictions.length > 0 && predictions[0].confidence > 0.1) {
      return predictions[0];
    }
    return null;
  }

  const editorRef = useCallback((node: HTMLElement | null) => {
    if (!node) return;
    setEditorElement(node);
  }, []);

  useEffect(() => {
    if (!editorElement || editorView) return;

    const view = new EditorView({
      state: EditorState.create({
        extensions: [
          basicSetup,
          keymap.of([...defaultKeymap, indentWithTab]),
          nordInit({
            settings: {
              background: "transparent",
              lineHighlight: "transparent",
              gutterBackground: "#2E3440",
              selection: "#4C566A",
              selectionMatch: "#434C5E",
              fontFamily: "IBM Plex Mono",
            },
          }),
          langConf.of([]),
          autoLang.of([]),
          placeholder(`Enter your code here...`),
        ],
      }),
      parent: editorElement,
    });

    view.dispatch({
      effects: autoLang.reconfigure(
        EditorState.transactionExtender.of((tr) => {
          setContent(tr.state.doc.toJSON().join("\r\n"));
          if (!tr.docChanged) {
            return null;
          } else if (tr.state.doc.length === 0) {
            setLang(null);
            return { effects: langConf.reconfigure([]) };
          } else {
            guessLang(tr.state.doc.toJSON().join("\r\n")).then((guess) => {
              if (!guess) return;
              const langDescription = languages.find((val) =>
                val.extensions.includes(guess.languageId.toLowerCase())
              );
              langDescription?.load().then((val) => {
                setLang({
                  languageId: val.language.name,
                  confidence: guess.confidence,
                });
                view.dispatch({ effects: langConf.reconfigure(val) });
              });
            });
            return null;
          }
        })
      ),
    });

    setEditorView(view);
  }, [editorElement]);

  return (
    <div class="scrollarea relative min-h-0 min-w-0 overflow-hidden rounded-xl bg-nord-0">
      <div
        ref={editorRef}
        class="h-full max-h-64 min-h-0 overflow-scroll p-5 pl-3 md:max-h-none"
      ></div>
    </div>
  );
}

export default Editor;
