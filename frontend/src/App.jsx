import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AuthenticationPage from "./Page/AuthenticationPage";
import MVP from "./Page/MVP";
import Dashboard from "./Page/Main Page/Dashboard";
import Scribe from "./Page/Main Page/Scribe";
import Scan from "./Page/Main Page/Scan";
import Patient from "./Page/Main Page/Patient";
import ScanFundus from "./Page/Main Page/Scan/ScanFundus";
import { useContext } from "react";
import { AuthContext } from "./Context/AuthContext";

const App = () => {
  const { user } = useContext(AuthContext);

  return (
    <Router>
      <Routes>
        {/* Redirect based on authentication */}
        <Route
          path="/"
          element={
            user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/login"
          element={
            user ? (
              <Navigate to="/dashboard" />
            ) : (
              <AuthenticationPage type="login" />
            )
          }
        />
        <Route
          path="/signup"
          element={
            user ? (
              <Navigate to="/dashboard" />
            ) : (
              <AuthenticationPage type="signup" />
            )
          }
        />

        <Route element={user ? <MVP /> : <Navigate to="/login" />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="scan" element={<Scan />}>
            <Route path=":id" element={<ScanFundus />} />
          </Route>
          <Route path="scribe" element={<Scribe />} />
          <Route path="patient" element={<Patient />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
