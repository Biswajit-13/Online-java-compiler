import React, { useState, useRef, useEffect } from "react";
import Editor from "@monaco-editor/react";
import ThemeSwitcher from "./components/ThemeSwitcher";
import javaCode from "./languageSnippets/java";
import axios from "axios";
import "./app.css";
import { BsArrowBarDown, BsArrowBarUp, BsPlayFill,  } from 'react-icons/bs';
import { FaSpinner } from 'react-icons/fa';
function App() {
  
  const [theme, setTheme] = useState("vs-light");
  const [code, setCode] = useState(javaCode);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const editorRef = useRef(null);

  const sendDataToBackend = () => {
    setLoading(true);
    axios
      .post(`http://localhost:80/java`, { code, input })
      .then((response) => {
        setOutput(response.data.output);
      })
      .catch((error) => {
        if (error.response && error.response.data && error.response.data.errors) {
          setOutput(error.response.data.errors);
        } else {
          console.error("Error:", error.response ? error.response.data : error.message);
          setOutput("Error occurred while running the code.");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const downloadCode = () => {
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Main.java";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const uploadCode = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const uploadedCode = event.target.result;
        setCode(uploadedCode);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className=" bg-gray-200">
      <div class="flex p-5">
        <div class="w-3/4">
          <div class="flex bg-gray-200 p-2">
            <div class="w-3/4 font-bold text-heading">
              Main.java
            </div>
            <div class="w-1/4 flex justify-between items-center">
              <ThemeSwitcher setTheme={setTheme} />
              <button class="mx-2 text-run" onClick={sendDataToBackend}>
              {loading ? <FaSpinner className="animate-spin" size={23} /> : <BsPlayFill size={23} />}
            </button>

              <input type="file" accept=".java" onChange={uploadCode} style={{ display: 'none' }} />
              <button className="text-output" onClick={() => document.querySelector('input[type="file"]').click()}>
                <BsArrowBarUp size={23} />
              </button>

              <button class="mx-2 text-output" onClick={downloadCode}>
                <BsArrowBarDown size={23} />
              </button>
            </div>
          </div>
          <div className="h-screen">
            <Editor
              class="w-full h-screen rounded-md"
              language="java"
              theme={theme}
              value={code}
              onMount={(editor) => {
                editorRef.current = editor;
                const initialContent = editor.getValue();
                editor.onDidChangeModelContent(() => {
                  const currentContent = editor.getValue();
                  if (currentContent !== initialContent) {
                    setCode(currentContent);
                  }
                });
              }}
            />
          </div>
        </div>

        <div class="w-1/4 text-heading">
          <div class="bg-gray-200 p-2 font-bold">Input</div>
          <textarea class="h-1/3 w-full text-input" value={input} onChange={(e) => setInput(e.target.value)}></textarea>
          <div class="bg-gray-200 p-2 font-bold">Output</div>
          <div class="overflow-auto max-h-48 text-output">{output}</div>
        </div>
      </div>
      <div class="bg-gray-300 p-3 font-semibold text-center">
        Made with ❤️ by @Biswajit
      </div>
    </div>
  );
}

export default App;
