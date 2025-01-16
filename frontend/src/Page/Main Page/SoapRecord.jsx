import React from "react";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useNavigate, useParams } from "react-router-dom";
import { PDFDownloadLink } from "@react-pdf/renderer";
import DocumentSoap from "../../Component/ui/PDF/DocumentSoap";
import { useSelector } from "react-redux";

const SoapRecord = () => {
  const navigate = useNavigate();
  const { patientId } = useParams();
  const { noteId } = useParams();
  const patients = useSelector((state) => state.reducer.patient.patients);
  const patient = patients.find((patient) => patient.patientId === patientId);
  const doctor = useSelector((state) => state.reducer.doctor.doctor);
  const patientDoc = doctor.find((doc) => doc.staffId === patient.doctorId);

  const scribeNotes = useSelector(
    (state) => state.reducer.note.medicalScribeNotes[patientId]
  );
  const soapNote = scribeNotes.find((note) => note.noteId === noteId);
  console.log(soapNote);

  const handleBack = () => {
    navigate(`/scribe/${patientId}`);
    sessionStorage.setItem("currentPath", `/scribe/${patientId}`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString(undefined, options);
  };

  const patientData = {
    name: `${patient.first_name} ${patient.last_name}`,
    age: `${patient.age}`,
    gender: `${patient.sex}`,
    doctor: `${patientDoc.first_name} ${patientDoc.last_name}`,
    date: `${formatDate(patient.createdAt)}`,
    subjective: soapNote.subjective.join("\n"),
    objective: soapNote.objective.join("\n- "),
    assessment: soapNote.assessment.join("\n"),
    plan: soapNote.plan.join("\n"),
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 h-full font-Poppins text-f-dark overflow-y-auto">
      <div className="flex justify-between mb-8">
        <div className="flex flex-col">
          <p
            className="flex gap-2 text-p-sc md:text-p-sm hover:cursor-pointer"
            onClick={handleBack}
          >
            <AiOutlineArrowLeft className="h-5 w-5" />
            Back
          </p>
          <h1 className="text-p-sm md:text-p-rg font-medium">
            Standardize Medical Record
          </h1>
        </div>
        <PDFDownloadLink
          document={<DocumentSoap patientData={patientData} />}
          fileName={`${patientData.name} Medical Record.pdf`}
        >
          <button className="rounded-md bg-c-branch font-medium text-f-light px-6 py-2">
            Export
          </button>
        </PDFDownloadLink>
      </div>

      <div className="w-full h-auto rounded-md border border-f-gray">
        <div className="p-4 bg-bg-sub border-b border-f-gray flex justify-between rounded-t-md">
          <article>
            <h6>{`${patient.first_name} ${patient.last_name}`}</h6>
            <p className="text-p-sc md:text-p-sm">{`${patient.age} years old | ${patient.sex}`}</p>
          </article>
          <h6>{patient.birthdate}</h6>
        </div>

        <div className="w-full text-p-sm md:text-p-rg bg-white font-light">
          <div className="w-full flex">
            <div className="w-1/2 border p-4 flex flex-col gap-5">
              <h1 className="text-c-primary font-semibold">| Subjective (S)</h1>
              <article className="ml-2">
                {soapNote.subjective.map((item, index) => (
                  <p key={index}>{item}</p>
                ))}
              </article>
            </div>

            <div className="w-1/2 border p-4 flex flex-col gap-5">
              <h1 className="text-c-primary font-semibold">| Objective (O)</h1>
              <article className="ml-2">
                {soapNote.objective.map((item, index) => (
                  <p key={index}>{`- ${item}`}</p>
                ))}
              </article>
            </div>
          </div>

          <div className="w-full flex">
            <div className="w-1/2 border p-4 flex flex-col gap-5">
              <h1 className="text-c-primary font-semibold">| Assessment (A)</h1>
              <article className="ml-2">
                {soapNote.assessment.map((item, index) => (
                  <p key={index}>{`- ${item}`}</p>
                ))}
              </article>
            </div>

            <div className="w-1/2 border p-4 flex flex-col gap-5">
              <h1 className="text-c-primary font-semibold">| Plan (P)</h1>
              <article className="ml-2">
                {soapNote.plan.map((item, index) => {
                  if (
                    item.toLowerCase().includes("management") ||
                    item.toLowerCase().includes("follow-up care") ||
                    item.includes("*")
                  ) {
                    return null;
                  }

                  const cleanItem = item.replace(/^\d+\.\s*/, "");

                  return (
                    <div key={index}>
                      <p>{`- ${cleanItem}`}</p>
                    </div>
                  );
                })}
              </article>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SoapRecord;
