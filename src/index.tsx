import React from "react";
import ReactDOM from "react-dom/client";
import MainProvider from "./lib/provider";
import * as buffer from "buffer";
import App from "./pages/App";
import "./extension/string.d.ts"
import "./extension/bigNumber.d.ts"
import "./share/global.css";

window.Buffer = buffer.Buffer;

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <MainProvider>
    <App/>
  </MainProvider>
);
