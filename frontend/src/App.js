import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AddUser from "./pages/AddUser";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  if (!token) return <Login setToken={setToken} />;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard token={token} />} />
        <Route path="/add-user" element={<AddUser token={token} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;