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
import { AuthContext, AuthContextProvider } from "./Context/AuthContext";
import ScribePatient from "./Page/Main Page/Scribe/ScribePatient";
import { Provider } from "react-redux";
import { store } from "./Store/Store";
import Staff from "./Page/Main Page/Staff";

const AppRoutes = () => {
  const { user } = useContext(AuthContext);
  const selectedTab = sessionStorage.getItem("selectedTab") || "dashboard";

  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to={user ? `/${selectedTab}` : "/login"} />}
      />
      <Route
        path="/login"
        element={
          user ? (
            <Navigate to={`/${selectedTab}`} />
          ) : (
            <AuthenticationPage type="login" />
          )
        }
      />
      <Route
        path="/signup"
        element={
          user ? (
            <Navigate to={`/${selectedTab}`} />
          ) : (
            <AuthenticationPage type="signup" />
          )
        }
      />

      {/* Protected routes */}
      <Route element={user ? <MVP /> : <Navigate to="/login" />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="scan" element={<Scan />}>
          <Route path=":id" element={<ScanFundus />} />
        </Route>
        <Route path="scribe" element={<Scribe />}>
          <Route path=":id" element={<ScribePatient />} />
        </Route>
        <Route path="patient" element={<Patient />} />
        <Route path="staff" element={<Staff />} />
      </Route>

      {/* Catch-all route */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

const App = () => {
  return (
    <AuthContextProvider>
      <Provider store={store}>
        <Router>
          <AppRoutes />
        </Router>
      </Provider>
    </AuthContextProvider>
  );
};

export default App;
