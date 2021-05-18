import CodeMirror, { Editor } from "codemirror";
import { Event, Store } from "effector";
import React, { useEffect, useRef } from "react";

export type CodeEditorProps = {
  initial: Store<string>;
  setValue?: Event<string> | Event<string | undefined>;
  onChange: Event<string>;
};

export const JsonEditor: React.FC<CodeEditorProps> = ({
  initial,
  setValue,
  onChange,
}) => {
  const editorRef = useRef<Editor | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || editorRef.current) {
      return;
    }

    const editor = CodeMirror(containerRef.current, {
      value: initial.getState(),
      tabSize: 2,
      mode: "application/json",
      theme: "material-palenight",
      keyMap: "sublime",
      lineNumbers: true,
      showCursorWhenSelecting: true,
      lineWrapping: true,
      autoCloseBrackets: true,
      matchBrackets: true,
    });

    editor.setSize(null, 500);
    editor.on("change", () => {
      onChange(editor.getValue());
    });

    editorRef.current = editor;

    if (!setValue) {
      return;
    }

    return setValue.watch((val) => {
      editor.setValue(val || initial.defaultState);
    });
  }, [containerRef]);

  return <div ref={containerRef} className="mt-4"></div>;
};
