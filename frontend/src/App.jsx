import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AuthenticationPage from "./Page/AuthenticationPage";
import Landing from "./Page/Landing";
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/*" element={<Landing />} />
        {/* <Route path="/login" element={<AuthenticationPage type="login" />} />
        <Route path="/signup" element={<AuthenticationPage type="signup" />} /> */}
      </Routes>
    </Router>
  );
};

export default App;
