import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthRoutes from "./routes/Auth.route";
import MainRoutes from "./routes/Main.route";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/auth/*" element={<AuthRoutes />} />
        <Route path="/*" element={<MainRoutes />} />
      </Routes>
    </Router>
  );
}

export default App;
