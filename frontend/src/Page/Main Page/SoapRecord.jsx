import React from "react";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useNavigate, useParams } from "react-router-dom";
import { PDFDownloadLink } from "@react-pdf/renderer";
import DocumentSoap from "../../Component/ui/PDF/DocumentSoap";
import { useSelector } from "react-redux";

const SoapRecord = () => {
  const navigate = useNavigate();
  const { patientId } = useParams();
  const patients = useSelector((state) => state.reducer.patient.patients);
  const patient = patients.find((patient) => patient.patientId === patientId);
  const handleBack = () => {
    navigate(`/scribe/${patientId}`);

    sessionStorage.setItem("currentPath", `/scribe/${patientId}`);
  };

  const patientData = {
    name: "John Doe",
    age: 65,
    gender: "Male",
    date: "11/07/2024",
    subjective:
      "Patient reports blurred vision in the left eye for the past two weeks, worse at night. Denies eye pain, redness, or discharge. No recent trauma or changes in medication. Family history of glaucoma and macular degeneration.",
    objective:
      "Visual Acuity (uncorrected): Right Eye (OD): 20/25, Left Eye (OS): 20/50. Intraocular Pressure (IOP): OD: 18 mmHg, OS: 22 mmHg. External Exam: Eyelids: Normal, Conjunctiva: Clear, Sclera: White. Slit Lamp Exam: Cornea: Clear, Anterior Chamber: Deep and quiet, Lens: Mild nuclear sclerosis bilaterally.",
    assessment:
      "1. Age-related macular degeneration (dry) 2. Suspected glaucoma in the left eye",
    plan: "1. Monitoring: Schedule follow-up in 6 months for IOP check and optic nerve evaluation. 2. OCT: Obtain optical coherence tomography to assess retinal layers and optic nerve head. 3. Lifestyle Counseling: Encourage UV-protective eyewear and smoking cessation. 4. Referrals: Refer to a glaucoma specialist for further evaluation if IOP or optic nerve findings worsen. 5. Education: Discussed importance of monitoring changes in vision and advised to report any worsening symptoms.",
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 h-full font-Poppins text-f-dark overflow-y-auto">
      <div className="flex justify-between mb-8">
        <div className="flex flex-col">
          <p
            className="flex gap-2 text-p-sm  hover:cursor-pointer"
            onClick={handleBack}
          >
            <AiOutlineArrowLeft className="h-5 w-5" />
            Back
          </p>
          <h1 className="text-p-rg font-medium">Standardize Medical Record</h1>
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
            <p className="text-p-sm">{`${patient.age} years  old | ${patient.sex}`}</p>
          </article>
          <h6>{patient.birthdate}</h6>
        </div>
        <div className="w-full text-p-rg bg-white font-light">
          <div className="w-full flex">
            <div className="w-1/2 border p-4 flex flex-col gap-5">
              <h1 className="text-c-primary font-semibold">| Subjective (S)</h1>
              <article className="ml-2">
                Patient reports blurred vision in the left eye for the past two
                weeks, worse at night. Denies eye pain, redness, or discharge.
                No recent trauma or changes in medication. Family history of
                glaucoma and macular degeneration.
              </article>
            </div>
            <div className="w-1/2 border p-4 flex flex-col gap-5">
              <h1 className="text-c-primary font-semibold">| Objective (O)</h1>
              <article className="ml-2">
                Visual Acuity (uncorrected):
                <br /> - Right Eye (OD): 20/25 <br /> - Left Eye (OS): 20/50
                <br />
                <br />
                Intraocular Pressure (IOP): <br /> - OD: 18 mmHg <br /> - OS: 22
                mmHg <br /> <br />
                External Exam: <br /> - Eyelids: Normal <br /> - Conjunctiva:
                Clear <br /> - Sclera: White <br />
                <br />
                Slit Lamp Exam: <br /> - Cornea: Clear <br /> - Anterior
                Chamber: Deep and quiet <br /> - Lens: Mild nuclear sclerosis
                bilaterally
              </article>
            </div>
          </div>
          <div className="w-full flex">
            <div className="w-1/2 border p-4 flex flex-col gap-5">
              <h1 className="text-c-primary font-semibold">| Assessment (A)</h1>
              <article className="ml-2">
                1. Age-related macular degeneration (dry) <br /> 2. Suspected
                glaucoma in the left eye
              </article>
            </div>
            <div className="w-1/2 border p-4 flex flex-col gap-5">
              <h1 className="text-c-primary font-semibold">| Plan (P)</h1>
              <article className="ml-2">
                1. Monitoring: Schedule follow-up in 6 months for IOP check and
                optic nerve evaluation. <br />
                2. OCT: Obtain optical coherence tomography to assess retinal
                layers and optic nerve head. <br />
                3. Lifestyle Counseling: Encourage UV-protective eyewear and
                smoking cessation. <br />
                4. Referrals: Refer to a glaucoma specialist for further
                evaluation if IOP or optic nerve findings worsen. <br />
                5. Education: Discussed importance of monitoring changes in
                vision and advised to report any worsening symptoms.
              </article>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SoapRecord;
