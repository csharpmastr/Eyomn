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
import Appointment from "./Page/Main Page/Appointment";
import Inventory from "./Page/Main Page/Inventory";
import PointOfSale from "./Page/Main Page/PointOfSale";
import HelpCenter from "./Page/Main Page/HelpCenter";
import UserProfile from "./Page/Main Page/UserProfile";
import ProfileSetting from "./Page/Main Page/ProfileSetting";
import { useContext } from "react";
import { AuthContext, AuthContextProvider } from "./Context/AuthContext";
import ScribePatient from "./Page/Main Page/Scribe/ScribePatient";
import { Provider } from "react-redux";
import { store } from "./Store/Store";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import Organization from "./Page/Main Page/Organization";
import StaffAddPatientPage from "./Page/Main Page/StaffAddPatientPage";
import { useAuthContext } from "./Hooks/useAuthContext";
import OrgStaff from "./Page/Main Page/OrgStaff";
import ScribeRecord from "./Page/Main Page/Scribe/ScribeRecord";
import MedForm from "./Page/Main Page/MedForm";
import PatientProfile from "./Page/Main Page/PatientProfile";
let persistor = persistStore(store);

const ProtectedRoute = ({ children }) => {
  const { user } = useAuthContext();
  return user ? children : <Navigate to="/login" />;
};
const AppRoutes = () => {
  const { user } = useAuthContext();
  const selectedTab = sessionStorage.getItem("selectedTab") || "dashboard";
  const currentPatientId = sessionStorage.getItem("currentPatientId");

  return (
    <Routes>
      <Route
        path="/*"
        element={<Navigate to={user ? `/${selectedTab}` : "/login"} />}
      />
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
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MVP />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="scan" element={<Scan />}>
          <Route path=":id" element={<ScanFundus />} />
        </Route>
        <Route path="scribe" element={<Scribe />}>
          <Route path=":patientId" element={<ScribeRecord />} />
          <Route path="new-record/:patientId" element={<MedForm />} />
        </Route>
        <Route path="patient" element={<Patient />}>
          <Route path=":patientId" element={<PatientProfile />} />
        </Route>
        <Route path="organization" element={<Organization />}>
          <Route path=":branchId" element={<OrgStaff />} />
        </Route>
        <Route path="add-patient" element={<StaffAddPatientPage />} />
        <Route path="appointment" element={<Appointment />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="profile" element={<UserProfile />} />
        <Route path="pos" element={<PointOfSale />} />
        <Route path="manage-profile/:section" element={<ProfileSetting />} />
        <Route path="/help" element={<HelpCenter />}>
          <Route path=":section" element={<HelpCenter />} />
        </Route>
      </Route>
    </Routes>
  );
};

const App = () => {
  return (
    <AuthContextProvider>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <Router>
            <AppRoutes />
          </Router>
        </PersistGate>
      </Provider>
    </AuthContextProvider>
  );
};

export default App;
