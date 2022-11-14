import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import {
  Navigation,
  Footer,
  Home,
  About,
  Upload,
  Chat,
  Instructions,
} from "./components/services/Index";

const container = document.getElementById('root');

const root = ReactDOM.createRoot(container);

root.render(
  <Router>
    <Navigation />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/upload_page" element={<Upload />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/instructions" element={<Instructions />} />
      <Route path="/about" element={<About />}>
      </Route>
    </Routes>
    <Footer />
  </Router>,
);

serviceWorker.unregister();
