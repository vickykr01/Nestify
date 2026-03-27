import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import PgDetails from "./pages/PgDetails";
import Admin from "./pages/Admin";
import AddPG from "./pages/AddPG";
import EditPG from "./pages/EditPG";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pg/:id" element={<PgDetails />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/add-pg"
          element={
            <ProtectedRoute>
              <AddPG />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/edit-pg/:id"
          element={
            <ProtectedRoute>
              <EditPG />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
