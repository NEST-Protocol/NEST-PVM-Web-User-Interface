import React from "react";
import ReactDOM from "react-dom/client";
import MainProvider from "./lib/provider";
import * as buffer from "buffer";
import App from "./pages/App";
import "./extension/string.d.ts"
import "./extension/number.d.ts"
import "./extension/bigNumber.d.ts"
import "./extension/bigint.d.ts"
import "./share/global.css";
import "@fontsource/open-sans/400.css";
import "@fontsource/open-sans/500.css";
import "@fontsource/open-sans/600.css";
import "@fontsource/open-sans/700.css";
import 'react-date-range/dist/styles.css';
import './share/react-date-range.css';

window.Buffer = buffer.Buffer;

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <MainProvider>
    <App/>
  </MainProvider>
);
