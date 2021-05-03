import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { appInit } from "./domains/appInit/appInitUnits";
import "./domains/logicInit";
import { FirstPage } from "./FirstPage";
import "./tailwind.css";

const App = () => {
  useEffect(appInit, []);

  return <FirstPage />;
};

ReactDOM.render(<App />, document.getElementById("app"));
