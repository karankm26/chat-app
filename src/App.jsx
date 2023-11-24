// frontend/src/App.js
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Chat from "./components/Chat";
import Login from "./components/Login";
import Registration from "./components/Registration";
import ProtectedRoute from "./ProtectedRoute";
import Home from "./components/Home";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path={"/"}
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path={"/login"} element={<Login />} />
        <Route path={"/register"} element={<Registration />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
