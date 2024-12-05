import React, { useState, useEffect } from "react";
import { IoMdSearch } from "react-icons/io";
import { FiFilter } from "react-icons/fi";
import PatientScribeCard from "../../Component/ui/PatientScribeCard";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Nodatafound from "../../assets/Image/nodatafound.png";
import { getPatientNotes } from "../../Service/PatientService";
import Cookies from "universal-cookie";
import { setRawNotes } from "../../Slice/NoteSlice";

const groupPatientsByInitial = (patients) => {
  if (!Array.isArray(patients) || patients.length === 0) {
    return {};
  }

  return patients.reduce((acc, patient) => {
    if (!patient || !patient.first_name) {
      return acc;
    }

    const initial = patient.first_name[0].toUpperCase();

    if (!acc[initial]) {
      acc[initial] = [];
    }
    acc[initial].push(patient);

    return acc;
  }, {});
};

const Scribe = () => {
  const [hasSelected, setHasSelected] = useState(false);
  const user = useSelector((state) => state.reducer.user.user);
  const patients = useSelector((state) => state.reducer.patient.patients);
  const rawNotes = useSelector((state) => state.reducer.note.rawNotes);
  const reduxDispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [sortOrder, setSortOrder] = useState("ascending");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const currentPath = location.pathname;
    const patientIdMatch = currentPath.match(/\/scribe\/(\d+)/);

    const storedPatientId = sessionStorage.getItem("currentPatientId");
    const storedLocation = sessionStorage.getItem("currentPath");

    if (storedPatientId && storedLocation) {
      setHasSelected(true);
      navigate(storedLocation);
    } else if (patientIdMatch) {
      setHasSelected(true);
      sessionStorage.setItem("currentPatientId", patientIdMatch[1]);
      sessionStorage.setItem("currentPath", currentPath);
    }
  }, [navigate]);

  const handleClickPatient = async (id) => {
    const clickedPatient = patients.find((patient) => patient.patientId === id);
    setHasSelected(true);

    if (clickedPatient) {
      const newPath = `/scribe/${id}`;
      sessionStorage.setItem("currentPatientId", id);
      sessionStorage.setItem("currentPath", newPath);
      navigate(newPath);
    } else {
      console.error("Patient not found");
    }
  };
  useEffect(() => {
    if (location.pathname === "/scribe") {
      setHasSelected(false);
    }
    if (location.state && location.state.resetSelected) {
      setHasSelected(false);
    }
  }, [location]);

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  // const groupedPatients = groupPatientsByInitial(patients);
  // const sortedInitials = Object.keys(groupedPatients).sort();

  const filteredPatients = patients.filter((patient) => {
    const fullName = `${patient.first_name} ${patient.last_name}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  const filteredGroupedPatients = groupPatientsByInitial(filteredPatients);
  const sortedFilteredInitials = Object.keys(filteredGroupedPatients).sort(
    (a, b) =>
      sortOrder === "ascending" ? a.localeCompare(b) : b.localeCompare(a)
  );

  return (
    <div className="h-full w-full">
      {hasSelected ? (
        <Outlet />
      ) : (
        <div className="p-4 md:p-6 2xl:p-8 font-Poppins h-full overflow-clip">
          <div className="flex flex-col md:flex-row md:items-center justify-between text-p-sm md:text-p-rg ">
            <p className="font-semibold text-f-dark">
              {patients.length || 0}{" "}
              <span className="text-f-gray2 font-medium">Total patient</span>
            </p>
            <div className="mt-2 md:mt-0 flex flex-row gap-3">
              <div className="flex justify-center items-center rounded-lg px-4 border font-normal hover:cursor-pointer bg-white h-12 text-f-dark">
                <select
                  value={sortOrder}
                  onChange={handleSortChange}
                  className="hover:cursor-pointer focus:outline-none bg-f-light w-fit"
                >
                  <option value="" disabled selected>
                    Sort by
                  </option>
                  <option value="ascending">Ascending</option>
                  <option value="descending">Descending</option>
                </select>
              </div>
              <div className="flex flex-row border px-4 rounded-lg justify-center items-center w-full gap-2 bg-white h-12">
                <IoMdSearch className="h-6 w-6 text-f-dark" />
                <input
                  type="text"
                  placeholder="Search patient name"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-f-dark focus:outline-none placeholder-c-gray3 bg-white"
                />
              </div>
            </div>
          </div>
          <div className="w-auto h-full mt-8 pb-8 overflow-y-scroll">
            {sortedFilteredInitials.length > 0 ? (
              sortedFilteredInitials.map((initial) => (
                <div key={initial} className="mb-8">
                  <h2 className="text-p-sm md:text-p-rg text-f-gray2 font-medium mb-4">
                    {initial}
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-8 px-4">
                    {filteredGroupedPatients[initial].map((patient, index) => (
                      <PatientScribeCard
                        key={index}
                        name={`${patient.first_name} ${patient.last_name}`}
                        onClick={() => handleClickPatient(patient.patientId)}
                      />
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-center text-[#96B4B4] text-p-rg md:text-p-lg font-medium gap-4">
                <img src={Nodatafound} alt="no data image" className="w-80" />
                <p>
                  We couldn't find any patients. Check your spelling
                  <br />
                  or try different keywords.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Scribe;
