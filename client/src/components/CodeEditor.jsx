import Editor from "@monaco-editor/react";

const CodeEditor = ({ language, code, onChange }) => {
  return (
    <div
      className="h-full w-full border rounded-xl overflow-hidden shadow"
      style={{ maxHeight: "100%" }}
    >
      <Editor
        height="100%"
        language={language}
        theme="vs-dark"
        value={code}
        onChange={onChange}
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          automaticLayout: true,
          scrollBeyondLastLine: false,
        }}
      />
    </div>
  );
};

export default CodeEditor;
