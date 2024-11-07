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
  const cookies = new Cookies();
  const accessToken = cookies.get("accessToken");
  const refreshToken = cookies.get("refreshToken");
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
    const storedPatientId = sessionStorage.getItem("currentPatientId");
    const storedLocation = sessionStorage.getItem("currentPath");

    if (storedPatientId && storedLocation) {
      setHasSelected(true);

      navigate(storedLocation);
    }
  }, [navigate]);

  const handleClickPatient = async (id) => {
    const clickedPatient = patients.find((patient) => patient.patientId === id);
    setHasSelected(true);

    if (clickedPatient) {
      const newPath = `/scribe/${id}`;
      sessionStorage.setItem("currentPatientId", id);
      sessionStorage.setItem("currentPath", newPath);

      if (rawNotes[id]) {
        console.log("Using cached notes from Redux store");
        navigate(newPath);
      } else {
        try {
          const response = await getPatientNotes(
            id,
            user.firebaseUid,
            accessToken,
            refreshToken
          );
          if (response) {
            reduxDispatch(setRawNotes({ [id]: response }));
          }
        } catch (error) {
          console.log(error);
        }
        navigate(newPath);
      }
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
          <div className="flex flex-col md:flex-row md:items-center justify-between text-p-rg ">
            <p className="font-semibold text-f-dark">
              {patients.length || 0}{" "}
              <span className="text-f-gray2">Total patient</span>
            </p>
            <div className="mt-8 md:mt-0 flex flex-row gap-3">
              <div className="h-auto flex justify-center items-center rounded-md px-4 py-3 border border-f-gray bg-f-light text-c-gray3 font-normal hover:cursor-pointer">
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
              <div className="w-full flex flex-row gap-2 border border-f-gray bg-f-light px-4 rounded-md justify-center items-center md:w-fit">
                <IoMdSearch className="h-6 w-6 text-c-secondary" />
                <input
                  type="text"
                  placeholder="Search patient name"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-f-dark focus:outline-none placeholder-c-gray3 bg-f-light"
                />
              </div>
            </div>
          </div>
          <div className="w-auto h-full mt-8 pb-8 overflow-y-scroll">
            {sortedFilteredInitials.length > 0 ? (
              sortedFilteredInitials.map((initial) => (
                <div key={initial} className="mb-8">
                  <h2 className="text-p-rg text-f-gray2 font-medium mb-4">
                    {initial}
                  </h2>
                  <div className="grid grid-cols-5 gap-8 px-4">
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
              <div className="w-full h-full flex flex-col items-center justify-center text-center text-[#96B4B4] text-p-lg font-medium gap-4">
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
