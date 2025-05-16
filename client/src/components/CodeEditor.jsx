import Editor from "@monaco-editor/react";

const CodeEditor = ({ language, code, onChange }) => {
  return (
    <div className="border rounded shadow">
      <Editor
        height="400px"
        language={language}
        theme="vs-dark"
        value={code}
        onChange={onChange}
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          automaticLayout: true,
        }}
      />
    </div>
  );
};

export default CodeEditor;