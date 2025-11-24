import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Launches from "./pages/Launches";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirección automática desde "/" hacia "/launches" */}
        <Route path="/" element={<Navigate to="/launches" replace />} />
        <Route path="/launches" element={<Launches />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
