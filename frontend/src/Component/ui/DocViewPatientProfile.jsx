import React, { useEffect, useState } from "react";
import { IoIosAddCircleOutline } from "react-icons/io";
import PaymentBreakdown from "./PaymentBreakdown";
import ReasonVisitCard from "./ReasonVisitCard";
import VisitReasonModal from "./VisitReasonModal";
import { getPatientNotes } from "../../Service/PatientService";
import Cookies from "universal-cookie";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { year: "numeric", month: "long", day: "numeric" };
  return date.toLocaleDateString(undefined, options);
};

const DocViewPatientProfile = ({ patient, visits }) => {
  const { patientId } = useParams();
  const [isVisitOpen, setIsVisitOpen] = useState(false);
  const user = useSelector((state) => state.reducer.user.user);
  const cookies = new Cookies();
  const accessToken = cookies.get("accessToken");
  const refreshToken = cookies.get("refreshToken");
  const [isLoading, setIsLoading] = useState(false);
  const reduxDispatch = useDispatch();
  const [rawNotes, setRawNotes] = useState([]);
  const formattedDate = patient.createdAt
    ? new Date(patient.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";

  useEffect(() => {
    const fetchNotes = async () => {
      setIsLoading(true);
      console.log(patientId);

      try {
        const notesResponse = await getPatientNotes(
          patientId,
          user.firebaseUid,
          accessToken,
          refreshToken
        );

        if (notesResponse && Array.isArray(notesResponse)) {
          reduxDispatch(setRawNotes({ [patientId]: notesResponse }));
        } else {
          console.error("Unexpected or empty response:", notesResponse);
        }
      } catch (error) {
        console.log("Error fetching patient notes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (patientId && user.firebaseUid) {
      fetchNotes();
    }
  }, [patientId]);

  const toggleModal = () => setIsVisitOpen(!isVisitOpen);

  return (
    <div className="w-full h-full flex flex-col gap-4">
      <div className="h-full md:h-1/2 w-full flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-2/3 flex flex-col gap-4 h-full">
          <header className="gap-4 h-1/4 w-full flex">
            <section className="bg-bg-sb border border-c-primary p-5 w-1/3 rounded-md">
              <p className="text-f-dark font-medium text-p-rg md:text-p-lg mb-2">
                {patient.first_name + " " + patient.last_name}
              </p>
              <p className="text-c-gray3 font-medium text-p-sc md:text-p-sm">
                Admitted:{" "}
                <span className="text-f-dark text-p-sm md:text-p-rg">
                  {formattedDate}
                </span>
              </p>
            </section>
            <section className="bg-bg-sb border border-c-primary p-5 w-2/3 rounded-md flex">
              <section className="flex-1">
                <p className="text-c-gray3 font-medium text-p-sc md:text-p-sm mb-2">
                  Birthdate
                </p>
                <p className="text-f-dark font-medium text-p-sm md:text-p-rg">
                  {formatDate(patient.birthdate)}
                </p>
              </section>
              <section className="flex-1">
                <p className="text-c-gray3 font-medium text-p-sc md:text-p-sm mb-2">
                  Age
                </p>
                <p className="text-f-dark font-medium text-p-sm md:text-p-rg">
                  {patient.age} Yrs Old
                </p>
              </section>
              <section className="flex-1">
                <p className="text-c-gray3 font-medium text-p-sc md:text-p-sm mb-2">
                  Gender
                </p>
                <p className="text-f-dark font-medium text-p-sm md:text-p-rg">
                  {patient.sex}
                </p>
              </section>
            </section>
          </header>
          <div className="w-full h-3/4 bg-white p-8 rounded-lg shadow-sm border flex flex-col justify-between">
            <div>
              <h1 className="text-p-sm md:text-p-rg font-medium text-f-dark mb-4">
                | Status Information
              </h1>
              <article className="flex w-full">
                <section className="flex-1">
                  <p className="text-c-gray3 font-medium text-p-sc md:text-p-sm mb-2">
                    Civil Status
                  </p>
                  <p className="text-f-dark font-medium text-p-sm md:text-p-rg">
                    {patient.civil_status}
                  </p>
                </section>
                <section className="flex-1">
                  <p className="text-c-gray3 font-medium text-p-sc md:text-p-sm mb-2">
                    Occupation
                  </p>
                  <p className="text-f-dark font-medium text-p-sm md:text-p-rg">
                    {patient.occupation}
                  </p>
                </section>
                <section className="flex-1"> </section>
              </article>
            </div>
            <hr />
            <div>
              <h1 className="text-p-sm md:text-p-rg font-medium text-f-dark mb-4">
                | Contact Information
              </h1>
              <article className="flex w-full">
                <section className="flex-1">
                  <p className="text-c-gray3 font-medium text-p-sc md:text-p-sm mb-2">
                    Address
                  </p>
                  <p className="text-f-dark font-medium text-p-sm md:text-p-rg">
                    {patient.municipality + ", " + patient.province}
                  </p>
                </section>
                <section className="flex-1">
                  <p className="text-c-gray3 font-medium text-p-sc md:text-p-sm mb-2">
                    Contact Number
                  </p>
                  <p className="text-f-dark font-medium text-p-sm md:text-p-rg">
                    {patient.contact_number}
                  </p>
                </section>
                <section className="flex-1">
                  <p className="text-c-gray3 font-medium text-p-sc md:text-p-sm mb-2">
                    Email Address
                  </p>
                  <p className="text-f-dark font-medium text-p-sm md:text-p-rg truncate">
                    {patient.email}
                  </p>
                </section>
              </article>
            </div>
          </div>
        </div>
        <div className="w-full md:w-1/3 h-full shadow-sm border bg-white rounded-lg font-poppins p-4 overflow-hidden pb-14">
          <header className="flex w-full h-fit justify-between items-center mb-4">
            <h1 className="text-p-sm md:text-p-rg font-medium text-f-dark">
              Recent Visit
            </h1>
            <button>
              <IoIosAddCircleOutline
                className="h-6 w-6 md:mr-2 text-c-gray3"
                onClick={toggleModal}
              />
            </button>
          </header>
          <div className="w-full h-full overflow-y-scroll flex flex-col gap-4">
            {visits.length > 0 ? (
              visits.map((visit, index) => (
                <ReasonVisitCard key={index} reasonData={visit} />
              ))
            ) : (
              <p>No visit records found.</p>
            )}
          </div>
        </div>
      </div>
      <div className="h-full md:h-1/2 w-full flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-2/3 h-[450px] bg-white p-5 rounded-lg shadow-sm border overflow-y-scroll">
          <section className="mb-8 flex justify-center">
            <h1 className="text-p-sm md:text-p-rg font-medium text-c-secondary">
              Patient Medical Records
            </h1>
          </section>
          <section className="bg-white border rounded-md">
            <div className="p-3 rounded-t-md bg-bg-sub border-b">
              <h1 className="w-full text-center">Subjective</h1>
            </div>
            <div className="p-5 gap-3 flex flex-col">
              <div className="flex flex-col md:flex-row gap-3">
                <div className="p-3 rounded-lg border flex-1 text-f-dark text-p-sc md:text-p-sm bg-bg-mc">
                  <h6 className="font-medium mb-3">| Initial Obeservation</h6>
                  <article>
                    <p>Content</p>
                  </article>
                </div>
                <div className="p-3 rounded-lg border flex-1 text-f-dark text-p-sc md:text-p-sm bg-bg-mc">
                  <h6 className="font-medium mb-3">| General Health Hx</h6>
                  <article>
                    <p>Content</p>
                  </article>
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-3">
                <div className="p-3 rounded-lg border flex-1 text-f-dark text-p-sc md:text-p-sm bg-bg-mc">
                  <h6 className="font-medium mb-3">
                    | Occular Condition/History
                  </h6>
                  <article>
                    <p>Content</p>
                  </article>
                </div>
                <div className="p-3 rounded-lg border flex-1 text-f-dark text-p-sc md:text-p-sm bg-bg-mc">
                  <h6 className="font-medium mb-3">
                    | Family Occular Conditon
                  </h6>
                  <article>
                    <p>Content</p>
                  </article>
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-3">
                <div className="p-3 rounded-lg border flex-1 text-f-dark text-p-sc md:text-p-sm bg-bg-mc">
                  <h6 className="font-medium mb-3">| Current Medication</h6>
                  <article>
                    <p>Content</p>
                  </article>
                </div>
                <div className="p-3 rounded-lg border flex-1 text-f-dark text-p-sc md:text-p-sm bg-bg-mc">
                  <h6 className="font-medium mb-3">| Lifestyle</h6>
                  <article>
                    <p>Content</p>
                  </article>
                </div>
              </div>
            </div>
          </section>
        </div>
        <div className="w-full md:w-1/3 h-[450px] shadow-sm border bg-white rounded-lg font-poppins p-4 overflow-y-scroll">
          <PaymentBreakdown />
        </div>
      </div>
      {isVisitOpen && <VisitReasonModal onClose={toggleModal} />}
    </div>
  );
};
export default DocViewPatientProfile;
