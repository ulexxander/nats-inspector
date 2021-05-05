import "codemirror/addon/edit/closebrackets.js";
import "codemirror/addon/edit/matchbrackets.js";
import "codemirror/keymap/sublime";
import "codemirror/lib/codemirror.css";
import "codemirror/lib/codemirror.js";
import "codemirror/mode/javascript/javascript.js";
import "codemirror/theme/material-palenight.css";
import React from "react";
import ReactDOM from "react-dom";
import { App } from "./App";
import "./domains/logicInit";
import "./tailwind.css";

ReactDOM.render(<App />, document.getElementById("app"));
