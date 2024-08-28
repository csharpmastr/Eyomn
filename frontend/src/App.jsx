import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AuthenticationPage from "./Page/AuthenticationPage";

import MVP from "./Page/Mvp";
import Dashboard from "./Page/Main Page/Dashboard";
import Scribe from "./Page/Main Page/Scribe";
import Scan from "./Page/Main Page/Scan";
import Patient from "./Page/Main Page/Patient";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<AuthenticationPage type="login" />} />
        <Route path="/signup" element={<AuthenticationPage type="signup" />} />

        <Route path="/" element={<MVP />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/scribe" element={<Scribe />} />
          <Route path="/scan" element={<Scan />} />
          <Route path="/patient" element={<Patient />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
