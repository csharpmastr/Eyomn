import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AuthenticationPage from "./Page/AuthenticationPage";
import ForgotPassword from "./Page/ForgotPassword";
import MVP from "./Page/MVP";
import Dashboard from "./Page/Main Page/Dashboard";
import Scribe from "./Page/Main Page/Scribe";
import Scan from "./Page/Main Page/Scan";
import Patient from "./Page/Main Page/Patient";
import ScanFundus from "./Page/Main Page/Scan/ScanFundus";
import Appointment from "./Page/Main Page/Appointment";
import Inventory from "./Page/Main Page/Inventory";
import Report from "./Page/Main Page/Report";
import PointOfSale from "./Page/Main Page/PointOfSale";
import HelpCenter from "./Page/Main Page/HelpCenter";
import UserProfile from "./Page/Main Page/UserProfile";
import ProfileSetting from "./Page/Main Page/ProfileSetting";
import FullNotification from "./Page/Main Page/FullNotification";
import { useContext } from "react";
import { AuthContext, AuthContextProvider } from "./Context/AuthContext";
import ScribePatient from "./Page/Main Page/Scribe/ScribePatient";
import { Provider, useSelector } from "react-redux";
import { store } from "./Store/Store";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import Organization from "./Page/Main Page/Organization";
import StaffAddPatientPage from "./Page/Main Page/StaffAddPatientPage";
import { useAuthContext } from "./Hooks/useAuthContext";
import OrgStaff from "./Page/Main Page/OrgStaff";
import ScribeRecord from "./Page/Main Page/Scribe/ScribeRecord";
import MedForm from "./Page/Main Page/MedForm";
import SoapRecord from "./Page/Main Page/SoapRecord";
import PatientProfile from "./Page/Main Page/PatientProfile";
let persistor = persistStore(store);

const ProtectedRoute = ({ children, requiredRole, restrictedRole }) => {
  const { user } = useAuthContext();
  const userSlice = useSelector((state) => state.reducer.user.user);

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && userSlice.role !== requiredRole) {
    sessionStorage.setItem("selectedTab", "dashboard");
    return <Navigate to="/dashboard" />;
  }

  if (restrictedRole && userSlice.role === restrictedRole) {
    sessionStorage.setItem("selectedTab", "dashboard");
    return <Navigate to="/dashboard" />;
  }

  return children;
};

const AppRoutes = () => {
  const { user } = useAuthContext();
  const selectedTab = sessionStorage.getItem("selectedTab") || "dashboard";

  return (
    <Routes>
      <Route
        path="/*"
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
      <Route path="/forgot-password" element={<ForgotPassword />} />

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

        {/* accessible to users with role 2 */}
        <Route
          path="scribe"
          element={
            <ProtectedRoute requiredRole="2">
              <Scribe />
            </ProtectedRoute>
          }
        >
          <Route path=":patientId" element={<ScribeRecord />} />
          <Route path="new-record/:patientId" element={<MedForm />} />
          <Route path="raw-note/:patientId/:noteId" element={<MedForm />} />
          <Route path="soap-record/:patientId" element={<SoapRecord />} />
        </Route>

        <Route path="patient" element={<Patient />}>
          <Route path=":patientId" element={<PatientProfile />} />
        </Route>
        <Route path="organization" element={<Organization />}>
          <Route path=":branchId" element={<OrgStaff />} />
        </Route>

        <Route path="appointment" element={<Appointment />} />

        <Route
          path="add-patient"
          element={
            <ProtectedRoute requiredRole="3">
              <StaffAddPatientPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="inventory"
          element={
            <ProtectedRoute restrictedRole="2">
              <Inventory />
            </ProtectedRoute>
          }
        />
        <Route
          path="report"
          element={
            <ProtectedRoute restrictedRole="2">
              <Report />
            </ProtectedRoute>
          }
        />
        <Route
          path="stock_checkout"
          element={
            <ProtectedRoute restrictedRole={"2"}>
              <PointOfSale />
            </ProtectedRoute>
          }
        />
        <Route path="manage-profile/:section" element={<ProfileSetting />} />
        <Route path="profile" element={<UserProfile />} />
        <Route path="help" element={<HelpCenter />}>
          <Route path=":section" element={<HelpCenter />} />
        </Route>
        <Route path="/notification" element={<FullNotification />} />
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
