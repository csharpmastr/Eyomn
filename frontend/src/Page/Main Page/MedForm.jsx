import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AiOutlineArrowLeft } from "react-icons/ai";
import EyeSketch from "../../Component/ui/EyeSketch";
import OD from "../../assets/Image/OD.png";
import OS from "../../assets/Image/OS.png";
import CROSS from "../../assets/Image/CROSS.png";
import BLANK_OD from "../../assets/Image/BLANKOD.png";
import BLANK_OS from "../../assets/Image/BLANKOS.png";
import FRONT_OD from "../../assets/Image/FRONTOD.png";
import FRONT_OS from "../../assets/Image/FRONTOS.png";
import { useAddNote } from "../../Hooks/useAddNote";
import Loader from "../../Component/ui/Loader";
import SuccessModal from "../../Component/ui/SuccessModal";
import { useDispatch, useSelector } from "react-redux";
import { FileUploader } from "react-drag-drop-files";
import { FiPlus } from "react-icons/fi";
import { TiUpload } from "react-icons/ti";
import Modal from "../../Component/ui/Modal";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { addNewRawNote } from "../../Slice/NoteSlice";
import {
  cleanData,
  extractSoapData,
  formatPatientNotes,
  mergeDeep,
} from "../../Helper/Helper";
import {
  storeGeneratedSoap,
  summarizeInitialPatientCase,
} from "../../Service/PatientService";

const MedForm = () => {
  const { patientId } = useParams();
  const { noteId } = useParams();
  const rawNotes = useSelector(
    (state) => state.reducer.note.rawNotes[patientId]
  );
  const patients = useSelector((state) => state.reducer.patient.patients);
  const patient = patients.find((patient) => patient.patientId === patientId);

  const doctors = useSelector((state) => state.reducer.doctor.doctor);
  const doctor = doctors.find((doc) => doc.staffId === patient.doctorId);

  const user = useSelector((state) => state.reducer.user.user);
  const [currentPage, setCurrentPage] = useState(0);
  const pageTitles = ["Subjective", "Objective", "Assessment", "Plan"];
  const reduxDispatch = useDispatch();
  const [isCanvasOpen, setIsCanvasOpen] = useState(false);
  const [selectedBG, setSelectedBG] = useState("OD");
  const navigate = useNavigate();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [initLoad, setInitLoad] = useState(false);
  const { addNote, isLoading, error } = useAddNote();
  const [isSuccess, setIsSuccess] = useState();
  const [isError, setIsError] = useState(false);
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [soap, setSoap] = useState(null);
  const [canvasImages, setCanvasImages] = useState({
    OD: "",
    OS: "",
    CROSS: "",
    BLANK_OD: "",
    BLANK_OS: "",
    FRONT_OD: "",
    FRONT_OS: "",
  });

  const initialMedFormData = {
    //Subjective
    initial_observation: {
      options: {
        headache: false,
        bov: false,
        halo: false,
        photophobia: false,
        diplopia: false,
        tearing: false,
        glare: false,
        eyepain: false,
      },
      additional_note: "",
    },

    general_health_hx: {
      option: {
        hypertension: false,
        cardiovas_prob: false,
        diabetes: false,
        asthma: false,
      },
      last_exam: "",
      additional_note: "",
    },

    ocular_history: {
      option: {
        glaucoma: false,
        cataract: false,
        astigmatism: false,
        macular: false,
      },
      last_exam: "",
      additional_note: "",
    },

    fam_ocular_history: {
      option: {
        glaucoma: false,
        cataract: false,
        astigmatism: false,
        macular: false,
      },
      additional_note: "",
    },

    current_medication: "",
    lifestyle: "",

    //Objective
    bp: "",
    bg: "",
    hr: "",
    o2_saturation: "",
    temperature: "",

    visual_acuity: {
      habitual_va: {
        od: "",
        os: "",
        ou: "",
        custom_od: "",
        custom_os: "",
        custom_ou: "",
      },
      unaided_va: {
        od: "",
        os: "",
        ou: "",
        custom_od: "",
        custom_os: "",
        custom_ou: "",
      },
      pinhole_va: {
        od: "",
        os: "",
        custom_od: "",
        custom_os: "",
      },
    },

    retinoscopy: {
      with_drop: {
        od: "",
        os: "",
        custom_od: "",
        custom_os: "",
      },
      without_drop: {
        od: "",
        os: "",
        custom_od: "",
        custom_os: "",
      },
    },

    dominant_EH: {
      dominant_eye: {
        left: false,
        right: false,
      },
      dominant_hand: {
        left: false,
        right: false,
      },
      additional_note: "",
    },

    pupillary_distance: {
      od: "",
      os: "",
      ou: "",
      additional_note: "",
    },

    cover_test: {
      od: {
        with_rx: {
          near: false,
          distance: false,
          tropia: false,
          phoria: false,
        },
        without_rx: {
          near: false,
          distance: false,
          tropia: false,
          phoria: false,
        },
      },
      os: {
        with_rx: {
          near: false,
          distance: false,
          tropia: false,
          phoria: false,
        },
        without_rx: {
          near: false,
          distance: false,
          tropia: false,
          phoria: false,
        },
      },
      additional_note_od: "",
      additional_note_os: "",
    },

    confrontation_test: {
      od: "",
      os: "",
      od_image: "",
      os_image: "",
    },

    stereopsis: {
      stereopsis_score: {
        od: "",
        os: "",
      },
      perceived_DO: {
        od: {
          yes: false,
          no: false,
        },
        os: {
          yes: false,
          no: false,
        },
      },
      additional_note: "",
    },

    diplopia_test: {
      present: false,
      absent: false,
      additional_note: "",
    },

    corneal_reflex_test: {
      od: {
        present: false,
        absent: false,
        additional_note_od: "",
      },
      os: {
        present: false,
        absent: false,
        additional_note_os: "",
      },
    },

    motility_test: {
      od_note: "",
      os_note: "",
    },

    saccadic_test: {
      od: {
        present: false,
        absent: false,
        additional_note_od: "",
      },
      os: {
        present: false,
        absent: false,
        additional_note_os: "",
      },
    },

    amsler_grid: {
      od: "",
      os: "",
      custom_od: "",
      custom_os: "",
    },

    worths_FD: {
      od: "",
      os: "",
    },

    ishihara_test: {
      od: "",
      os: "",
    },

    schirmer_test: {
      od: "",
      os: "",
    },

    IOP: {
      od: "",
      os: "",
      image: "",
    },

    internal_examination: {
      image: {
        od: "",
        os: "",
      },
      cup_disc_ratio: {
        od: "",
        os: "",
      },
      av_ratio: {
        od: "",
        os: "",
      },
      macula: {
        od: "",
        os: "",
      },
      vitreous: {
        od: "",
        os: "",
      },
      vessel: {
        od: "",
        os: "",
      },
      venous_pulse: {
        od: "",
        os: "",
      },
      forveal_reflex: {
        od: "",
        os: "",
      },
      periphery: {
        od: "",
        os: "",
      },
    },

    external_examination: {
      image: {
        od: "",
        os: "",
      },
      eyebrow: {
        od: {
          options: {
            inflamation: false,
            dandruff: false,
            crust_formation: false,
            foreign_body: false,
          },
          additional_note: "",
        },
        os: {
          options: {
            inflamation: false,
            dandruff: false,
            crust_formation: false,
            foreign_body: false,
          },
          additional_note: "",
        },
      },

      eyelashes: {
        od: {
          options: {
            crusting: false,
            discharge: false,
            eyelash_lice: false,
            foreign_body: false,
          },
          additional_note: "",
        },
        os: {
          options: {
            crusting: false,
            discharge: false,
            eyelash_lice: false,
            foreign_body: false,
          },
          additional_note: "",
        },
      },

      eyelids: {
        od: {
          options: {
            blepharitis: false,
            edema: false,
            chalazion: false,
            stye: false,
          },
          additional_note: "",
        },
        os: {
          options: {
            blepharitis: false,
            edema: false,
            chalazion: false,
            stye: false,
          },
          additional_note: "",
        },
      },

      cornea: {
        od: {
          options: {
            corneal_abrasion: false,
            keratitis: false,
            pterygium: false,
            corneal_scar: false,
          },
          additional_note: "",
        },
        os: {
          options: {
            corneal_abrasion: false,
            keratitis: false,
            pterygium: false,
            corneal_scar: false,
          },
          additional_note: "",
        },
      },

      limbus: {
        od: {
          options: {
            pinguecula: false,
            melanosis: false,
            scarring: false,
            foreign_debris: false,
          },
          additional_note: "",
        },
        os: {
          options: {
            pinguecula: false,
            melanosis: false,
            scarring: false,
            foreign_debris: false,
          },
          additional_note: "",
        },
      },

      pupil: {
        od: {
          options: {
            miosis_or_mydriasis: false,
            IIS: false,
            distorted_pupil: false,
            LRA: false,
          },
          additional_note: "",
        },
        os: {
          options: {
            miosis_or_mydriasis: false,
            IIS: false,
            distorted_pupil: false,
            LRA: false,
          },
          additional_note: "",
        },
      },

      iris: {
        od: {
          options: {
            iris_neovascularization: false,
            posterior_synechiae: false,
            hyphema: false,
            inflammatory_deposit: false,
          },
          additional_note: "",
        },
        os: {
          options: {
            iris_neovascularization: false,
            posterior_synechiae: false,
            hyphema: false,
            inflammatory_deposit: false,
          },
          additional_note: "",
        },
      },
    },

    contact_lens_prescription: {
      date_prescribed: "",
      od: "",
      os: "",
    },

    //Assessment
    diagnosis: "",

    //Plan
    new_prescription_od: {
      np_ADD: "",
      np_NEAR: "",
      np_FAR: "",
    },
    new_prescription_os: {
      np_ADD: "",
      np_NEAR: "",
      np_FAR: "",
    },
    new_prescription_ou: {
      np_ADD: "",
      np_NEAR: "",
      np_FAR: "",
    },
    management: "",
    followup_care: "",
  };
  const [medformData, setMedformData] = useState(() => {
    const savedData = sessionStorage.getItem("medformData");

    return savedData ? JSON.parse(savedData) : initialMedFormData;
  });

  useEffect(() => {
    if (medformData) {
      sessionStorage.setItem("medformData", JSON.stringify(medformData));
    }
  }, [medformData]);

  useEffect(() => {
    if (noteId && rawNotes) {
      const rawNote = rawNotes.find((raw) => raw.noteId === noteId);
      if (rawNote) {
        setMedformData((prevData) => {
          const updatedData = mergeDeep({ ...initialMedFormData }, rawNote);
          return updatedData;
        });
      }
    } else {
      setMedformData(medformData);
    }
  }, [noteId, rawNotes]);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (hasUnsavedChanges) {
        const confirmationMessage =
          "You have unsaved changes. Are you sure you want to leave?";
        event.returnValue = confirmationMessage;
        return confirmationMessage;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);

  const handleSubmitNote = async (e) => {
    e.preventDefault();
    const transformedData = cleanData(medformData);
    const formattedSoap = formatPatientNotes(transformedData);
    console.log(transformedData);

    console.log(formattedSoap);

    setHasUnsavedChanges(false);
    console.log(user.firebaseUid);

    try {
      const response = await addNote(medformData, patientId);

      if (response) {
        console.log(response);
        reduxDispatch(
          addNewRawNote({
            [patientId]: {
              ...medformData,
              noteId: response.noteId,
              createdAt: response.createdAt,
            },
          })
        );
        setIsSuccess(true);
        storeGeneratedSoap(
          formattedSoap,
          patientId,
          doctor.staffId,
          user.firebaseUid,
          response.noteId
        );
      }
    } catch (error) {
      setIsError(true);
      console.log(error);
    }
  };

  const navigateAfterSuccess = () => {
    navigate(`/scribe/${patientId}`);
    sessionStorage.setItem("currentPath", `/scribe/${patientId}`);
  };

  const handleNext = async (e) => {
    e.preventDefault();

    const transformedData = cleanData(medformData);
    const formattedData = formatPatientNotes(transformedData);
    console.log(formattedData);

    if (currentPage < pageTitles.length - 1) {
      if (currentPage === 1) {
        if (!noteId) {
          if (!soap) {
            setInitLoad(true);
            try {
              const response = await summarizeInitialPatientCase(formattedData);
              if (response) {
                console.log(response);
                setSoap(extractSoapData(response));
                setCurrentPage((prevPage) => prevPage + 1);
              } else {
                console.error("No response received");
              }
            } catch (error) {
              console.error("Error during API call:", error);
            } finally {
              setInitLoad(false);
            }
          } else {
            console.log("running");

            setCurrentPage((prevPage) => prevPage + 1);
          }
        } else {
          console.log("log");

          setCurrentPage((prevPage) => prevPage + 1);
        }
      } else {
        console.log("why");
        setCurrentPage((prevPage) => prevPage + 1);
      }
    }
  };

  const handleBackPage = (e) => {
    e.preventDefault();
    if (currentPage > 0) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const toggle = () => setIsCanvasOpen(!isCanvasOpen);

  const handleSaveCanvas = (image) => {
    setCanvasImages((prevImages) => ({
      ...prevImages,
      [selectedBG]: image,
    }));

    switch (selectedBG) {
      case "CROSS":
        setMedformData((prevData) => ({
          ...prevData,
          confrontation_test: {
            ...prevData.confrontation_test,
            image: image,
          },
        }));
        break;
    }

    setIsCanvasOpen(false);
  };

  const handleImageClick = (value) => {
    setSelectedBG(value);
    toggle();
  };

  useEffect(() => {
    sessionStorage.setItem("currentPath", location.pathname);
  }, []);

  const handleChange = (e, nestedPath) => {
    const { type, checked, value } = e.target;

    if (nestedPath) {
      const keys = nestedPath.split(".");

      setMedformData((prevData) => {
        const current = { ...prevData };
        let nested = current;

        keys.forEach((key, index) => {
          if (index === keys.length - 1) {
            nested[key] = type === "checkbox" ? checked : value;
          } else {
            nested[key] = nested[key] || {};
            nested = nested[key];
          }
        });

        return current;
      });
    } else {
      setMedformData((prevData) => ({
        ...prevData,
        [e.target.name]: type === "checkbox" ? checked : value,
      }));
    }
    setHasUnsavedChanges(true);
  };

  const removeNullValues = (obj) => {
    if (typeof obj !== "object" || obj === null) {
      return obj;
    }

    return Object.fromEntries(
      Object.entries(obj)
        .filter(([key, value]) => value !== null && value !== "")
        .map(([key, value]) => [key, removeNullValues(value)])
    );
  };
  const handleBack = () => {
    navigate(`/scribe/${patientId}`);
    sessionStorage.removeItem("medformData");
    sessionStorage.setItem("currentPath", `/scribe/${patientId}`);
  };

  const handleImageUpload = (file) => {
    if (file) {
      setImageFile(file);

      const reader = new FileReader();

      reader.onloadend = () => {
        const base64Image = reader.result;
        setImage(base64Image);
      };

      reader.readAsDataURL(file);
    }
  };
  const handleSaveImage = (e) => {
    e.preventDefault();
    if (image) {
      setMedformData((prevMedform) => ({
        ...prevMedform,
        iop: {
          ...prevMedform.iop,
          image: image,
        },
      }));
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
  };

  return (
    <>
      {(isLoading || initLoad) && (
        <Loader
          description={
            isLoading
              ? "Saving Patient Note, please wait..."
              : "Summarizing Initial Patient Case, please wait..."
          }
        />
      )}

      <div className="w-full p-4 md:p-6 2xl:p-8 bg-bg-mc">
        <header className="flex flex-col md:flex-row text-f-dark justify-between mb-6">
          <div className="flex gap-2 font-Poppins">
            <div>
              <p
                className="flex gap-2 text-p-sm md:text-p-rg  hover:cursor-pointer"
                onClick={handleBack}
              >
                <AiOutlineArrowLeft className="h-5 w-5" />
                Back
              </p>
              <h1 className="font-Poppins text-p-sm md:text-p-rg font-semibold">
                Patient Medical Records
              </h1>
            </div>
          </div>
          <nav className="flex gap-1 justify-center">
            {pageTitles.map((med_page, index) => (
              <div
                key={index}
                className={`w-fit pl-2 py-2 cursor-pointer ${
                  currentPage === index
                    ? "border-b-2 border-c-primary font-semibold text-c-primary"
                    : "border-b-2 border-f-gray font-medium text-c-gray3"
                }`}
                onClick={() => setCurrentPage(index)}
              >
                <p>{med_page}</p>
              </div>
            ))}
          </nav>
        </header>
        <form className="">
          <div className="w-full bg-white border border-f-gray rounded-lg ">
            <header className=" bg-bg-sb border border-b-f-gray flex justify-center items-center h-14 font-semibold text-p-rg md:text-p-lg text-c-secondary">
              <h1>Medical Form ({pageTitles[currentPage]})</h1>
            </header>
            {currentPage === 0 && (
              <div className="p-5 flex flex-col gap-5">
                <div className="flex gap-5 flex-col md:flex-row">
                  <div className="border border-f-gray p-5 bg-bg-mc rounded-md w-full md:w-1/2">
                    <label className="text-p-sm md:text-p-rg font-semibold text-c-secondary">
                      | Initial Obeservation
                    </label>
                    <section className="text-p-sc md:text-p-sm font-semibold mt-5 flex">
                      <div className="flex flex-col gap-3 w-1/2">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            name="initial_headache"
                            checked={
                              medformData.initial_observation.options.headache
                            }
                            onChange={(e) =>
                              handleChange(
                                e,
                                "initial_observation.options.headache"
                              )
                            }
                            className="w-6 h-6"
                          />
                          <span className="text-c-gray3 font-medium text-p-sc md:text-p-sm">
                            Headache
                          </span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            name="initial_bov"
                            checked={
                              medformData.initial_observation.options.bov
                            }
                            onChange={(e) =>
                              handleChange(e, "initial_observation.options.bov")
                            }
                            className="w-6 h-6"
                          />
                          <span className="text-c-gray3 font-medium text-p-sc md:text-p-sm">
                            BOV
                          </span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            name="initial_halo"
                            checked={
                              medformData.initial_observation.options.halo
                            }
                            onChange={(e) =>
                              handleChange(
                                e,
                                "initial_observation.options.halo"
                              )
                            }
                            className="w-6 h-6"
                          />
                          <span className="text-c-gray3 font-medium text-p-sc md:text-p-sm">
                            Halo
                          </span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            name="initial_photophobia"
                            checked={
                              medformData.initial_observation.options
                                .photophobia
                            }
                            onChange={(e) =>
                              handleChange(
                                e,
                                "initial_observation.options.photophobia"
                              )
                            }
                            className="w-6 h-6"
                          />
                          <span className="text-c-gray3 font-medium text-p-sc md:text-p-sm">
                            Photophobia
                          </span>
                        </label>
                      </div>
                      <div className="flex flex-col gap-3 w-1/2">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            name="initial_diplopia"
                            checked={
                              medformData.initial_observation.options.diplopia
                            }
                            onChange={(e) =>
                              handleChange(
                                e,
                                "initial_observation.options.diplopia"
                              )
                            }
                            className="w-6 h-6"
                          />
                          <span className="text-c-gray3 font-medium text-p-sc md:text-p-sm">
                            Diplopia
                          </span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            name="initial_tearing"
                            checked={
                              medformData.initial_observation.options.tearing
                            }
                            onChange={(e) =>
                              handleChange(
                                e,
                                "initial_observation.options.tearing"
                              )
                            }
                            className="w-6 h-6"
                          />
                          <span className="text-c-gray3 font-medium text-p-sc md:text-p-sm">
                            Tearing
                          </span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            name="initial_glare"
                            checked={
                              medformData.initial_observation.options.glare
                            }
                            onChange={(e) =>
                              handleChange(
                                e,
                                "initial_observation.options.glare"
                              )
                            }
                            className="w-6 h-6"
                          />
                          <span className="text-c-gray3 font-medium text-p-sc md:text-p-sm">
                            Glare
                          </span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            name="initial_eyepain"
                            checked={
                              medformData.initial_observation.options.eyepain
                            }
                            onChange={(e) =>
                              handleChange(
                                e,
                                "initial_observation.options.eyepain"
                              )
                            }
                            className="w-6 h-6"
                          />
                          <span className="text-c-gray3 font-medium text-p-sc md:text-p-sm">
                            Eye pain
                          </span>
                        </label>
                      </div>
                    </section>
                    <textarea
                      type="text"
                      name="initial_additional_note"
                      value={medformData.initial_observation.additional_note}
                      onChange={(e) =>
                        handleChange(e, "initial_observation.additional_note")
                      }
                      className="mt-3 h-24 w-full px-4 py-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                      placeholder="If option not available"
                    />
                  </div>
                  <div className="border border-f-gray p-5 bg-bg-mc rounded-md w-full md:w-1/2">
                    <label className="text-p-sm md:text-p-rg font-semibold text-c-secondary">
                      | General Health Hx
                    </label>
                    <section className="text-p-sc md:text-p-sm font-semibold mt-5 flex">
                      <div className="flex flex-col gap-3 w-1/2">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            name="gen_health_hypertension"
                            checked={
                              medformData.general_health_hx.option.hypertension
                            }
                            onChange={(e) =>
                              handleChange(
                                e,
                                "general_health_hx.option.hypertension"
                              )
                            }
                            className="w-6 h-6"
                          />
                          <span className="text-c-gray3 font-medium text-p-sc md:text-p-sm">
                            Hypertension
                          </span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            name="gen_health_cardiovascular_problem"
                            checked={
                              medformData.general_health_hx.option
                                .cardiovas_prob
                            }
                            onChange={(e) =>
                              handleChange(
                                e,
                                "general_health_hx.option.cardiovas_prob"
                              )
                            }
                            className="w-6 h-6"
                          />
                          <span className="text-c-gray3 font-medium text-p-sc md:text-p-sm">
                            Cardiovascular Problem
                          </span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            name="gen_health_diabetes"
                            checked={
                              medformData.general_health_hx.option.diabetes
                            }
                            onChange={(e) =>
                              handleChange(
                                e,
                                "general_health_hx.option.diabetes"
                              )
                            }
                            className="w-6 h-6"
                          />
                          <span className="text-c-gray3 font-medium text-p-sc md:text-p-sm">
                            Diabetes
                          </span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            name="gen_health_asthma"
                            checked={
                              medformData.general_health_hx.option.asthma
                            }
                            onChange={(e) =>
                              handleChange(e, "general_health_hx.option.asthma")
                            }
                            className="w-6 h-6"
                          />
                          <span className="text-c-gray3 font-medium text-p-sc md:text-p-sm">
                            Asthma
                          </span>
                        </label>
                      </div>
                      <div className="flex flex-col gap-3 w-1/2 items-end">
                        <label>
                          <p className="text-c-gray3 font-medium text-p-sc md:text-p-sm">
                            Date of last Medical Exam
                          </p>
                          <input
                            type="date"
                            name="gen_health_gen_date"
                            max={new Date().toISOString().split("T")[0]}
                            value={medformData.general_health_hx.last_exam}
                            onChange={(e) =>
                              handleChange(e, "general_health_hx.last_exam")
                            }
                            className="mt-1 w-fit h-fit px-4 py-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                          />
                        </label>
                      </div>
                    </section>
                    <textarea
                      type="text"
                      name="gen_health_additional_note"
                      value={medformData.general_health_hx.additional_note}
                      onChange={(e) =>
                        handleChange(e, "general_health_hx.additional_note")
                      }
                      className="mt-3 h-24 w-full px-4 py-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                      placeholder="If option not available"
                    />
                  </div>
                </div>
                <div className="flex gap-5 flex-col md:flex-row">
                  <div className="border border-f-gray p-5 bg-bg-mc rounded-md w-full md:w-1/2">
                    <label className="text-p-sm md:text-p-rg font-semibold text-c-secondary">
                      | Ocular Condition/History
                    </label>
                    <section className="text-p-sc md:text-p-sm font-semibold mt-5 flex">
                      <div className="flex flex-col gap-3 w-1/2">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            name="occhis_glaucoma"
                            checked={medformData.ocular_history.option.glaucoma}
                            onChange={(e) =>
                              handleChange(e, "ocular_history.option.glaucoma")
                            }
                            className="w-6 h-6"
                          />
                          <span className="text-c-gray3 font-medium text-p-sc md:text-p-sm">
                            Glaucoma
                          </span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            name="occhis_cataract"
                            checked={medformData.ocular_history.option.cataract}
                            onChange={(e) =>
                              handleChange(e, "ocular_history.option.cataract")
                            }
                            className="w-6 h-6"
                          />
                          <span className="text-c-gray3 font-medium text-p-sc md:text-p-sm">
                            Cataract
                          </span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            name="occhis_stigmatism"
                            checked={
                              medformData.ocular_history.option.astigmatism
                            }
                            onChange={(e) =>
                              handleChange(
                                e,
                                "ocular_history.option.astigmatism"
                              )
                            }
                            className="w-6 h-6"
                          />
                          <span className="text-c-gray3 font-medium text-p-sc md:text-p-sm">
                            Astigmatism
                          </span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            name="occhis_macular"
                            checked={medformData.ocular_history.option.macular}
                            onChange={(e) =>
                              handleChange(e, "ocular_history.option.macular")
                            }
                            className="w-6 h-6"
                          />
                          <span className="text-c-gray3 font-medium text-p-sc md:text-p-sm">
                            Macular
                          </span>
                        </label>
                      </div>
                      <div className="flex flex-col gap-3 w-1/2 items-end">
                        <label>
                          <p className="text-c-gray3 font-medium text-p-sc md:text-p-sm">
                            Date of last Eye Exam:
                          </p>
                          <input
                            type="date"
                            name="occhis_date"
                            max={new Date().toISOString().split("T")[0]}
                            value={medformData.ocular_history.last_exam}
                            onChange={(e) =>
                              handleChange(e, "ocular_history.last_exam")
                            }
                            className="mt-1 w-fit h-fit px-4 py-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                          />
                        </label>
                      </div>
                    </section>
                    <textarea
                      type="text"
                      name="occhis_additional_note"
                      value={medformData.ocular_history.additional_note}
                      onChange={(e) =>
                        handleChange(e, "ocular_history.additional_note")
                      }
                      className="mt-3 h-24 w-full px-4 py-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                      placeholder="If option not available"
                    />
                  </div>
                  <div className="border border-f-gray p-5 bg-bg-mc rounded-md w-full md:w-1/2">
                    <label className="text-p-sm md:text-p-rg font-semibold text-c-secondary">
                      | Family Ocular Conditon
                    </label>
                    <section className="text-p-sc md:text-p-sm font-semibold mt-5 flex flex-col gap-3">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          name="fam_occhis_glaucoma"
                          checked={
                            medformData.fam_ocular_history.option.glaucoma
                          }
                          onChange={(e) =>
                            handleChange(
                              e,
                              "fam_ocular_history.option.glaucoma"
                            )
                          }
                          className="w-6 h-6"
                        />
                        <span className="text-c-gray3 font-medium text-p-sc md:text-p-sm">
                          Glaucoma
                        </span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          name="fam_occhis_cataract"
                          checked={
                            medformData.fam_ocular_history.option.cataract
                          }
                          onChange={(e) =>
                            handleChange(
                              e,
                              "fam_ocular_history.option.cataract"
                            )
                          }
                          className="w-6 h-6"
                        />
                        <span className="text-c-gray3 font-medium text-p-sc md:text-p-sm">
                          Cataract
                        </span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          name="fam_occhis_astigmatism"
                          checked={
                            medformData.fam_ocular_history.option.astigmatism
                          }
                          onChange={(e) =>
                            handleChange(
                              e,
                              "fam_ocular_history.option.astigmatism"
                            )
                          }
                          className="w-6 h-6"
                        />
                        <span className="text-c-gray3 font-medium text-p-sc md:text-p-sm">
                          Astigmatism
                        </span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          name="fam_occhis_macular"
                          checked={
                            medformData.fam_ocular_history.option.macular
                          }
                          onChange={(e) =>
                            handleChange(e, "fam_ocular_history.option.macular")
                          }
                          className="w-6 h-6"
                        />
                        <span className="text-c-gray3 font-medium text-p-sc md:text-p-sm">
                          Macular
                        </span>
                      </label>
                    </section>
                    <textarea
                      type="text"
                      name="fam_occhis_additional_note"
                      value={medformData.fam_ocular_history.additional_note}
                      onChange={(e) =>
                        handleChange(e, "fam_ocular_history.additional_note")
                      }
                      className="mt-3 h-24 w-full px-4 py-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                      placeholder="If option not available"
                    />
                  </div>
                </div>
                <div className="flex gap-5 flex-col md:flex-row">
                  <div className="border border-f-gray p-5 bg-bg-mc rounded-md w-full md:w-1/2">
                    <label className="text-p-sm md:text-p-rg font-semibold text-c-secondary">
                      | Current Medication
                    </label>
                    <textarea
                      type="text"
                      name="current_medication"
                      value={medformData.current_medication}
                      onChange={(e) => handleChange(e, "current_medication")}
                      className="mt-5 h-52 w-full px-4 py-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                      placeholder="If option not available"
                    />
                  </div>
                  <div className="border border-f-gray p-5 bg-bg-mc rounded-md w-full md:w-1/2">
                    <label className="text-p-sm md:text-p-rg font-semibold text-c-secondary">
                      | Lifestyle
                    </label>
                    <textarea
                      type="text"
                      name="lifestyle"
                      value={medformData.lifestyle}
                      onChange={(e) => handleChange(e, "lifestyle")}
                      className="mt-5 h-52 w-full px-4 py-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                      placeholder="If option not available"
                    />
                  </div>
                </div>
              </div>
            )}
            {currentPage === 1 && (
              <div className="p-5 flex flex-col gap-5">
                <div className="border border-f-gray p-5 bg-bg-mc rounded-md flex gap-5 w-full flex-wrap md:flex-row">
                  <div className="flex-1">
                    <p className="text-f-gray font-medium text-p-sc md:text-p-sm text-nowrap">
                      Blood Pressure
                    </p>
                    <section className="relative w-[130px] lg:w-full">
                      <input
                        type="text"
                        name="bp"
                        value={medformData.bp}
                        onChange={(e) => handleChange(e, "bp")}
                        className="mt-2 w-full px-3 py-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                      />
                      <span className="px-2 py-1 bg-zinc-200 border rounded-md absolute top-4 right-2 text-p-sc md:text-p-sm text-f-gray2">
                        mm/Hg
                      </span>
                    </section>
                  </div>
                  <div className="flex-1">
                    <p className="text-f-gray font-medium text-p-sc md:text-p-sm text-nowrap">
                      Blood Glucose
                    </p>
                    <section className="relative w-[130px] lg:w-full">
                      <input
                        type="number"
                        name="bg"
                        min={0}
                        max={500}
                        value={medformData.bg}
                        onChange={(e) => handleChange(e, "bg")}
                        className="mt-2 w-full  px-3 py-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                      />
                      <span className="px-2 py-1 bg-zinc-200 border rounded-md absolute top-4 right-2 text-p-sc md:text-p-sm text-f-gray2">
                        mg/dL
                      </span>
                    </section>
                  </div>
                  <div className="flex-1">
                    <p className="text-f-gray font-medium text-p-sc md:text-p-sm text-nowrap">
                      Heart Rate
                    </p>
                    <section className="relative w-[130px] lg:w-full">
                      <input
                        type="number"
                        name="hr"
                        min={30}
                        max={220}
                        value={medformData.hr}
                        onChange={(e) => handleChange(e, "hr")}
                        className="mt-2 w-full  px-3 py-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                      />
                      <span className="px-3 py-1 bg-zinc-200 border rounded-md absolute top-4 right-2 text-p-sc md:text-p-sm text-f-gray2">
                        Bpm
                      </span>
                    </section>
                  </div>
                  <div className="flex-1">
                    <p className="text-f-gray font-medium text-p-sc md:text-p-sm text-nowrap">
                      O2 Saturation
                    </p>
                    <section className="relative w-[130px] lg:w-full">
                      <input
                        type="number"
                        name="o2_saturation"
                        min={0}
                        max={100}
                        value={medformData.o2_saturation}
                        onChange={(e) => handleChange(e, "o2_saturation")}
                        className="mt-2 w-full  px-3 py-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                      />
                      <span className="px-4 py-1 bg-zinc-200 border rounded-md absolute top-4 right-2 text-p-sc md:text-p-sm text-f-gray2">
                        %
                      </span>
                    </section>
                  </div>
                  <div className="flex-1">
                    <p className="text-f-gray font-medium text-p-sc md:text-p-sm text-nowrap">
                      Temperature
                    </p>
                    <section className="relative w-[130px] lg:w-full">
                      <input
                        type="number"
                        name="temperature"
                        step={0.1}
                        value={medformData.temperature}
                        onChange={(e) => handleChange(e, "temperature")}
                        className="mt-2 w-full  px-3 py-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                      />
                      <span className="px-4 py-1 bg-zinc-200 border rounded-md absolute top-4 right-2 text-p-sc md:text-p-sm text-f-gray2">
                        C/F
                      </span>
                    </section>
                  </div>
                </div>
                <div className="w-full">
                  <header className="flex justify-center py-2 rounded-t-md w-full border border-f-gray text-c-secondary text-p-sm md:text-p-rg font-semibold bg-bg-sb mb-1">
                    <h1>Visual Acuity</h1>
                  </header>
                  <div className="flex gap-1 flex-col md:flex-row">
                    <div className="border border-f-gray bg-bg-mc w-full md:w-1/2 p-5">
                      <label className="text-p-sm md:text-p-rg font-semibold text-c-secondary">
                        | Habitual VA
                      </label>
                      <section className=" mt-5 flex gap-3 w-full">
                        <div className="flex flex-col w-full">
                          <p className="text-p-sc md:text-p-sm font-medium text-f-gray">
                            OD
                          </p>
                          <select
                            name="habitual_od"
                            value={medformData.visual_acuity.habitual_va.od}
                            onChange={(e) => {
                              handleChange(e, "visual_acuity.habitual_va.od");
                              if (e.target.value !== "") {
                                handleChange(
                                  { target: { value: "" } },
                                  "visual_acuity.habitual_va.custom_od"
                                );
                              }
                            }}
                            className="mt-3 w-full p-3 border border-f-gray rounded-md text-f-dark  focus:outline-c-primary"
                          >
                            <option value="">Choose option</option>
                            <option value="20/20">20/20</option>
                            <option value="20/40">20/40</option>
                            <option value="20/60">20/60</option>
                            <option value="20/100">20/100</option>
                            <option value=" ">Other</option>
                          </select>
                          {medformData.visual_acuity.habitual_va.od === " " && (
                            <input
                              type="text"
                              name="habitual_od_custom"
                              value={
                                medformData.visual_acuity.habitual_va
                                  .custom_od || ""
                              }
                              onChange={(e) =>
                                handleChange(
                                  e,
                                  "visual_acuity.habitual_va.custom_od"
                                )
                              }
                              className="mt-3 w-full p-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                              placeholder="Enter custom value"
                            />
                          )}
                        </div>
                        <div className="flex flex-col w-full">
                          <p className="text-p-sc md:text-p-sm font-medium text-f-gray">
                            OS
                          </p>
                          <select
                            name="habitual_os"
                            value={medformData.visual_acuity.habitual_va.os}
                            onChange={(e) => {
                              handleChange(e, "visual_acuity.habitual_va.os");
                              if (e.target.value !== "") {
                                handleChange(
                                  { target: { value: "" } },
                                  "visual_acuity.habitual_va.custom_os"
                                );
                              }
                            }}
                            className="mt-3 w-full p-3 border border-f-gray rounded-md text-f-dark  focus:outline-c-primary"
                          >
                            <option value="">Choose option</option>
                            <option value="20/20">20/20</option>
                            <option value="20/40">20/40</option>
                            <option value="20/60">20/60</option>
                            <option value="20/100">20/100</option>
                            <option value=" ">Other</option>
                          </select>
                          {medformData.visual_acuity.habitual_va.os === " " && (
                            <input
                              type="text"
                              name="habitual_os_custom"
                              value={
                                medformData.visual_acuity.habitual_va
                                  .custom_os || ""
                              }
                              onChange={(e) =>
                                handleChange(
                                  e,
                                  "visual_acuity.habitual_va.custom_os"
                                )
                              }
                              className="mt-3 w-full p-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                              placeholder="Enter custom value"
                            />
                          )}
                        </div>
                        <div className="flex flex-col w-full">
                          <p className="text-p-sc md:text-p-sm font-medium text-f-gray">
                            OU
                          </p>
                          <select
                            name="habitual_ou"
                            value={medformData.visual_acuity.habitual_va.ou}
                            onChange={(e) => {
                              handleChange(e, "visual_acuity.habitual_va.ou");
                              if (e.target.value !== "") {
                                handleChange(
                                  { target: { value: "" } },
                                  "visual_acuity.habitual_va.custom_ou"
                                );
                              }
                            }}
                            className="mt-3 w-full p-3 border border-f-gray rounded-md text-f-dark  focus:outline-c-primary"
                          >
                            <option value="">Choose option</option>
                            <option value="20/20">20/20</option>
                            <option value="20/40">20/40</option>
                            <option value="20/60">20/60</option>
                            <option value="20/100">20/100</option>
                            <option value=" ">Other</option>
                          </select>
                          {medformData.visual_acuity.habitual_va.ou === " " && (
                            <input
                              type="text"
                              name="habitual_ou_custom"
                              value={
                                medformData.visual_acuity.habitual_va
                                  .custom_ou || ""
                              }
                              onChange={(e) =>
                                handleChange(
                                  e,
                                  "visual_acuity.habitual_va.custom_ou"
                                )
                              }
                              className="mt-3 w-full p-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                              placeholder="Enter custom value"
                            />
                          )}
                        </div>
                      </section>
                    </div>
                    <div className="border border-f-gray bg-bg-mc w-full md:w-1/2 rounded-bl-md p-5">
                      <label className="text-p-sm md:text-p-rg font-semibold text-c-secondary">
                        | Unaided VA
                      </label>
                      <section className=" mt-5 flex gap-3 w-full">
                        <div className="flex flex-col w-full">
                          <p className="text-p-sc md:text-p-sm font-medium text-f-gray">
                            OD
                          </p>
                          <select
                            name="unaided_od"
                            value={medformData.visual_acuity.unaided_va.od}
                            onChange={(e) => {
                              handleChange(e, "visual_acuity.unaided_va.od");
                              if (e.target.value !== "") {
                                handleChange(
                                  { target: { value: "" } },
                                  "visual_acuity.unaided_va.custom_od"
                                );
                              }
                            }}
                            className="mt-3 w-full p-3 border border-f-gray rounded-md text-f-dark  focus:outline-c-primary"
                          >
                            <option value="">Choose option</option>
                            <option value="20/20">20/20</option>
                            <option value="20/40">20/40</option>
                            <option value="20/60">20/60</option>
                            <option value="20/100">20/100</option>
                            <option value=" ">Other</option>
                          </select>
                          {medformData.visual_acuity.unaided_va.od === " " && (
                            <input
                              type="text"
                              name="unaided_od_custom"
                              value={
                                medformData.visual_acuity.unaided_va
                                  .custom_od || ""
                              }
                              onChange={(e) =>
                                handleChange(
                                  e,
                                  "visual_acuity.unaided_va.custom_od"
                                )
                              }
                              className="mt-3 w-full p-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                              placeholder="Enter custom value"
                            />
                          )}
                        </div>
                        <div className="flex flex-col w-full">
                          <p className="text-p-sc md:text-p-sm font-medium text-f-gray">
                            OS
                          </p>
                          <select
                            name="unaided_os"
                            value={medformData.visual_acuity.unaided_va.os}
                            onChange={(e) => {
                              handleChange(e, "visual_acuity.unaided_va.os");
                              if (e.target.value !== "") {
                                handleChange(
                                  { target: { value: "" } },
                                  "visual_acuity.unaided_va.custom_os"
                                );
                              }
                            }}
                            className="mt-3 w-full p-3 border border-f-gray rounded-md text-f-dark  focus:outline-c-primary"
                          >
                            <option value="">Choose option</option>
                            <option value="20/20">20/20</option>
                            <option value="20/40">20/40</option>
                            <option value="20/60">20/60</option>
                            <option value="20/100">20/100</option>
                            <option value=" ">Other</option>
                          </select>
                          {medformData.visual_acuity.unaided_va.os === " " && (
                            <input
                              type="text"
                              name="unaided_os_custom"
                              value={
                                medformData.visual_acuity.unaided_va
                                  .custom_os || ""
                              }
                              onChange={(e) =>
                                handleChange(
                                  e,
                                  "visual_acuity.unaided_va.custom_os"
                                )
                              }
                              className="mt-3 w-full p-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                              placeholder="Enter custom value"
                            />
                          )}
                        </div>
                        <div className="flex flex-col w-full">
                          <p className="text-p-sc md:text-p-sm font-medium text-f-gray">
                            OU
                          </p>
                          <select
                            name="unaided_ou"
                            value={medformData.visual_acuity.unaided_va.ou}
                            onChange={(e) => {
                              handleChange(e, "visual_acuity.unaided_va.ou");
                              if (e.target.value !== "") {
                                handleChange(
                                  { target: { value: "" } },
                                  "visual_acuity.unaided_va.custom_ou"
                                );
                              }
                            }}
                            className="mt-3 w-full p-3 border border-f-gray rounded-md text-f-dark  focus:outline-c-primary"
                          >
                            <option value="">Choose option</option>
                            <option value="20/20">20/20</option>
                            <option value="20/40">20/40</option>
                            <option value="20/60">20/60</option>
                            <option value="20/100">20/100</option>
                            <option value=" ">Other</option>
                          </select>
                          {medformData.visual_acuity.unaided_va.ou === " " && (
                            <input
                              type="text"
                              name="unaided_ou_custom"
                              value={
                                medformData.visual_acuity.unaided_va
                                  .custom_ou || ""
                              }
                              onChange={(e) =>
                                handleChange(
                                  e,
                                  "visual_acuity.unaided_va.custom_ou"
                                )
                              }
                              className="mt-3 w-full p-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                              placeholder="Enter custom value"
                            />
                          )}
                        </div>
                      </section>
                    </div>
                    <div className="border border-f-gray bg-bg-mc w-full md:w-1/3 rounded-br-md p-5">
                      <label className="text-p-sm md:text-p-rg font-semibold text-c-secondary">
                        | Pinhole VA
                      </label>
                      <section className=" mt-5 flex gap-3 w-full">
                        <div className="flex flex-col w-full">
                          <p className="text-p-sc md:text-p-sm font-medium text-f-gray">
                            OD
                          </p>
                          <select
                            name="pinhole_od"
                            value={medformData.visual_acuity.pinhole_va.od}
                            onChange={(e) => {
                              handleChange(e, "visual_acuity.pinhole_va.od");
                              if (e.target.value !== "") {
                                handleChange(
                                  { target: { value: "" } },
                                  "visual_acuity.pinhole_va.custom_od"
                                );
                              }
                            }}
                            className="mt-3 w-full p-3 border border-f-gray rounded-md text-f-dark  focus:outline-c-primary"
                          >
                            <option value="">Choose option</option>
                            <option value="20/20">20/20</option>
                            <option value="20/40">20/40</option>
                            <option value="20/60">20/60</option>
                            <option value="20/100">20/100</option>
                            <option value=" ">Other</option>
                          </select>
                          {medformData.visual_acuity.pinhole_va.od === " " && (
                            <input
                              type="text"
                              name="pinhole_od_custom"
                              value={
                                medformData.visual_acuity.pinhole_va
                                  .custom_od || ""
                              }
                              onChange={(e) =>
                                handleChange(
                                  e,
                                  "visual_acuity.pinhole_va.custom_od"
                                )
                              }
                              className="mt-3 w-full p-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                              placeholder="Enter custom value"
                            />
                          )}
                        </div>
                        <div className="flex flex-col w-full">
                          <p className="text-p-sc md:text-p-sm font-medium text-f-gray">
                            OS
                          </p>
                          <select
                            name="pinhole_os"
                            value={medformData.visual_acuity.pinhole_va.os}
                            onChange={(e) => {
                              handleChange(e, "visual_acuity.pinhole_va.os");
                              if (e.target.value !== "") {
                                handleChange(
                                  { target: { value: "" } },
                                  "visual_acuity.pinhole_va.custom_os"
                                );
                              }
                            }}
                            className="mt-3 w-full p-3 border border-f-gray rounded-md text-f-dark  focus:outline-c-primary"
                          >
                            <option value="">Choose option</option>
                            <option value="20/20">20/20</option>
                            <option value="20/40">20/40</option>
                            <option value="20/60">20/60</option>
                            <option value="20/100">20/100</option>
                            <option value=" ">Other</option>
                          </select>
                          {medformData.visual_acuity.pinhole_va.os === " " && (
                            <input
                              type="text"
                              name="pinhole_os_custom"
                              value={
                                medformData.visual_acuity.pinhole_va
                                  .custom_os || ""
                              }
                              onChange={(e) =>
                                handleChange(
                                  e,
                                  "visual_acuity.pinhole_va.custom_os"
                                )
                              }
                              className="mt-3 w-full p-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                              placeholder="Enter custom value"
                            />
                          )}
                        </div>
                      </section>
                    </div>
                  </div>
                </div>
                <div className="w-full">
                  <div className="border border-f-gray bg-bg-mc w-full rounded-md p-5">
                    <label className="text-p-sm md:text-p-rg font-semibold text-c-secondary">
                      | Contact Lens Prescrition
                    </label>
                    <section className="text-p-sc md:text-p-sm font-semibold mt-5 flex gap-3">
                      <label className="w-1/3">
                        <p className="text-c-gray3 font-medium text-p-sc md:text-p-sm">
                          Date Prescribe
                        </p>
                        <input
                          type="date"
                          name="clp_date"
                          max={new Date().toISOString().split("T")[0]}
                          value={
                            medformData.contact_lens_prescription
                              .date_prescribed
                          }
                          onChange={(e) =>
                            handleChange(
                              e,
                              "contact_lens_prescription.date_prescribed"
                            )
                          }
                          className="mt-3 w-fit h-fit px-4 py-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                        />
                      </label>
                      <div className="flex flex-col w-full">
                        <p className="text-p-sc md:text-p-sm font-medium text-f-gray">
                          OD
                        </p>
                        <textarea
                          type="text"
                          name="clp_od"
                          value={medformData.contact_lens_prescription.od}
                          onChange={(e) =>
                            handleChange(e, "contact_lens_prescription.od")
                          }
                          className="mt-3 w-full px-4 py-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary resize-none"
                          rows={1}
                          placeholder=""
                        />
                      </div>
                      <div className="flex flex-col w-full">
                        <p className="text-p-sc md:text-p-sm font-medium text-f-gray">
                          OS
                        </p>
                        <textarea
                          type="text"
                          name="clp_os"
                          value={medformData.contact_lens_prescription.os}
                          onChange={(e) =>
                            handleChange(e, "contact_lens_prescription.os")
                          }
                          className="mt-3 w-full px-4 py-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary resize-none"
                          rows={1}
                          placeholder=""
                        />
                      </div>
                    </section>
                  </div>
                </div>
                <div className="w-full">
                  <header className="flex justify-center py-2 rounded-t-md w-full border border-f-gray text-c-secondary text-p-sm md:text-p-rg font-semibold bg-bg-sb mb-1">
                    <h1>Retinoscopy / AR</h1>
                  </header>
                  <div className="flex gap-1 flex-col md:flex-row">
                    <div className="border border-f-gray bg-bg-mc w-full md:w-1/2 rounded-bl-md p-5">
                      <label className="text-p-sm md:text-p-rg font-semibold text-c-secondary">
                        | Without Drops
                      </label>
                      <section className="mt-5 flex gap-3 w-full">
                        <div className="flex flex-col w-full">
                          <p className="text-p-sc md:text-p-sm font-medium text-f-gray">
                            OD
                          </p>
                          <select
                            name="retinoscopy_wo_od"
                            value={medformData.retinoscopy.without_drop.od}
                            onChange={(e) => {
                              handleChange(e, "retinoscopy.without_drop.od");
                              if (e.target.value !== "") {
                                handleChange(
                                  { target: { value: "" } },
                                  "retinoscopy.without_drop.custom_od"
                                );
                              }
                            }}
                            className="mt-3 w-full p-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                          >
                            <option value="">Choose options</option>
                            <option value="Plano">Plano</option>
                            <option value="-">-</option>
                            <option value="+">+</option>
                            <option value=" ">Other</option>
                          </select>
                          {medformData.retinoscopy.without_drop.od === " " && (
                            <input
                              type="text"
                              name="retinoscopy_wo_od_custom"
                              value={
                                medformData.retinoscopy.without_drop
                                  .custom_od || ""
                              }
                              onChange={(e) =>
                                handleChange(
                                  e,
                                  "retinoscopy.without_drop.custom_od"
                                )
                              }
                              className="mt-3 w-full p-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                              placeholder="Enter custom value"
                            />
                          )}
                        </div>
                        <div className="flex flex-col w-full">
                          <p className="text-p-sc md:text-p-sm font-medium text-f-gray">
                            OS
                          </p>
                          <select
                            name="retinoscopy_wo_os"
                            value={medformData.retinoscopy.without_drop.os}
                            onChange={(e) => {
                              handleChange(e, "retinoscopy.without_drop.os");
                              if (e.target.value !== "") {
                                handleChange(
                                  { target: { value: "" } },
                                  "retinoscopy.without_drop.custom_os"
                                );
                              }
                            }}
                            className="mt-3 w-full p-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                          >
                            <option value="">Choose options</option>
                            <option value="Plano">Plano</option>
                            <option value="-">-</option>
                            <option value="+">+</option>
                            <option value=" ">Other</option>
                          </select>
                          {medformData.retinoscopy.without_drop.os === " " && (
                            <input
                              type="text"
                              name="retinoscopy_wo_os_custom"
                              value={
                                medformData.retinoscopy.without_drop
                                  .custom_os || ""
                              }
                              onChange={(e) =>
                                handleChange(
                                  e,
                                  "retinoscopy.without_drop.custom_os"
                                )
                              }
                              className="mt-3 w-full p-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                              placeholder="Enter custom value"
                            />
                          )}
                        </div>
                      </section>
                    </div>
                    <div className="border border-f-gray bg-bg-mc w-full md:w-1/2 rounded-br-md p-5">
                      <label className="text-p-sm md:text-p-rg font-semibold text-c-secondary">
                        | With Drops
                      </label>
                      <section className="mt-5 flex gap-3 w-full">
                        <div className="flex flex-col w-full">
                          <p className="text-p-sc md:text-p-sm font-medium text-f-gray">
                            OD
                          </p>
                          <select
                            name="retinoscopy_w_od"
                            value={medformData.retinoscopy.with_drop.od}
                            onChange={(e) => {
                              handleChange(e, "retinoscopy.with_drop.od");
                              if (e.target.value !== "") {
                                handleChange(
                                  { target: { value: "" } },
                                  "retinoscopy.with_drop.custom_od"
                                );
                              }
                            }}
                            className="mt-3 w-full p-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                          >
                            <option value="">Choose options</option>
                            <option value="Plano">Plano</option>
                            <option value="-">-</option>
                            <option value="+">+</option>
                            <option value=" ">Other</option>
                          </select>
                          {medformData.retinoscopy.with_drop.od === " " && (
                            <input
                              type="text"
                              name="retinoscopy_w_od_custom"
                              value={
                                medformData.retinoscopy.with_drop.custom_od ||
                                ""
                              }
                              onChange={(e) =>
                                handleChange(
                                  e,
                                  "retinoscopy.with_drop.custom_od"
                                )
                              }
                              className="mt-3 w-full p-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                              placeholder="Enter custom value"
                            />
                          )}
                        </div>
                        <div className="flex flex-col w-full">
                          <p className="text-p-sc md:text-p-sm font-medium text-f-gray">
                            OS
                          </p>
                          <select
                            name="retinoscopy_w_os"
                            value={medformData.retinoscopy.with_drop.os}
                            onChange={(e) => {
                              handleChange(e, "retinoscopy.with_drop.os");
                              if (e.target.value !== "") {
                                handleChange(
                                  { target: { value: "" } },
                                  "retinoscopy.with_drop.custom_os"
                                );
                              }
                            }}
                            className="mt-3 w-full p-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                          >
                            <option value="">Choose options</option>
                            <option value="Plano">Plano</option>
                            <option value="-">-</option>
                            <option value="+">+</option>
                            <option value=" ">Other</option>
                          </select>
                          {medformData.retinoscopy.with_drop.os === " " && (
                            <input
                              type="text"
                              name="retinoscopy_w_os_custom"
                              value={
                                medformData.retinoscopy.with_drop.custom_os ||
                                ""
                              }
                              onChange={(e) =>
                                handleChange(
                                  e,
                                  "retinoscopy.with_drop.custom_os"
                                )
                              }
                              className="mt-3 w-full p-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                              placeholder="Enter custom value"
                            />
                          )}
                        </div>
                      </section>
                    </div>
                  </div>
                </div>
                <div className="flex gap-5 flex-col md:flex-row">
                  <div className="border border-f-gray bg-bg-mc w-full md:w-1/2 rounded-md p-5">
                    <label className="text-p-sm md:text-p-rg font-semibold text-c-secondary">
                      | Dominant Eye & Hand
                    </label>
                    <section className="mt-5 flex flex-col md:flex-row gap-3 w-full">
                      <div className="w-full">
                        <p className="font-medium text-f-gray text-p-sc md:text-p-sm">
                          Dominant Eye
                        </p>
                        <section className="flex gap-8 mt-3">
                          <div className="flex items-center">
                            <input
                              type="radio"
                              name="dominant_e_right"
                              value="right"
                              checked={
                                medformData.dominant_EH.dominant_eye.right
                              }
                              onChange={() =>
                                setMedformData((prevData) => ({
                                  ...prevData,
                                  dominant_EH: {
                                    ...prevData.dominant_EH,
                                    dominant_eye: {
                                      right: true,
                                      left: false,
                                    },
                                  },
                                }))
                              }
                              className="mr-3 w-6 h-6"
                            />
                            <span className="text-f-gray font-semibold text-p-sc md:text-p-sm">
                              Right
                            </span>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="radio"
                              name="dominant_e_left"
                              value="left"
                              checked={
                                medformData.dominant_EH.dominant_eye.left
                              }
                              onChange={() =>
                                setMedformData((prevData) => ({
                                  ...prevData,
                                  dominant_EH: {
                                    ...prevData.dominant_EH,
                                    dominant_eye: {
                                      right: false,
                                      left: true,
                                    },
                                  },
                                }))
                              }
                              className="mr-3 w-6 h-6"
                            />
                            <span className="text-f-gray font-semibold text-p-sc md:text-p-sm">
                              Left
                            </span>
                          </div>
                        </section>
                      </div>
                      <div className="w-full">
                        <p className="font-medium text-f-gray text-p-sc md:text-p-sm">
                          Dominant Hand
                        </p>
                        <section className="flex gap-8 mt-3">
                          <div className="flex items-center">
                            <input
                              type="radio"
                              name="dominant_h_right"
                              value="right"
                              checked={
                                medformData.dominant_EH.dominant_hand.right
                              }
                              onChange={() =>
                                setMedformData((prevData) => ({
                                  ...prevData,
                                  dominant_EH: {
                                    ...prevData.dominant_EH,
                                    dominant_hand: {
                                      right: true,
                                      left: false,
                                    },
                                  },
                                }))
                              }
                              className="mr-3 w-6 h-6"
                            />
                            <span className="text-f-gray font-semibold text-p-sc md:text-p-sm">
                              Right
                            </span>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="radio"
                              name="dominant_h_left"
                              value="left"
                              checked={
                                medformData.dominant_EH.dominant_hand.left
                              }
                              onChange={() =>
                                setMedformData((prevData) => ({
                                  ...prevData,
                                  dominant_EH: {
                                    ...prevData.dominant_EH,
                                    dominant_hand: {
                                      right: false,
                                      left: true,
                                    },
                                  },
                                }))
                              }
                              className="mr-3 w-6 h-6"
                            />
                            <span className="text-f-gray font-semibold text-p-sc md:text-p-sm">
                              Left
                            </span>
                          </div>
                        </section>
                      </div>
                    </section>
                    <textarea
                      type="text"
                      name="dominant_he_additional_note"
                      value={medformData.dominant_EH.additional_note}
                      onChange={(e) =>
                        handleChange(e, "dominant_EH.additional_note")
                      }
                      className="mt-4 h-36 w-full px-4 py-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                      placeholder="Additional notes..."
                    />
                  </div>
                  <div className="border border-f-gray bg-bg-mc w-full md:w-1/2 rounded-md p-5">
                    <label className="text-p-sm md:text-p-rg font-semibold text-c-secondary">
                      | Pupillary Distance
                    </label>
                    <section className=" mt-5 flex gap-3 w-full">
                      <div className="flex flex-col w-full">
                        <p className="text-p-sc md:text-p-sm font-medium text-f-gray">
                          OD
                        </p>
                        <input
                          type="text"
                          name="pd_od"
                          value={medformData.pupillary_distance.od}
                          onChange={(e) =>
                            handleChange(e, "pupillary_distance.od")
                          }
                          className="mt-2 w-full  px-3 py-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                        />
                      </div>
                      <div className="flex flex-col w-full">
                        <p className="text-p-sc md:text-p-sm font-medium text-f-gray">
                          OS
                        </p>
                        <input
                          type="text"
                          name="pd_os"
                          value={medformData.pupillary_distance.os}
                          onChange={(e) =>
                            handleChange(e, "pupillary_distance.os")
                          }
                          className="mt-2 w-full  px-3 py-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                        />
                      </div>
                      <div className="flex flex-col w-full">
                        <p className="text-p-sc md:text-p-sm font-medium text-f-gray">
                          OU
                        </p>
                        <input
                          type="text"
                          name="pd_ou"
                          value={medformData.pupillary_distance.ou}
                          onChange={(e) =>
                            handleChange(e, "pupillary_distance.ou")
                          }
                          className="mt-2 w-full  px-3 py-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                        />
                      </div>
                    </section>
                    <textarea
                      type="text"
                      name="pd_additional_note"
                      value={medformData.pupillary_distance.additional_note}
                      onChange={(e) =>
                        handleChange(e, "pupillary_distance.additional_note")
                      }
                      className="mt-3 h-32 w-full px-4 py-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                      placeholder="Additional notes..."
                    />
                  </div>
                </div>
                <div className="border border-f-gray p-5 bg-bg-mc rounded-md w-full">
                  <label className="text-p-sm md:text-p-rg font-semibold text-c-secondary">
                    | Cover Test
                  </label>
                  <div className="w-full flex flex-col md:flex-row gap-5">
                    <section className="mt-5 flex gap-3 w-full flex-col">
                      <div className="w-full">
                        <p className="text-p-sc md:text-p-sm font-medium text-f-gray">
                          OD
                        </p>
                        <div className="border border-f-gray bg-white p-5 rounded-md mt-3 flex flex-col gap-5">
                          <div className="flex">
                            <p className="text-f-dark font-medium w-1/4">
                              With Rx
                            </p>
                            <section className="flex justify-between w-full flex-wrap">
                              <label className="flex items-center gap-2 flex-1">
                                <input
                                  type="checkbox"
                                  name="with_rx_near"
                                  value="near"
                                  checked={
                                    medformData.cover_test.od.with_rx.near
                                  }
                                  onChange={(e) =>
                                    handleChange(
                                      e,
                                      "cover_test.od.with_rx.near"
                                    )
                                  }
                                  className="w-6 h-6"
                                />
                                <span className="text-f-gray font-medium text-p-sc md:text-p-sm">
                                  Near
                                </span>
                              </label>
                              <label className="flex items-center gap-2 flex-1">
                                <input
                                  type="checkbox"
                                  name="with_rx_distance"
                                  value="distance"
                                  checked={
                                    medformData.cover_test.od.with_rx.distance
                                  }
                                  onChange={(e) =>
                                    handleChange(
                                      e,
                                      "cover_test.od.with_rx.distance"
                                    )
                                  }
                                  className="w-6 h-6"
                                />
                                <span className="text-f-gray font-medium text-p-sc md:text-p-sm">
                                  Distance
                                </span>
                              </label>
                              <label className="flex items-center gap-2 flex-1">
                                <input
                                  type="checkbox"
                                  name="with_rx_tropia"
                                  value="tropia"
                                  checked={
                                    medformData.cover_test.od.with_rx.tropia
                                  }
                                  onChange={(e) =>
                                    handleChange(
                                      e,
                                      "cover_test.od.with_rx.tropia"
                                    )
                                  }
                                  className="w-6 h-6"
                                />
                                <span className="text-f-gray font-medium text-p-sc md:text-p-sm">
                                  Tropia
                                </span>
                              </label>
                              <label className="flex items-center gap-2 flex-1">
                                <input
                                  type="checkbox"
                                  name="with_rx_phoria"
                                  value="phoria"
                                  checked={
                                    medformData.cover_test.od.with_rx.phoria
                                  }
                                  onChange={(e) =>
                                    handleChange(
                                      e,
                                      "cover_test.od.with_rx.phoria"
                                    )
                                  }
                                  className="w-6 h-6"
                                />
                                <span className="text-f-gray font-medium text-p-sc md:text-p-sm">
                                  Phoria
                                </span>
                              </label>
                            </section>
                          </div>
                          <div className="flex">
                            <p className="text-f-dark font-medium w-1/4">
                              Without Rx
                            </p>
                            <section className="flex justify-between w-full flex-wrap">
                              <label className="flex items-center gap-2 flex-1">
                                <input
                                  type="checkbox"
                                  name="without_rx_near"
                                  value="near"
                                  checked={
                                    medformData.cover_test.od.without_rx.near
                                  }
                                  onChange={(e) =>
                                    handleChange(
                                      e,
                                      "cover_test.od.without_rx.near"
                                    )
                                  }
                                  className="w-6 h-6"
                                />
                                <span className="text-f-gray font-medium text-p-sc md:text-p-sm">
                                  Near
                                </span>
                              </label>
                              <label className="flex items-center gap-2 flex-1">
                                <input
                                  type="checkbox"
                                  name="without_rx_distance"
                                  value="distance"
                                  checked={
                                    medformData.cover_test.od.without_rx
                                      .distance
                                  }
                                  onChange={(e) =>
                                    handleChange(
                                      e,
                                      "cover_test.od.without_rx.distance"
                                    )
                                  }
                                  className="w-6 h-6"
                                />
                                <span className="text-f-gray font-medium text-p-sc md:text-p-sm">
                                  Distance
                                </span>
                              </label>
                              <label className="flex items-center gap-2 flex-1">
                                <input
                                  type="checkbox"
                                  name="without_rx_tropia"
                                  value="tropia"
                                  checked={
                                    medformData.cover_test.od.without_rx.tropia
                                  }
                                  onChange={(e) =>
                                    handleChange(
                                      e,
                                      "cover_test.od.without_rx.tropia"
                                    )
                                  }
                                  className="w-6 h-6"
                                />
                                <span className="text-f-gray font-medium text-p-sc md:text-p-sm">
                                  Tropia
                                </span>
                              </label>
                              <label className="flex items-center gap-2 flex-1">
                                <input
                                  type="checkbox"
                                  name="without_rx_phoria"
                                  value="phoria"
                                  checked={
                                    medformData.cover_test.od.without_rx.phoria
                                  }
                                  onChange={(e) =>
                                    handleChange(
                                      e,
                                      "cover_test.od.without_rx.phoria"
                                    )
                                  }
                                  className="w-6 h-6"
                                />
                                <span className="text-f-gray font-medium text-p-sc md:text-p-sm">
                                  Phoria
                                </span>
                              </label>
                            </section>
                          </div>
                        </div>
                      </div>
                      <textarea
                        type="text"
                        name="cover_test_additional_note_od"
                        value={medformData.cover_test.additional_note_od}
                        onChange={(e) =>
                          handleChange(e, "cover_test.additional_note_od")
                        }
                        className="mt-3 h-24 w-full px-4 py-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                        placeholder="OD additional note..."
                      />
                    </section>
                    <section className="mt-5 flex gap-3 w-full flex-col">
                      <div className="w-full">
                        <p className="text-p-sc md:text-p-sm font-medium text-f-gray">
                          OS
                        </p>
                        <div className="border border-f-gray bg-white p-5 rounded-md mt-3 flex flex-col gap-5">
                          <div className="flex">
                            <p className="text-f-dark font-medium w-1/4">
                              With Rx
                            </p>
                            <section className="flex justify-between w-full flex-wrap">
                              <label className="flex items-center gap-2 flex-1">
                                <input
                                  type="checkbox"
                                  name="with_rx_near"
                                  value="near"
                                  checked={
                                    medformData.cover_test.os.with_rx.near
                                  }
                                  onChange={(e) =>
                                    handleChange(
                                      e,
                                      "cover_test.os.with_rx.near"
                                    )
                                  }
                                  className="w-6 h-6"
                                />
                                <span className="text-f-gray font-medium text-p-sc md:text-p-sm">
                                  Near
                                </span>
                              </label>
                              <label className="flex items-center gap-2 flex-1">
                                <input
                                  type="checkbox"
                                  name="with_rx_distance"
                                  value="distance"
                                  checked={
                                    medformData.cover_test.os.with_rx.distance
                                  }
                                  onChange={(e) =>
                                    handleChange(
                                      e,
                                      "cover_test.os.with_rx.distance"
                                    )
                                  }
                                  className="w-6 h-6"
                                />
                                <span className="text-f-gray font-medium text-p-sc md:text-p-sm">
                                  Distance
                                </span>
                              </label>
                              <label className="flex items-center gap-2 flex-1">
                                <input
                                  type="checkbox"
                                  name="with_rx_tropia"
                                  value="tropia"
                                  checked={
                                    medformData.cover_test.os.with_rx.tropia
                                  }
                                  onChange={(e) =>
                                    handleChange(
                                      e,
                                      "cover_test.os.with_rx.tropia"
                                    )
                                  }
                                  className="w-6 h-6"
                                />
                                <span className="text-f-gray font-medium text-p-sc md:text-p-sm">
                                  Tropia
                                </span>
                              </label>
                              <label className="flex items-center gap-2 flex-1">
                                <input
                                  type="checkbox"
                                  name="with_rx_phoria"
                                  value="phoria"
                                  checked={
                                    medformData.cover_test.os.with_rx.phoria
                                  }
                                  onChange={(e) =>
                                    handleChange(
                                      e,
                                      "cover_test.os.with_rx.phoria"
                                    )
                                  }
                                  className="w-6 h-6"
                                />
                                <span className="text-f-gray font-medium text-p-sc md:text-p-sm">
                                  Phoria
                                </span>
                              </label>
                            </section>
                          </div>
                          <div className="flex">
                            <p className="text-f-dark font-medium w-1/4">
                              Without Rx
                            </p>
                            <section className="flex justify-between w-full flex-wrap">
                              <label className="flex items-center gap-2 flex-1">
                                <input
                                  type="checkbox"
                                  name="without_rx_near"
                                  value="near"
                                  checked={
                                    medformData.cover_test.os.without_rx.near
                                  }
                                  onChange={(e) =>
                                    handleChange(
                                      e,
                                      "cover_test.os.without_rx.near"
                                    )
                                  }
                                  className="w-6 h-6"
                                />
                                <span className="text-f-gray font-medium text-p-sc md:text-p-sm">
                                  Near
                                </span>
                              </label>
                              <label className="flex items-center gap-2 flex-1">
                                <input
                                  type="checkbox"
                                  name="without_rx_distance"
                                  value="distance"
                                  checked={
                                    medformData.cover_test.os.without_rx
                                      .distance
                                  }
                                  onChange={(e) =>
                                    handleChange(
                                      e,
                                      "cover_test.os.without_rx.distance"
                                    )
                                  }
                                  className="w-6 h-6"
                                />
                                <span className="text-f-gray font-medium text-p-sc md:text-p-sm">
                                  Distance
                                </span>
                              </label>
                              <label className="flex items-center gap-2 flex-1">
                                <input
                                  type="checkbox"
                                  name="without_rx_tropia"
                                  value="tropia"
                                  checked={
                                    medformData.cover_test.os.without_rx.tropia
                                  }
                                  onChange={(e) =>
                                    handleChange(
                                      e,
                                      "cover_test.os.without_rx.tropia"
                                    )
                                  }
                                  className="w-6 h-6"
                                />
                                <span className="text-f-gray font-medium text-p-sc md:text-p-sm">
                                  Tropia
                                </span>
                              </label>
                              <label className="flex items-center gap-2 flex-1">
                                <input
                                  type="checkbox"
                                  name="without_rx_phoria"
                                  value="phoria"
                                  checked={
                                    medformData.cover_test.os.without_rx.phoria
                                  }
                                  onChange={(e) =>
                                    handleChange(
                                      e,
                                      "cover_test.os.without_rx.phoria"
                                    )
                                  }
                                  className="w-6 h-6"
                                />
                                <span className="text-f-gray font-medium text-p-sc md:text-p-sm">
                                  Phoria
                                </span>
                              </label>
                            </section>
                          </div>
                        </div>
                      </div>
                      <textarea
                        type="text"
                        name="cover_test_additional_note_os"
                        value={medformData.cover_test.additional_note_os}
                        onChange={(e) =>
                          handleChange(e, "cover_test.additional_note_os")
                        }
                        className="mt-3 h-24 w-full px-4 py-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                        placeholder="OS additional note..."
                      />
                    </section>
                  </div>
                </div>
                <div className="flex gap-5 flex-col md:flex-row">
                  <div className="border border-f-gray bg-bg-mc w-full md:w-1/2 rounded-md p-5">
                    <label className="text-p-sm md:text-p-rg font-semibold text-c-secondary">
                      | Confrontation Test
                    </label>
                    <div className="flex gap-5 mt-5 flex-col-reverse items-center md:flex-row">
                      <div className="flex flex-col w-full">
                        <header className="bg-bg-sb border border-c-gray3 py-1 font-semibold text-p-sc md:text-p-sm text-f-gray rounded-t-md flex justify-center">
                          OD
                        </header>
                        <div className="flex">
                          <div className="w-1/2 border p-5 bg-white rounded-bl-md">
                            <img
                              src={
                                medformData.confrontation_test.od_image ||
                                canvasImages.CROSS ||
                                CROSS
                              }
                              alt="CROSS IMG"
                              className="w-full aspect-square"
                              onClick={() => handleImageClick("CROSS")}
                            />
                          </div>
                          <textarea
                            type="text"
                            name="confrontation_test_od"
                            value={medformData.confrontation_test.od}
                            onChange={(e) =>
                              handleChange(e, "confrontation_test.od")
                            }
                            className="w-1/2 px-4 py-3 border  text-f-dark focus:outline-c-primary resize-none rounded-br-md"
                            rows={1}
                            placeholder="Additional note..."
                          />
                        </div>
                      </div>
                      <div className="flex flex-col w-full">
                        <header className="bg-bg-sb border border-c-gray3 py-1 font-semibold text-p-sc md:text-p-sm text-f-gray rounded-t-md flex justify-center">
                          OS
                        </header>
                        <div className="flex">
                          <div className="w-1/2 border border-c-gray p-5 bg-white rounded-bl-md">
                            <img
                              src={
                                medformData.confrontation_test.os_image ||
                                canvasImages.CROSS ||
                                CROSS
                              }
                              alt="CROSS IMG"
                              className="w-full aspect-square"
                              onClick={() => handleImageClick("CROSS")}
                            />
                          </div>
                          <textarea
                            type="text"
                            name="confrontation_test_os"
                            value={medformData.confrontation_test.os}
                            onChange={(e) =>
                              handleChange(e, "confrontation_test.os")
                            }
                            className="w-1/2 px-4 py-3 border text-f-dark focus:outline-c-primary resize-none rounded-br-md"
                            rows={1}
                            placeholder="Additional note..."
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="border border-f-gray bg-bg-mc w-full md:w-1/2 rounded-md p-5">
                    <label className="text-p-sm md:text-p-rg font-semibold text-c-secondary">
                      | Stereopsis
                    </label>
                    <section className="mt-5 flex flex-col gap-3">
                      <div className="flex gap-3 flex-col md:flex-row">
                        <div className="py-4 flex items-end">
                          <p className="text-p-sc md:text-p-sm font-medium text-f-gray text-nowrap">
                            Stereopsis Score
                          </p>
                        </div>
                        <div className="flex flex-col w-full">
                          <p className="text-p-sc md:text-p-sm font-medium text-f-gray">
                            OD
                          </p>
                          <input
                            type="text"
                            name="stereopsis_score_od"
                            value={medformData.stereopsis.stereopsis_score.od}
                            onChange={(e) =>
                              handleChange(e, "stereopsis.stereopsis_score.od")
                            }
                            className="mt-2 w-full p-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                          />
                        </div>
                        <div className="flex flex-col w-full">
                          <p className="text-p-sc md:text-p-sm font-medium text-f-gray">
                            OS
                          </p>
                          <input
                            type="text"
                            name="stereopsis_score_os"
                            value={medformData.stereopsis.stereopsis_score.os}
                            onChange={(e) =>
                              handleChange(e, "stereopsis.stereopsis_score.os")
                            }
                            className="mt-2 w-full p-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                          />
                        </div>
                      </div>
                      <div className="flex gap-3 flex-col md:flex-row">
                        <div className="w-fit md:w-2/3">
                          <p className="text-p-sc md:text-p-sm font-medium text-f-gray">
                            Perceived Depth <br />
                            Objects
                          </p>
                        </div>
                        <section className="flex gap-3 w-full">
                          <div className="flex items-center">
                            <input
                              type="radio"
                              name="pdo_od_yes"
                              value="yes"
                              checked={
                                medformData.stereopsis.perceived_DO.od.yes
                              }
                              onChange={() =>
                                setMedformData((prevData) => ({
                                  ...prevData,
                                  stereopsis: {
                                    ...prevData.stereopsis,
                                    perceived_DO: {
                                      ...prevData.stereopsis.perceived_DO,
                                      od: { yes: true, no: false },
                                    },
                                  },
                                }))
                              }
                              className="mr-3 w-6 h-6"
                            />
                            <span className="text-f-gray font-semibold text-p-sc md:text-p-sm">
                              Yes
                            </span>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="radio"
                              name="pdo_od_no"
                              value="no"
                              checked={
                                medformData.stereopsis.perceived_DO.od.no
                              }
                              onChange={() =>
                                setMedformData((prevData) => ({
                                  ...prevData,
                                  stereopsis: {
                                    ...prevData.stereopsis,
                                    perceived_DO: {
                                      ...prevData.stereopsis.perceived_DO,
                                      od: { yes: false, no: true },
                                    },
                                  },
                                }))
                              }
                              className="mr-3 w-6 h-6"
                            />
                            <span className="text-f-gray font-semibold text-p-sc md:text-p-sm">
                              No
                            </span>
                          </div>
                        </section>
                        <section className="flex gap-3 w-full md:justify-center">
                          <div className="flex items-center">
                            <input
                              type="radio"
                              name="pdo_os_yes"
                              value="yes"
                              checked={
                                medformData.stereopsis.perceived_DO.os.yes
                              }
                              onChange={() =>
                                setMedformData((prevData) => ({
                                  ...prevData,
                                  stereopsis: {
                                    ...prevData.stereopsis,
                                    perceived_DO: {
                                      ...prevData.stereopsis.perceived_DO,
                                      os: { yes: true, no: false },
                                    },
                                  },
                                }))
                              }
                              className="mr-3 w-6 h-6"
                            />
                            <span className="text-f-gray font-semibold text-p-sc md:text-p-sm">
                              Yes
                            </span>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="radio"
                              name="pdo_os_no"
                              value="no"
                              checked={
                                medformData.stereopsis.perceived_DO.os.no
                              }
                              onChange={() =>
                                setMedformData((prevData) => ({
                                  ...prevData,
                                  stereopsis: {
                                    ...prevData.stereopsis,
                                    perceived_DO: {
                                      ...prevData.stereopsis.perceived_DO,
                                      os: { yes: false, no: true },
                                    },
                                  },
                                }))
                              }
                              className="mr-3 w-6 h-6"
                            />
                            <span className="text-f-gray font-semibold text-p-sc md:text-p-sm">
                              No
                            </span>
                          </div>
                        </section>
                      </div>
                    </section>
                    <textarea
                      type="text"
                      name="stereopsis_additional_note"
                      value={medformData.stereopsis.additional_note}
                      onChange={(e) =>
                        handleChange(e, "stereopsis.additional_note")
                      }
                      className="mt-4 w-full px-4 py-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary resize-none"
                      rows={1}
                      placeholder="If none of the other options are applicable"
                    />
                  </div>
                </div>
                <div className="w-full flex flex-col md:flex-row gap-5">
                  <div className="border border-f-gray bg-bg-mc w-full rounded-md p-5">
                    <label className="text-p-sm md:text-p-rg font-semibold text-c-secondary">
                      | Corneal Reflex Test
                    </label>
                    <div className="flex gap-5 md:gap-5 flex-col md:flex-row mt-5">
                      <section className="flex flex-col w-full md:w-1/2">
                        <div>
                          <p className="text-p-sc md:text-p-sm font-medium text-f-gray text-nowrap mb-3">
                            OD
                          </p>
                          <div className="flex flex-row gap-3 md:gap-0 lg:gap-8">
                            <div className="flex items-center">
                              <input
                                type="radio"
                                name="corneal_od_present"
                                value="present"
                                checked={
                                  medformData.corneal_reflex_test.od.present
                                }
                                onChange={() =>
                                  setMedformData((prevData) => ({
                                    ...prevData,
                                    corneal_reflex_test: {
                                      ...prevData.corneal_reflex_test,
                                      od: { present: true, absent: false },
                                    },
                                  }))
                                }
                                className="mr-3 w-6 h-6"
                              />
                              <span className="text-f-gray font-semibold text-p-sc md:text-p-sm">
                                Present
                              </span>
                            </div>
                            <div className="flex items-center">
                              <input
                                type="radio"
                                name="corneal_od_absent"
                                value="absent"
                                checked={
                                  medformData.corneal_reflex_test.od.absent
                                }
                                onChange={() =>
                                  setMedformData((prevData) => ({
                                    ...prevData,
                                    corneal_reflex_test: {
                                      ...prevData.corneal_reflex_test,
                                      od: { present: false, absent: true },
                                    },
                                  }))
                                }
                                className="mr-3 w-6 h-6"
                              />
                              <span className="text-f-gray font-semibold text-p-sc md:text-p-sm">
                                Absent
                              </span>
                            </div>
                          </div>
                        </div>
                        <textarea
                          type="text"
                          name="corneal_additional_note_od"
                          value={
                            medformData.corneal_reflex_test.od
                              .additional_note_od
                          }
                          onChange={(e) =>
                            handleChange(
                              e,
                              "corneal_reflex_test.od.additional_note_od"
                            )
                          }
                          className="mt-4 w-full px-4 py-2 border border-f-gray rounded-md text-f-dark focus:outline-c-primary resize-none"
                          rows={2}
                          placeholder="option are not applicable"
                        />
                      </section>
                      <section className="flex flex-col w-full md:w-1/2">
                        <div>
                          <p className="text-p-sc md:text-p-sm font-medium text-f-gray text-nowrap mb-3">
                            OS
                          </p>
                          <div className="flex flex-row gap-3 md:gap-0 lg:gap-8">
                            <div className="flex items-center">
                              <input
                                type="radio"
                                name="corneal_os_present"
                                value="present"
                                checked={
                                  medformData.corneal_reflex_test.os.present
                                }
                                onChange={() =>
                                  setMedformData((prevData) => ({
                                    ...prevData,
                                    corneal_reflex_test: {
                                      ...prevData.corneal_reflex_test,
                                      os: { present: true, absent: false },
                                    },
                                  }))
                                }
                                className="mr-3 w-6 h-6"
                              />
                              <span className="text-f-gray font-semibold text-p-sc md:text-p-sm">
                                Present
                              </span>
                            </div>
                            <div className="flex items-center">
                              <input
                                type="radio"
                                name="corneal_os_absent"
                                value="absent"
                                checked={
                                  medformData.corneal_reflex_test.os.absent
                                }
                                onChange={() =>
                                  setMedformData((prevData) => ({
                                    ...prevData,
                                    corneal_reflex_test: {
                                      ...prevData.corneal_reflex_test,
                                      os: { present: false, absent: true },
                                    },
                                  }))
                                }
                                className="mr-3 w-6 h-6"
                              />
                              <span className="text-f-gray font-semibold text-p-sc md:text-p-sm">
                                Absent
                              </span>
                            </div>
                          </div>
                        </div>
                        <textarea
                          type="text"
                          name="corneal_additional_note_os"
                          value={
                            medformData.corneal_reflex_test.os
                              .additional_note_os
                          }
                          onChange={(e) =>
                            handleChange(
                              e,
                              "corneal_reflex_test.os.additional_note_os"
                            )
                          }
                          className="mt-4 w-full px-4 py-2 border border-f-gray rounded-md text-f-dark focus:outline-c-primary resize-none"
                          rows={2}
                          placeholder="option are not applicable"
                        />
                      </section>
                    </div>
                  </div>
                  <div className="border border-f-gray bg-bg-mc w-full rounded-md p-5">
                    <label className="text-p-sm md:text-p-rg font-semibold text-c-secondary">
                      | Worth’s Four Dots
                    </label>
                    <section className="flex gap-3 mt-5">
                      <div className="flex flex-col w-full">
                        <p className="text-p-sc md:text-p-sm font-medium text-f-gray">
                          OD
                        </p>
                        <textarea
                          type="text"
                          name="wfd_od"
                          value={medformData.worths_FD.od}
                          onChange={(e) => handleChange(e, "worths_FD.od")}
                          className="mt-4 w-full px-4 py-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary resize-none"
                          rows={3}
                          placeholder=""
                        />
                      </div>
                      <div className="flex flex-col w-full">
                        <p className="text-p-sc md:text-p-sm font-medium text-f-gray">
                          OS
                        </p>
                        <textarea
                          type="text"
                          name="wfd_os"
                          value={medformData.worths_FD.os}
                          onChange={(e) => handleChange(e, "worths_FD.os")}
                          className="mt-4 w-full px-4 py-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary resize-none"
                          rows={3}
                          placeholder=""
                        />
                      </div>
                    </section>
                  </div>
                  <div className="border border-f-gray bg-bg-mc w-full rounded-md p-5">
                    <label className="text-p-sm md:text-p-rg font-semibold text-c-secondary">
                      | Diplopia
                    </label>
                    <section className="mt-5 flex gap-3 flex-col">
                      <div className="flex gap-3">
                        <div className="flex items-center">
                          <input
                            type="radio"
                            name="diplopia_present"
                            value="present"
                            checked={medformData.diplopia_test.present}
                            onChange={() =>
                              setMedformData((prevData) => ({
                                ...prevData,
                                diplopia_test: {
                                  ...prevData.diplopia_test,
                                  present: true,
                                  absent: false,
                                },
                              }))
                            }
                            className="mr-3 w-6 h-6"
                          />
                          <span className="text-f-gray font-semibold text-p-sc md:text-p-sm">
                            Present
                          </span>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="radio"
                            name="diplopia_absent"
                            value="absent"
                            checked={medformData.diplopia_test.absent}
                            onChange={() =>
                              setMedformData((prevData) => ({
                                ...prevData,
                                diplopia_test: {
                                  ...prevData.diplopia_test,
                                  present: false,
                                  absent: true,
                                },
                              }))
                            }
                            className="mr-3 w-6 h-6"
                          />
                          <span className="text-f-gray font-semibold text-p-sc md:text-p-sm">
                            Absent
                          </span>
                        </div>
                      </div>
                      <textarea
                        type="text"
                        name="diplopia_additional_note"
                        value={medformData.diplopia_test.additional_note}
                        onChange={(e) =>
                          handleChange(e, "diplopia_test.additional_note")
                        }
                        className="w-full p-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary resize-none"
                        rows={3}
                        placeholder="If none of the options are applicable"
                      />
                    </section>
                  </div>
                </div>
                <div className="w-full flex flex-col md:flex-row gap-5">
                  <div className="border border-f-gray bg-bg-mc w-full rounded-md p-5">
                    <label className="text-p-sm md:text-p-rg font-semibold text-c-secondary">
                      | Motility Test
                    </label>
                    <section className="flex gap-5 md:gap-5 flex-col md:flex-row mt-5">
                      <section className="flex flex-col w-full md:w-1/2">
                        <p className="text-p-sc md:text-p-sm font-medium text-f-gray text-nowrap mb-3">
                          OD
                        </p>
                        <textarea
                          type="text"
                          name="motility_note_od"
                          value={medformData.motility_test.od_note}
                          onChange={(e) =>
                            handleChange(e, "motility_test.od_note")
                          }
                          className="w-full px-4 py-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary resize-none"
                          rows={3}
                          placeholder=""
                        />
                      </section>
                      <section className="flex flex-col w-full md:w-1/2">
                        <p className="text-p-sc md:text-p-sm font-medium text-f-gray text-nowrap mb-3">
                          OS
                        </p>
                        <textarea
                          type="text"
                          name="motility_note_os"
                          value={medformData.motility_test.os_note}
                          onChange={(e) =>
                            handleChange(e, "motility_test.os_note")
                          }
                          className="w-full px-4 py-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary resize-none"
                          rows={3}
                          placeholder=""
                        />
                      </section>
                    </section>
                  </div>
                  <div className="border border-f-gray bg-bg-mc w-full rounded-md p-5">
                    <label className="text-p-sm md:text-p-rg font-semibold text-c-secondary">
                      | Saccadic Test
                    </label>
                    <section className="flex gap-5 md:gap-5 flex-col md:flex-row mt-5">
                      <section className="flex flex-col w-full md:w-1/2">
                        <div>
                          <p className="text-p-sc md:text-p-sm font-medium text-f-gray text-nowrap mb-3">
                            OD
                          </p>
                          <div className="flex gap-3 md:gap-0 lg:gap-8">
                            <div className="flex items-center">
                              <input
                                type="radio"
                                name="saccadic_od_present"
                                value="present"
                                checked={medformData.saccadic_test.od.present}
                                onChange={() =>
                                  setMedformData((prevData) => ({
                                    ...prevData,
                                    saccadic_test: {
                                      ...prevData.saccadic_test,
                                      od: { present: true, absent: false },
                                    },
                                  }))
                                }
                                className="mr-3 w-6 h-6"
                              />
                              <span className="text-f-gray font-semibold text-p-sc md:text-p-sm">
                                Present
                              </span>
                            </div>
                            <div className="flex items-center">
                              <input
                                type="radio"
                                name="saccadic_od_absent"
                                value="absent"
                                checked={medformData.saccadic_test.od.absent}
                                onChange={() =>
                                  setMedformData((prevData) => ({
                                    ...prevData,
                                    saccadic_test: {
                                      ...prevData.saccadic_test,
                                      od: { present: false, absent: true },
                                    },
                                  }))
                                }
                                className="mr-3 w-6 h-6"
                              />
                              <span className="text-f-gray font-semibold text-p-sc md:text-p-sm">
                                Absent
                              </span>
                            </div>
                          </div>
                        </div>
                        <textarea
                          type="text"
                          name="saccadic_additional_note_od"
                          value={
                            medformData.saccadic_test.od.additional_note_od
                          }
                          onChange={(e) =>
                            handleChange(
                              e,
                              "saccadic_test.od.additional_note_od"
                            )
                          }
                          className="mt-4 w-full px-4 py-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary resize-none"
                          rows={1}
                          placeholder="additional note..."
                        />
                      </section>
                      <section className="flex flex-col w-full md:w-1/2">
                        <div>
                          <p className="text-p-sc md:text-p-sm font-medium text-f-gray text-nowrap mb-3">
                            OS
                          </p>
                          <div className="flex gap-3 md:gap-0 lg:gap-8">
                            <div className="flex items-center">
                              <input
                                type="radio"
                                name="saccadic_os_present"
                                value="present"
                                checked={medformData.saccadic_test.os.present}
                                onChange={() =>
                                  setMedformData((prevData) => ({
                                    ...prevData,
                                    saccadic_test: {
                                      ...prevData.saccadic_test,
                                      os: { present: true, absent: false },
                                    },
                                  }))
                                }
                                className="mr-3 w-6 h-6"
                              />
                              <span className="text-f-gray font-semibold text-p-sc md:text-p-sm">
                                Present
                              </span>
                            </div>
                            <div className="flex items-center">
                              <input
                                type="radio"
                                name="saccadic_os_absent"
                                value="absent"
                                checked={medformData.saccadic_test.os.absent}
                                onChange={() =>
                                  setMedformData((prevData) => ({
                                    ...prevData,
                                    saccadic_test: {
                                      ...prevData.saccadic_test,
                                      os: { present: false, absent: true },
                                    },
                                  }))
                                }
                                className="mr-3 w-6 h-6"
                              />
                              <span className="text-f-gray font-semibold text-p-sc md:text-p-sm">
                                Absent
                              </span>
                            </div>
                          </div>
                        </div>
                        <textarea
                          type="text"
                          name="saccadic_additional_note_os"
                          value={
                            medformData.saccadic_test.os.additional_note_os
                          }
                          onChange={(e) =>
                            handleChange(
                              e,
                              "saccadic_test.os.additional_note_os"
                            )
                          }
                          className="mt-4 w-full px-4 py-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary resize-none"
                          rows={1}
                          placeholder="additional note..."
                        />
                      </section>
                    </section>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row gap-5">
                  <div className="border border-f-gray bg-bg-mc rounded-md w-full md:w-1/2 p-5">
                    <label className="text-p-sm md:text-p-rg font-semibold text-c-secondary">
                      | Amsler Grid
                    </label>
                    <section className="mt-6 flex gap-3 flex-col md:flex-row w-full">
                      <div className="flex flex-col w-full">
                        <p className="text-p-sc md:text-p-sm font-medium text-f-gray">
                          OD
                        </p>
                        <select
                          name="amsler_od"
                          value={medformData.amsler_grid.od}
                          onChange={(e) => {
                            handleChange(e, "amsler_grid.od");
                            if (e.target.value !== "") {
                              handleChange(
                                { target: { value: "" } },
                                "amsler_grid.custom_od"
                              );
                            }
                          }}
                          className="mt-3 w-full p-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                        >
                          <option value="">Choose option</option>
                          <option value="Full Field">Full Field</option>
                          <option value="Central Scotoma">
                            Central Scotoma
                          </option>
                          <option value="Peripheral Scotoma">
                            Peripheral Scotoma
                          </option>
                          <option value="Distorted">Distorted</option>
                          <option value=" ">Other</option>
                        </select>
                        {medformData.amsler_grid.od === " " && (
                          <input
                            type="text"
                            name="amsler_od_custom"
                            value={medformData.amsler_grid.custom_od || ""}
                            onChange={(e) =>
                              handleChange(e, "amsler_grid.custom_od")
                            }
                            className="mt-3 w-full p-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                            placeholder="none of the other options are applicable"
                          />
                        )}
                      </div>
                      <div className="flex flex-col w-full">
                        <p className="text-p-sc md:text-p-sm font-medium text-f-gray">
                          OS
                        </p>
                        <select
                          name="amsler_os"
                          value={medformData.amsler_grid.os}
                          onChange={(e) => {
                            handleChange(e, "amsler_grid.os");
                            if (e.target.value !== "") {
                              handleChange(
                                { target: { value: "" } },
                                "amsler_grid.custom_os"
                              );
                            }
                          }}
                          className="mt-3 w-full p-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                        >
                          <option value="">Choose option</option>
                          <option value="Full Field">Full Field</option>
                          <option value="Central Scotoma">
                            Central Scotoma
                          </option>
                          <option value="Peripheral Scotoma">
                            Peripheral Scotoma
                          </option>
                          <option value="Distorted">Distorted</option>
                          <option value=" ">Other</option>
                        </select>
                        {medformData.amsler_grid.os === " " && (
                          <input
                            type="text"
                            name="amsler_os_custom"
                            value={medformData.amsler_grid.custom_os || ""}
                            onChange={(e) =>
                              handleChange(e, "amsler_grid.custom_os")
                            }
                            className="mt-3 w-full p-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                            placeholder="none of the other options are applicable"
                          />
                        )}
                      </div>
                    </section>
                  </div>
                  <div className="border border-f-gray bg-bg-mc w-full md:w-1/2 rounded-md p-5">
                    <label className="text-p-sm md:text-p-rg font-semibold text-c-secondary">
                      | Intra-Ocular Pressure (IOP)
                    </label>
                    <section className="flex mt-5 gap-3">
                      <div className="flex flex-col w-full">
                        <p className="text-p-sc md:text-p-sm font-medium text-f-gray">
                          OD
                        </p>
                        <input
                          type="text"
                          name="iop_od"
                          value={medformData.IOP.od}
                          onChange={(e) => handleChange(e, "IOP.od")}
                          className="mt-2 w-full p-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                        />
                      </div>
                      <div className="flex flex-col w-full">
                        <p className="text-p-sc md:text-p-sm font-medium text-f-gray">
                          OS
                        </p>
                        <input
                          type="text"
                          name="iop_os"
                          value={medformData.IOP.os}
                          onChange={(e) => handleChange(e, "IOP.os")}
                          className="mt-2 w-full p-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                        />
                      </div>
                    </section>
                  </div>
                </div>
                <div className="w-full flex flex-col md:flex-row gap-5">
                  <div className="border border-f-gray bg-bg-mc rounded-md w-full md:w-1/2 p-5">
                    <label className="text-p-sm md:text-p-rg font-semibold text-c-secondary">
                      | Ishihara Test
                    </label>
                    <section className="flex gap-3 mt-5 flex-col md:flex-row">
                      <div className="flex flex-col w-full">
                        <p className="text-p-sc md:text-p-sm font-medium text-f-gray">
                          OD
                        </p>
                        <textarea
                          type="text"
                          name="ishihara_od"
                          value={medformData.ishihara_test.od}
                          onChange={(e) => handleChange(e, "ishihara_test.od")}
                          className="mt-4 w-full px-4 py-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary resize-none"
                          rows={1}
                          placeholder=""
                        />
                      </div>
                      <div className="flex flex-col w-full">
                        <p className="text-p-sc md:text-p-sm font-medium text-f-gray">
                          OS
                        </p>
                        <textarea
                          type="text"
                          name="ishihara_os"
                          value={medformData.ishihara_test.os}
                          onChange={(e) => handleChange(e, "ishihara_test.os")}
                          className="mt-4 w-full px-4 py-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary resize-none"
                          rows={1}
                          placeholder=""
                        />
                      </div>
                    </section>
                  </div>
                  <div className="border border-f-gray bg-bg-mc rounded-md w-full md:w-1/2 p-5">
                    <label className="text-p-sm md:text-p-rg font-semibold text-c-secondary">
                      | Schirmer Test
                    </label>
                    <section className="flex gap-3 mt-5 flex-col md:flex-row">
                      <div className="flex flex-col w-full">
                        <p className="text-p-sc md:text-p-sm font-medium text-f-gray">
                          OD
                        </p>
                        <textarea
                          type="text"
                          name="schirmer_od"
                          value={medformData.schirmer_test.od}
                          onChange={(e) => handleChange(e, "schirmer_test.od")}
                          className="mt-4 w-full px-4 py-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary resize-none"
                          rows={1}
                          placeholder=""
                        />
                      </div>
                      <div className="flex flex-col w-full">
                        <p className="text-p-sc md:text-p-sm font-medium text-f-gray">
                          OS
                        </p>
                        <textarea
                          type="text"
                          name="schirmer_os"
                          value={medformData.schirmer_test.os}
                          onChange={(e) => handleChange(e, "schirmer_test.os")}
                          className="mt-4 w-full px-4 py-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary resize-none"
                          rows={1}
                          placeholder=""
                        />
                      </div>
                    </section>
                  </div>
                </div>
                <div className="w-full">
                  <header className="flex justify-center py-2 rounded-t-md w-full border border-f-gray text-c-secondary text-p-sm md:text-p-rg font-semibold bg-bg-sb mb-2">
                    <h1>Internal Examination</h1>
                  </header>
                  <div className="p-5 border border-f-gray bg-bg-mc rounded-b-md flex flex-col md:flex-row gap-5">
                    <div className="w-full md:w-1/5">
                      <header className="bg-bg-sb border border-c-gray3 py-1 font-semibold text-p-sc md:text-p-sm text-f-gray rounded-t-md flex justify-center">
                        OD
                      </header>
                      <div className="border border-c-gray3 p-5 bg-white rounded-sm">
                        <img
                          src={
                            medformData.internal_examination.image.od ||
                            canvasImages.OD ||
                            OD
                          }
                          alt="OD IMG"
                          className="w-full aspect-square"
                          onClick={() => handleImageClick("OD")}
                        />
                      </div>
                    </div>
                    <section className="flex flex-col gap-5 w-full md:w-2/3">
                      <div className="flex gap-3 items-center flex-col md:flex-row">
                        <input
                          type="text"
                          name="cdr_od"
                          value={
                            medformData.internal_examination.cup_disc_ratio.od
                          }
                          onChange={(e) =>
                            handleChange(
                              e,
                              "internal_examination.cup_disc_ratio.od"
                            )
                          }
                          className="mt-2 w-full md:w-2/3 p-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                        />
                        <p className="text-p-sc md:text-p-sm font-medium text-c-secondary text-nowrap text-center w-1/3">
                          Cup/Disc Ratio
                        </p>
                        <input
                          type="text"
                          name="cdr_os"
                          value={
                            medformData.internal_examination.cup_disc_ratio.os
                          }
                          onChange={(e) =>
                            handleChange(
                              e,
                              "internal_examination.cup_disc_ratio.os"
                            )
                          }
                          className="mt-2 w-full md:w-2/3  p-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                        />
                      </div>
                      <div className="flex gap-3 items-center flex-col md:flex-row">
                        <input
                          type="text"
                          name="avr_od"
                          value={medformData.internal_examination.av_ratio.od}
                          onChange={(e) =>
                            handleChange(e, "internal_examination.av_ratio.od")
                          }
                          className="mt-2 w-full md:w-2/3 p-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                        />
                        <p className="text-p-sc md:text-p-sm font-medium text-c-secondary text-nowrap text-center w-1/3">
                          A/V Ratio
                        </p>
                        <input
                          type="text"
                          name="avr_os"
                          value={medformData.internal_examination.av_ratio.os}
                          onChange={(e) =>
                            handleChange(e, "internal_examination.av_ratio.os")
                          }
                          className="mt-2 w-full md:w-2/3 p-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                        />
                      </div>
                      <div className="flex gap-3 items-center flex-col md:flex-row">
                        <input
                          type="text"
                          name="macula_od"
                          value={medformData.internal_examination.macula.od}
                          onChange={(e) =>
                            handleChange(e, "internal_examination.macula.od")
                          }
                          className="mt-2 w-full md:w-2/3 p-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                        />
                        <p className="text-p-sc md:text-p-sm font-medium text-c-secondary text-nowrap text-center w-1/3">
                          Macula
                        </p>
                        <input
                          type="text"
                          name="macula_os"
                          value={medformData.internal_examination.macula.os}
                          onChange={(e) =>
                            handleChange(e, "internal_examination.macula.os")
                          }
                          className="mt-2 w-full md:w-2/3 p-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                        />
                      </div>
                      <div className="flex gap-3 items-center flex-col md:flex-row">
                        <input
                          type="text"
                          name="virtreous_od"
                          value={medformData.internal_examination.vitreous.od}
                          onChange={(e) =>
                            handleChange(e, "internal_examination.vitreous.od")
                          }
                          className="mt-2 w-full md:w-2/3 p-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                        />
                        <p className="text-p-sc md:text-p-sm font-medium text-c-secondary text-nowrap text-center w-1/3">
                          Vitreous
                        </p>
                        <input
                          type="text"
                          name="virtreous_os"
                          value={medformData.internal_examination.vitreous.os}
                          onChange={(e) =>
                            handleChange(e, "internal_examination.vitreous.os")
                          }
                          className="mt-2 w-full md:w-2/3 p-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                        />
                      </div>
                      <div className="flex gap-3 items-center flex-col md:flex-row">
                        <input
                          type="text"
                          name="vessel_od"
                          value={medformData.internal_examination.vessel.od}
                          onChange={(e) =>
                            handleChange(e, "internal_examination.vessel.od")
                          }
                          className="mt-2 w-full md:w-2/3 p-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                        />
                        <p className="text-p-sc md:text-p-sm font-medium text-c-secondary text-nowrap text-center w-1/3">
                          Vessel
                        </p>
                        <input
                          type="text"
                          name="vessel_os"
                          value={medformData.internal_examination.vessel.os}
                          onChange={(e) =>
                            handleChange(e, "internal_examination.vessel.os")
                          }
                          className="mt-2 w-full md:w-2/3 p-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                        />
                      </div>
                      <div className="flex gap-3 items-center flex-col md:flex-row">
                        <input
                          type="text"
                          name="venous_pulse_od"
                          value={
                            medformData.internal_examination.venous_pulse.od
                          }
                          onChange={(e) =>
                            handleChange(
                              e,
                              "internal_examination.venous_pulse.od"
                            )
                          }
                          className="mt-2 w-full md:w-2/3 p-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                        />
                        <p className="text-p-sc md:text-p-sm font-medium text-c-secondary text-nowrap text-center w-1/3">
                          Venous Pulse
                        </p>
                        <input
                          type="text"
                          name="venous_pulse_os"
                          value={
                            medformData.internal_examination.venous_pulse.os
                          }
                          onChange={(e) =>
                            handleChange(
                              e,
                              "internal_examination.venous_pulse.os"
                            )
                          }
                          className="mt-2 w-full md:w-2/3 p-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                        />
                      </div>
                      <div className="flex gap-3 items-center flex-col md:flex-row">
                        <input
                          type="text"
                          name="forveal_reflex_od"
                          value={
                            medformData.internal_examination.forveal_reflex.od
                          }
                          onChange={(e) =>
                            handleChange(
                              e,
                              "internal_examination.forveal_reflex.od"
                            )
                          }
                          className="mt-2 w-full md:w-2/3 p-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                        />
                        <p className="text-p-sc md:text-p-sm font-medium text-c-secondary text-nowrap text-center w-1/3">
                          Foveal Reflex
                        </p>
                        <input
                          type="text"
                          name="forveal_reflex_os"
                          value={
                            medformData.internal_examination.forveal_reflex.os
                          }
                          onChange={(e) =>
                            handleChange(
                              e,
                              "internal_examination.forveal_reflex.os"
                            )
                          }
                          className="mt-2 w-full md:w-2/3 p-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                        />
                      </div>
                      <div className="flex gap-3 items-center flex-col md:flex-row">
                        <input
                          type="text"
                          name="periphery_od"
                          value={medformData.internal_examination.periphery.od}
                          onChange={(e) =>
                            handleChange(e, "internal_examination.periphery.od")
                          }
                          className="mt-2 w-full md:w-2/3 p-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                        />
                        <p className="text-p-sc md:text-p-sm font-medium text-c-secondary text-nowrap text-center w-1/3">
                          Periphery
                        </p>
                        <input
                          type="text"
                          name="periphery_os"
                          value={medformData.internal_examination.periphery.os}
                          onChange={(e) =>
                            handleChange(e, "internal_examination.periphery.os")
                          }
                          className="mt-2 w-full md:w-2/3 p-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                        />
                      </div>
                    </section>
                    <div className="w-full md:w-1/5">
                      <header className="bg-bg-sb border border-c-gray3 py-1 font-semibold text-p-sc md:text-p-sm text-f-gray rounded-t-md flex justify-center">
                        OD
                      </header>
                      <div className="border border-c-gray3 p-5 bg-white rounded-sm">
                        <img
                          src={
                            medformData.internal_examination.image.os ||
                            canvasImages.OS ||
                            OS
                          }
                          alt="OS IMG"
                          className="w-full aspect-square"
                          onClick={() => handleImageClick("OS")}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full">
                  <header className="flex justify-center py-2 rounded-t-md w-full border border-f-gray text-c-secondary text-p-sm md:text-p-rg font-semibold bg-bg-sb mb-2">
                    <h1>External Examination</h1>
                  </header>
                  <div className="p-5 w-full border border-f-gray bg-bg-mc rounded-b-md flex flex-col gap-5">
                    <div className="w-full flex flex-col md:flex-row justify-between px-10 gap-3 md:gap-0 md:px-20">
                      <div className="w-full md:w-1/4">
                        <header className="bg-bg-sb border border-c-gray3 py-1 font-semibold text-p-sc md:text-p-sm text-f-gray rounded-t-md flex justify-center">
                          OD
                        </header>
                        <div className="border border-c-gray3 p-5 bg-white rounded-b-md">
                          <img
                            src={
                              medformData.external_examination.image.od ||
                              canvasImages.FRONT_OD ||
                              FRONT_OD
                            }
                            alt="FRONT IMG"
                            className="w-full"
                            onClick={() => handleImageClick("FRONT_OD")}
                          />
                        </div>
                      </div>
                      <div className="w-full md:w-1/4">
                        <header className="bg-bg-sb border border-c-gray3 py-1 font-semibold text-p-sc md:text-p-sm text-f-gray rounded-t-md flex justify-center">
                          OS
                        </header>
                        <div className="border border-c-gray3 p-5 bg-white rounded-b-md">
                          <img
                            src={
                              medformData.external_examination.image.os ||
                              canvasImages.FRONT_OS ||
                              FRONT_OS
                            }
                            alt="FRONT IMG"
                            className="w-full"
                            onClick={() => handleImageClick("FRONT_OS")}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center w-full flex-col gap-3 md:gap-0 md:flex-row">
                      <div className="border border-f-gray rounded-md bg-white p-5 w-full md:w-2/3">
                        <div className="flex justify-between">
                          <div className="flex flex-col gap-3">
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="eyebrow_od_inflamation"
                                value="Inflammation"
                                checked={
                                  medformData.external_examination.eyebrow.od
                                    .options.inflamation
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "external_examination.eyebrow.od.options.inflamation"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-c-gray3 font-medium text-p-sc md:text-p-sm">
                                Inflammation
                              </span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="eyebrow_od_crust_formation"
                                value="Crust formation"
                                checked={
                                  medformData.external_examination.eyebrow.od
                                    .options.crust_formation
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "external_examination.eyebrow.od.options.crust_formation"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-c-gray3 font-medium text-p-sc md:text-p-sm">
                                Crust formation
                              </span>
                            </label>
                          </div>
                          <div className="flex flex-col gap-3">
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="eyebrow_od_dandruff"
                                value="Dandruff"
                                checked={
                                  medformData.external_examination.eyebrow.od
                                    .options.dandruff
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "external_examination.eyebrow.od.options.dandruff"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-c-gray3 font-medium text-p-sc md:text-p-sm">
                                Dandruff
                              </span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="eyebrow_od_foreign_body"
                                value="Foreign Bodies"
                                checked={
                                  medformData.external_examination.eyebrow.od
                                    .options.foreign_body
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "external_examination.eyebrow.od.options.foreign_body"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-c-gray3 font-medium text-p-sc md:text-p-sm">
                                Foreign Bodies
                              </span>
                            </label>
                          </div>
                        </div>
                        <input
                          type="text"
                          name="eyebrow_od_additional_note"
                          value={
                            medformData.external_examination.eyebrow.od
                              .additional_note
                          }
                          onChange={(e) =>
                            handleChange(
                              e,
                              "external_examination.eyebrow.od.additional_note"
                            )
                          }
                          className="mt-3 w-full p-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                        />
                      </div>
                      <p className="text-p-sc md:text-p-sm font-medium text-c-secondary text-nowrap text-center w-1/3">
                        Eyebrows
                      </p>
                      <div className="border border-f-gray rounded-md bg-white p-5 w-full md:w-2/3">
                        <div className="flex justify-between">
                          <div className="flex flex-col gap-3">
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="eyebrow_os_inflamation"
                                value="Inflammation"
                                checked={
                                  medformData.external_examination.eyebrow.os
                                    .options.inflamation
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "external_examination.eyebrow.os.options.inflamation"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-c-gray3 font-medium text-p-sc md:text-p-sm">
                                Inflammation
                              </span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="eyebrow_os_crust_formation"
                                value="Crust formation"
                                checked={
                                  medformData.external_examination.eyebrow.os
                                    .options.crust_formation
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "external_examination.eyebrow.os.options.crust_formation"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-c-gray3 font-medium text-p-sc md:text-p-sm">
                                Crust formation
                              </span>
                            </label>
                          </div>
                          <div className="flex flex-col gap-3">
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="eyebrow_os_dandruff"
                                value="Dandruff"
                                checked={
                                  medformData.external_examination.eyebrow.os
                                    .options.dandruff
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "external_examination.eyebrow.os.options.dandruff"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-c-gray3 font-medium text-p-sc md:text-p-sm">
                                Dandruff
                              </span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="eyebrow_os_foreign_body"
                                value="Foreign Bodies"
                                checked={
                                  medformData.external_examination.eyebrow.os
                                    .options.foreign_body
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "external_examination.eyebrow.os.options.foreign_body"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-c-gray3 font-medium text-p-sc md:text-p-sm">
                                Foreign Bodies
                              </span>
                            </label>
                          </div>
                        </div>
                        <input
                          type="text"
                          name="eyebrow_os_additional_note"
                          value={
                            medformData.external_examination.eyebrow.os
                              .additional_note
                          }
                          onChange={(e) =>
                            handleChange(
                              e,
                              "external_examination.eyebrow.os.additional_note"
                            )
                          }
                          className="mt-3 w-full p-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                        />
                      </div>
                    </div>
                    <div className="flex justify-between items-center w-full flex-col gap-3 md:gap-0 md:flex-row">
                      <div className="border border-f-gray rounded-md bg-white p-5 w-full md:w-2/3">
                        <div className="flex justify-between">
                          <div className="flex flex-col gap-3">
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="eyelashes_od_crusting"
                                value="Crusting"
                                checked={
                                  medformData.external_examination.eyelashes.od
                                    .options.crusting
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "external_examination.eyelashes.od.options.crusting"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-c-gray3 font-medium text-p-sc md:text-p-sm">
                                Crusting
                              </span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="eyelashes_od_discharge"
                                value="Discharge"
                                checked={
                                  medformData.external_examination.eyelashes.od
                                    .options.discharge
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "external_examination.eyelashes.od.options.discharge"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-c-gray3 font-medium text-p-sc md:text-p-sm">
                                Discharge
                              </span>
                            </label>
                          </div>
                          <div className="flex flex-col gap-3">
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="eyelashes_od_eyelash_lice"
                                value="Eyelash Lice"
                                checked={
                                  medformData.external_examination.eyelashes.od
                                    .options.eyelash_lice
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "external_examination.eyelashes.od.options.eyelash_lice"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-c-gray3 font-medium text-p-sc md:text-p-sm">
                                Eyelash Lice
                              </span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="eyelashes_od_foreign_body"
                                value="Foreign Bodies"
                                checked={
                                  medformData.external_examination.eyelashes.od
                                    .options.foreign_body
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "external_examination.eyelashes.od.options.foreign_body"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-c-gray3 font-medium text-p-sc md:text-p-sm">
                                Foreign Bodies
                              </span>
                            </label>
                          </div>
                        </div>
                        <input
                          type="text"
                          name="eyelashes_additional_note"
                          value={
                            medformData.external_examination.eyelashes.od
                              .additional_note
                          }
                          onChange={(e) =>
                            handleChange(
                              e,
                              "external_examination.eyelashes.od.additional_note"
                            )
                          }
                          className="mt-3 w-full p-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                        />
                      </div>
                      <p className="text-p-sc md:text-p-sm font-medium text-c-secondary text-nowrap text-center w-1/3">
                        Eyelashes
                      </p>
                      <div className="border border-f-gray rounded-md bg-white p-5 w-full md:w-2/3">
                        <div className="flex justify-between">
                          <div className="flex flex-col gap-3">
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="eyelashes_os_crusting"
                                value="Crusting"
                                checked={
                                  medformData.external_examination.eyelashes.os
                                    .options.crusting
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "external_examination.eyelashes.os.options.crusting"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-c-gray3 font-medium text-p-sc md:text-p-sm">
                                Crusting
                              </span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="eyelashes_os_discharge"
                                value="Discharge"
                                checked={
                                  medformData.external_examination.eyelashes.os
                                    .options.discharge
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "external_examination.eyelashes.os.options.discharge"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-c-gray3 font-medium text-p-sc md:text-p-sm">
                                Discharge
                              </span>
                            </label>
                          </div>
                          <div className="flex flex-col gap-3">
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="eyelashes_os_eyelash_lice"
                                value="Eyelash Lice"
                                checked={
                                  medformData.external_examination.eyelashes.os
                                    .options.eyelash_lice
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "external_examination.eyelashes.os.options.eyelash_lice"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-c-gray3 font-medium text-p-sc md:text-p-sm">
                                Eyelash Lice
                              </span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="eyelashes_os_foreign_body"
                                value="Foreign Bodies"
                                checked={
                                  medformData.external_examination.eyelashes.os
                                    .options.foreign_body
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "external_examination.eyelashes.os.options.foreign_body"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-c-gray3 font-medium text-p-sc md:text-p-sm">
                                Foreign Bodies
                              </span>
                            </label>
                          </div>
                        </div>
                        <input
                          type="text"
                          name="eyelashes_additional_note"
                          value={
                            medformData.external_examination.eyelashes.os
                              .additional_note
                          }
                          onChange={(e) =>
                            handleChange(
                              e,
                              "external_examination.eyelashes.os.additional_note"
                            )
                          }
                          className="mt-3 w-full p-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                        />
                      </div>
                    </div>
                    <div className="flex justify-between items-center w-full flex-col gap-3 md:gap-0 md:flex-row">
                      <div className="border border-f-gray rounded-md bg-white p-5 w-full md:w-2/3">
                        <div className="flex justify-between">
                          <div className="flex flex-col gap-3">
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="eyelids_od_blepharitis"
                                value="Blepharitis"
                                checked={
                                  medformData.external_examination.eyelids.od
                                    .options.blepharitis
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "external_examination.eyelids.od.options.blepharitis"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-c-gray3 font-medium text-p-sc md:text-p-sm">
                                Blepharitis
                              </span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="eyelids_od_edema"
                                value="Edema"
                                checked={
                                  medformData.external_examination.eyelids.od
                                    .options.edema
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "external_examination.eyelids.od.options.edema"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-c-gray3 font-medium text-p-sc md:text-p-sm">
                                Edema
                              </span>
                            </label>
                          </div>
                          <div className="flex flex-col gap-3">
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="eyelids_od_chalazion"
                                value="Chalazion"
                                checked={
                                  medformData.external_examination.eyelids.od
                                    .options.chalazion
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "external_examination.eyelids.od.options.chalazion"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-c-gray3 font-medium text-p-sc md:text-p-sm">
                                Chalazion
                              </span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="eyelids_od_style"
                                value="Stye(hordeolum)"
                                checked={
                                  medformData.external_examination.eyelids.od
                                    .options.stye
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "external_examination.eyelids.od.options.stye"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-c-gray3 font-medium text-p-sc md:text-p-sm">
                                Stye(hordeolum)
                              </span>
                            </label>
                          </div>
                        </div>
                        <input
                          type="text"
                          name="eyelids_od_additional_note"
                          value={
                            medformData.external_examination.eyelids.od
                              .additional_note
                          }
                          onChange={(e) =>
                            handleChange(
                              e,
                              "external_examination.eyelids.od.additional_note"
                            )
                          }
                          className="mt-3 w-full p-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                        />
                      </div>
                      <p className="text-p-sc md:text-p-sm font-medium text-c-secondary text-nowrap text-center w-1/3">
                        Eye Lids
                      </p>
                      <div className="border border-f-gray rounded-md bg-white p-5 w-full md:w-2/3">
                        <div className="flex justify-between">
                          <div className="flex flex-col gap-3">
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="eyelids_os_blepharitis"
                                value="Blepharitis"
                                checked={
                                  medformData.external_examination.eyelids.os
                                    .options.blepharitis
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "external_examination.eyelids.os.options.blepharitis"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-c-gray3 font-medium text-p-sc md:text-p-sm">
                                Blepharitis
                              </span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="eyelids_os_edema"
                                value="Edema"
                                checked={
                                  medformData.external_examination.eyelids.os
                                    .options.edema
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "external_examination.eyelids.os.options.edema"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-c-gray3 font-medium text-p-sc md:text-p-sm">
                                Edema
                              </span>
                            </label>
                          </div>
                          <div className="flex flex-col gap-3">
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="eyelids_os_chalazion"
                                value="Chalazion"
                                checked={
                                  medformData.external_examination.eyelids.os
                                    .options.chalazion
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "external_examination.eyelids.os.options.chalazion"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-c-gray3 font-medium text-p-sc md:text-p-sm">
                                Chalazion
                              </span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="eyelids_os_style"
                                value="Stye(hordeolum)"
                                checked={
                                  medformData.external_examination.eyelids.os
                                    .options.stye
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "external_examination.eyelids.os.options.stye"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-c-gray3 font-medium text-p-sc md:text-p-sm">
                                Stye(hordeolum)
                              </span>
                            </label>
                          </div>
                        </div>
                        <input
                          type="text"
                          name="eyelids_os_additional_note"
                          value={
                            medformData.external_examination.eyelids.os
                              .additional_note
                          }
                          onChange={(e) =>
                            handleChange(
                              e,
                              "external_examination.eyelids.os.additional_note"
                            )
                          }
                          className="mt-3 w-full p-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                        />
                      </div>
                    </div>
                    <div className="flex justify-between items-center w-full flex-col gap-3 md:gap-0 md:flex-row">
                      <div className="border border-f-gray rounded-md bg-white p-5 w-full md:w-2/3">
                        <div className="flex justify-between">
                          <div className="flex flex-col gap-3">
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="cornea_od_ca"
                                value="Corneal abrasion"
                                checked={
                                  medformData.external_examination.cornea.od
                                    .options.corneal_abrasion
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "external_examination.cornea.od.options.corneal_abrasion"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-c-gray3 font-medium text-p-sc md:text-p-sm">
                                Corneal abrasion
                              </span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="cornea_od_keratis"
                                value="Keratitis"
                                checked={
                                  medformData.external_examination.cornea.od
                                    .options.keratitis
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "external_examination.cornea.od.options.keratitis"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-c-gray3 font-medium text-p-sc md:text-p-sm">
                                Keratitis
                              </span>
                            </label>
                          </div>
                          <div className="flex flex-col gap-3">
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="cornea_od_ptery"
                                value="Pterygium"
                                checked={
                                  medformData.external_examination.cornea.od
                                    .options.pterygium
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "external_examination.cornea.od.options.pterygium"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-c-gray3 font-medium text-p-sc md:text-p-sm">
                                Pterygium
                              </span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="cornea_od_cs"
                                value="Corneal Scar"
                                checked={
                                  medformData.external_examination.cornea.od
                                    .options.corneal_scar
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "external_examination.cornea.od.options.corneal_scar"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-c-gray3 font-medium text-p-sc md:text-p-sm">
                                Corneal Scar
                              </span>
                            </label>
                          </div>
                        </div>
                        <input
                          type="text"
                          name="cornea_od_additional_note"
                          value={
                            medformData.external_examination.cornea.od
                              .additional_note
                          }
                          onChange={(e) =>
                            handleChange(
                              e,
                              "external_examination.cornea.od.additional_note"
                            )
                          }
                          className="mt-3 w-full p-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                        />
                      </div>
                      <p className="text-p-sc md:text-p-sm font-medium text-c-secondary text-nowrap text-center w-1/3">
                        Cornea
                      </p>
                      <div className="border border-f-gray rounded-md bg-white p-5 w-full md:w-2/3">
                        <div className="flex justify-between">
                          <div className="flex flex-col gap-3">
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="cornea_os_ca"
                                value="Corneal abrasion"
                                checked={
                                  medformData.external_examination.cornea.os
                                    .options.corneal_abrasion
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "external_examination.cornea.os.options.corneal_abrasion"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-c-gray3 font-medium text-p-sc md:text-p-sm">
                                Corneal abrasion
                              </span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="cornea_os_keratis"
                                value="Keratitis"
                                checked={
                                  medformData.external_examination.cornea.os
                                    .options.keratitis
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "external_examination.cornea.os.options.keratitis"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-c-gray3 font-medium text-p-sc md:text-p-sm">
                                Keratitis
                              </span>
                            </label>
                          </div>
                          <div className="flex flex-col gap-3">
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="cornea_os_ptery"
                                value="Pterygium"
                                checked={
                                  medformData.external_examination.cornea.os
                                    .options.pterygium
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "external_examination.cornea.os.options.pterygium"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-c-gray3 font-medium text-p-sc md:text-p-sm">
                                Pterygium
                              </span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="cornea_os_cs"
                                value="Corneal Scar"
                                checked={
                                  medformData.external_examination.cornea.os
                                    .options.corneal_scar
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "external_examination.cornea.os.options.corneal_scar"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-c-gray3 font-medium text-p-sc md:text-p-sm">
                                Corneal Scar
                              </span>
                            </label>
                          </div>
                        </div>
                        <input
                          type="text"
                          name="cornea_os_additional_note"
                          value={
                            medformData.external_examination.cornea.os
                              .additional_note
                          }
                          onChange={(e) =>
                            handleChange(
                              e,
                              "external_examination.cornea.os.additional_note"
                            )
                          }
                          className="mt-3 w-full p-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                        />
                      </div>
                    </div>
                    <div className="flex justify-between items-center w-full flex-col gap-3 md:gap-0 md:flex-row">
                      <div className="border border-f-gray rounded-md bg-white p-5 w-full md:w-2/3">
                        <div className="flex justify-between">
                          <div className="flex flex-col gap-3">
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="limbus_od_pinguecula"
                                value="Pinguecula"
                                checked={
                                  medformData.external_examination.limbus.od
                                    .options.pinguecula
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "external_examination.limbus.od.options.pinguecula"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-c-gray3 font-medium text-p-sc md:text-p-sm">
                                Pinguecula
                              </span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="limbus_od_melanosis"
                                value="Melanosis"
                                checked={
                                  medformData.external_examination.limbus.od
                                    .options.melanosis
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "external_examination.limbus.od.options.melanosis"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-c-gray3 font-medium text-p-sc md:text-p-sm">
                                Melanosis
                              </span>
                            </label>
                          </div>
                          <div className="flex flex-col gap-3">
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="limbus_od_scarring"
                                value="Scarring"
                                checked={
                                  medformData.external_examination.limbus.od
                                    .options.scarring
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "external_examination.limbus.od.options.scarring"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-c-gray3 font-medium text-p-sc md:text-p-sm">
                                Scarring
                              </span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="limbus_od_foreign_debri"
                                value="Foreign debris"
                                checked={
                                  medformData.external_examination.limbus.od
                                    .options.foreign_debris
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "external_examination.limbus.od.options.foreign_debris"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-c-gray3 font-medium text-p-sc md:text-p-sm">
                                Foreign debris
                              </span>
                            </label>
                          </div>
                        </div>
                        <input
                          type="text"
                          name="limbus_od_additional_note"
                          value={
                            medformData.external_examination.limbus.od
                              .additional_note
                          }
                          onChange={(e) =>
                            handleChange(
                              e,
                              "external_examination.limbus.od.additional_note"
                            )
                          }
                          className="mt-3 w-full p-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                        />
                      </div>
                      <p className="text-p-sc md:text-p-sm font-medium text-c-secondary text-nowrap text-center w-1/3">
                        Limbus
                      </p>
                      <div className="border border-f-gray rounded-md bg-white p-5 w-full md:w-2/3">
                        <div className="flex justify-between">
                          <div className="flex flex-col gap-3">
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="limbus_os_pinguecula"
                                value="Pinguecula"
                                checked={
                                  medformData.external_examination.limbus.os
                                    .options.pinguecula
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "external_examination.limbus.os.options.pinguecula"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-c-gray3 font-medium text-p-sc md:text-p-sm">
                                Pinguecula
                              </span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="limbus_os_melanosis"
                                value="Melanosis"
                                checked={
                                  medformData.external_examination.limbus.os
                                    .options.melanosis
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "external_examination.limbus.os.options.melanosis"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-c-gray3 font-medium text-p-sc md:text-p-sm">
                                Melanosis
                              </span>
                            </label>
                          </div>
                          <div className="flex flex-col gap-3">
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="limbus_os_scarring"
                                value="Scarring"
                                checked={
                                  medformData.external_examination.limbus.os
                                    .options.scarring
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "external_examination.limbus.os.options.scarring"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-c-gray3 font-medium text-p-sc md:text-p-sm">
                                Scarring
                              </span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="limbus_os_foreign_debri"
                                value="Foreign debris"
                                checked={
                                  medformData.external_examination.limbus.os
                                    .options.foreign_debris
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "external_examination.limbus.os.options.foreign_debris"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-c-gray3 font-medium text-p-sc md:text-p-sm">
                                Foreign debris
                              </span>
                            </label>
                          </div>
                        </div>
                        <input
                          type="text"
                          name="limbus_os_additional_note"
                          value={
                            medformData.external_examination.limbus.os
                              .additional_note
                          }
                          onChange={(e) =>
                            handleChange(
                              e,
                              "external_examination.limbus.os.additional_note"
                            )
                          }
                          className="mt-3 w-full p-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                        />
                      </div>
                    </div>
                    <div className="flex justify-between items-center w-full flex-col gap-3 md:gap-0 md:flex-row">
                      <div className="border border-f-gray rounded-md bg-white p-5 w-full md:w-2/3">
                        <div className="flex justify-between">
                          <div className="flex flex-col gap-3">
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="pupil_od_miosis"
                                value="Miosis or mydriasis"
                                checked={
                                  medformData.external_examination.pupil.od
                                    .options.miosis_or_mydriasis
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "external_examination.pupil.od.options.miosis_or_mydriasis"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-c-gray3 font-medium text-p-sc md:text-p-sm">
                                Miosis or mydriasis
                              </span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="pupil_od_IIS"
                                value="Inflammation-induced synechiae"
                                checked={
                                  medformData.external_examination.pupil.od
                                    .options.IIS
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "external_examination.pupil.od.options.IIS"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-c-gray3 font-medium text-p-sc md:text-p-sm">
                                Inflammation-induced synechiae
                              </span>
                            </label>
                          </div>
                          <div className="flex flex-col gap-3">
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="pupil_od_distorted"
                                value="Distorted pupil"
                                checked={
                                  medformData.external_examination.pupil.od
                                    .options.distorted_pupil
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "external_examination.pupil.od.options.distorted_pupil"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-c-gray3 font-medium text-p-sc md:text-p-sm">
                                Distorted pupil
                              </span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="pupil_od_LRA"
                                value="Light reflex abnormalities"
                                checked={
                                  medformData.external_examination.pupil.od
                                    .options.LRA
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "external_examination.pupil.od.options.LRA"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-c-gray3 font-medium text-p-sc md:text-p-sm">
                                Light reflex abnormalities
                              </span>
                            </label>
                          </div>
                        </div>
                        <input
                          type="text"
                          name="pupil_od_additional_note"
                          value={
                            medformData.external_examination.pupil.od
                              .additional_note
                          }
                          onChange={(e) =>
                            handleChange(
                              e,
                              "external_examination.pupil.od.additional_note"
                            )
                          }
                          className="mt-3 w-full p-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                        />
                      </div>
                      <p className="text-p-sc md:text-p-sm font-medium text-c-secondary text-nowrap text-center w-1/3">
                        Pupil
                      </p>
                      <div className="border border-f-gray rounded-md bg-white p-5 w-full md:w-2/3">
                        <div className="flex justify-between">
                          <div className="flex flex-col gap-3">
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="pupil_os_miosis"
                                value="Miosis or mydriasis"
                                checked={
                                  medformData.external_examination.pupil.os
                                    .options.miosis_or_mydriasis
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "external_examination.pupil.os.options.miosis_or_mydriasis"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-c-gray3 font-medium text-p-sc md:text-p-sm">
                                Miosis or mydriasis
                              </span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="pupil_os_IIS"
                                value="Inflammation-induced synechiae"
                                checked={
                                  medformData.external_examination.pupil.os
                                    .options.IIS
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "external_examination.pupil.os.options.IIS"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-c-gray3 font-medium text-p-sc md:text-p-sm">
                                Inflammation-induced synechiae
                              </span>
                            </label>
                          </div>
                          <div className="flex flex-col gap-3">
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="pupil_os_distorted"
                                value="Distorted pupil"
                                checked={
                                  medformData.external_examination.pupil.os
                                    .options.distorted_pupil
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "external_examination.pupil.os.options.distorted_pupil"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-c-gray3 font-medium text-p-sc md:text-p-sm">
                                Distorted pupil
                              </span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="pupil_os_LRA"
                                value="Light reflex abnormalities"
                                checked={
                                  medformData.external_examination.pupil.os
                                    .options.LRA
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "external_examination.pupil.os.options.LRA"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-c-gray3 font-medium text-p-sc md:text-p-sm">
                                Light reflex abnormalities
                              </span>
                            </label>
                          </div>
                        </div>
                        <input
                          type="text"
                          name="pupil_os_additional_note"
                          value={
                            medformData.external_examination.pupil.os
                              .additional_note
                          }
                          onChange={(e) =>
                            handleChange(
                              e,
                              "external_examination.pupil.os.additional_note"
                            )
                          }
                          className="mt-3 w-full p-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                        />
                      </div>
                    </div>
                    <div className="flex justify-between items-center w-full flex-col gap-3 md:gap-0 md:flex-row">
                      <div className="border border-f-gray rounded-md bg-white p-5 w-full md:w-2/3">
                        <div className="flex justify-between">
                          <div className="flex flex-col gap-3">
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="iris_od_iris_neovascularization"
                                value="Iris neovascularization"
                                checked={
                                  medformData.external_examination.iris.od
                                    .options.iris_neovascularization
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "external_examination.iris.od.options.iris_neovascularization"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-c-gray3 font-medium text-p-sc md:text-p-sm">
                                Iris neovascularization
                              </span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="iris_od_posterior_synechiae"
                                value="Posterior synechiae"
                                checked={
                                  medformData.external_examination.iris.od
                                    .options.posterior_synechiae
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "external_examination.iris.od.options.posterior_synechiae"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-c-gray3 font-medium text-p-sc md:text-p-sm">
                                Posterior synechiae
                              </span>
                            </label>
                          </div>
                          <div className="flex flex-col gap-3">
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="iris_od_hyphema"
                                value="Hyphema"
                                checked={
                                  medformData.external_examination.iris.od
                                    .options.hyphema
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "external_examination.iris.od.options.hyphema"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-c-gray3 font-medium text-p-sc md:text-p-sm">
                                Hyphema
                              </span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="iris_od_inflammatory_deposit"
                                value="Inflammatory deposits"
                                checked={
                                  medformData.external_examination.iris.od
                                    .options.inflammatory_deposit
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "external_examination.iris.od.options.inflammatory_deposit"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-c-gray3 font-medium text-p-sc md:text-p-sm">
                                Inflammatory deposits
                              </span>
                            </label>
                          </div>
                        </div>
                        <input
                          type="text"
                          name="iris_od_additional_note"
                          value={
                            medformData.external_examination.iris.od
                              .additional_note
                          }
                          onChange={(e) =>
                            handleChange(
                              e,
                              "external_examination.iris.od.additional_note"
                            )
                          }
                          className="mt-3 w-full p-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                        />
                      </div>
                      <p className="text-p-sc md:text-p-sm font-medium text-c-secondary text-nowrap text-center w-1/3">
                        Iris
                      </p>
                      <div className="border border-f-gray rounded-md bg-white p-5 w-full md:w-2/3">
                        <div className="flex justify-between">
                          <div className="flex flex-col gap-3">
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="iris_os_iris_neovascularization"
                                value="Iris neovascularization"
                                checked={
                                  medformData.external_examination.iris.os
                                    .options.iris_neovascularization
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "external_examination.iris.os.options.iris_neovascularization"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-c-gray3 font-medium text-p-sc md:text-p-sm">
                                Iris neovascularization
                              </span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="iris_os_posterior_synechiae"
                                value="Posterior synechiae"
                                checked={
                                  medformData.external_examination.iris.os
                                    .options.posterior_synechiae
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "external_examination.iris.os.options.posterior_synechiae"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-c-gray3 font-medium text-p-sc md:text-p-sm">
                                Posterior synechiae
                              </span>
                            </label>
                          </div>
                          <div className="flex flex-col gap-3">
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="iris_os_hyphema"
                                value="Hyphema"
                                checked={
                                  medformData.external_examination.iris.os
                                    .options.hyphema
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "external_examination.iris.os.options.hyphema"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-c-gray3 font-medium text-p-sc md:text-p-sm">
                                Hyphema
                              </span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="iris_os_inflammatory_deposit"
                                value="Inflammatory deposits"
                                checked={
                                  medformData.external_examination.iris.os
                                    .options.inflammatory_deposit
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "external_examination.iris.os.options.inflammatory_deposit"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-c-gray3 font-medium text-p-sc md:text-p-sm">
                                Inflammatory deposits
                              </span>
                            </label>
                          </div>
                        </div>
                        <input
                          type="text"
                          name="iris_os_additional_note"
                          value={
                            medformData.external_examination.iris.os
                              .additional_note
                          }
                          onChange={(e) =>
                            handleChange(
                              e,
                              "external_examination.iris.os.additional_note"
                            )
                          }
                          className="mt-3 w-full p-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {currentPage === 2 && (
              <div className="p-5 flex gap-5 flex-col md:flex-row w-full">
                <div className="w-full md:w-1/2 bg-white rounded-md border p-5">
                  <div className="font-Poppins h-[600px] overflow-auto">
                    {soap && (
                      <>
                        {soap.subjective && soap.subjective.length > 0 && (
                          <div className="mb-4">
                            <h3 className="text-f-dark text-h-h6">
                              Subjective
                            </h3>
                            {soap.subjective.map((sentence, index) => (
                              <p key={index}>{sentence}</p>
                            ))}
                          </div>
                        )}
                        {soap.objective && soap.objective.length > 0 && (
                          <div className="mb-4">
                            <h3 className="text-f-dark text-h-h6">Objective</h3>
                            {soap.objective.map((sentence, index) => (
                              <p key={index}>{sentence}</p>
                            ))}
                          </div>
                        )}
                        <h3 className="text-f-dark text-h-h6">
                          Recommended by EyomnAI
                        </h3>
                        {soap.assessment && soap.assessment.length > 0 && (
                          <div className="mb-4">
                            <h3 className="text-f-dark text-h-h6">
                              Assessment
                            </h3>
                            {soap.assessment.map((sentence, index) => (
                              <p key={index}>
                                {sentence === "## Assessment" ? null : sentence}
                              </p>
                            ))}
                          </div>
                        )}
                        {soap.plan && soap.plan.length > 0 && (
                          <div className="mb-4">
                            <h3 className="text-f-dark text-h-h6">Plan</h3>
                            {soap.plan.map((sentence, index) => (
                              <p key={index}>{sentence}</p>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
                <div className="w-full md:w-1/2 flex flex-col gap-5">
                  <div className="border border-f-gray p-5 bg-bg-mc rounded-md w-full h-1/2">
                    <label className="text-p-sm md:text-p-rg font-semibold text-c-secondary">
                      | Diagnosis
                    </label>
                    <textarea
                      type="text"
                      name="diagnosis"
                      value={medformData.diagnosis}
                      onChange={(e) => handleChange(e, "diagnosis")}
                      className="mt-5 w-full h-5/6 px-4 py-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary resize-none"
                    />
                  </div>
                  <h1 className="w-full text-center text-p-sm text-c-gray3">
                    AI suggestions are not definitive. Rely on your clinical
                    judgment.
                  </h1>
                </div>
              </div>
            )}
            {currentPage === 3 && (
              <div className="p-5 flex flex-col gap-5">
                <div className="border border-f-gray p-5 bg-bg-mc rounded-md w-full">
                  <label className="text-p-sm md:text-p-rg font-semibold text-c-secondary">
                    | New Prescription
                  </label>
                  <div className="w-full flex flex-col lg:flex-row gap-5 mt-5">
                    <div className="w-full lg:w-1/3">
                      <header className="flex justify-center py-2 rounded-t-md w-full border border-f-gray text-c-secondary text-p-sm md:text-p-rg font-semibold bg-bg-sb">
                        <h1>OD</h1>
                      </header>
                      <section className="w-fullflex flex-col gap-1 p-5 border rounded-b-md bg-white border-f-gray">
                        <section className="w-full h-fit">
                          <p className="text-f-gray font-medium text-p-sc md:text-p-sm text-nowrap mb-2">
                            ADD
                          </p>
                          <textarea
                            type="text"
                            name="new_prescription_od_add"
                            value={medformData.new_prescription_od.np_ADD}
                            onChange={(e) =>
                              handleChange(e, "new_prescription_od.np_ADD")
                            }
                            className="w-full px-4 py-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary resize-none"
                            rows={2}
                            placeholder="Input prescription"
                          />
                        </section>
                        <section className="w-full h-fit">
                          <p className="text-f-gray font-medium text-p-sc md:text-p-sm text-nowrap mb-2">
                            NEAR
                          </p>
                          <textarea
                            type="text"
                            name="new_prescription_od_near"
                            value={medformData.new_prescription_od.np_NEAR}
                            onChange={(e) =>
                              handleChange(e, "new_prescription_od.np_NEAR")
                            }
                            className="w-full px-4 py-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary resize-none"
                            rows={2}
                            placeholder="Input prescription"
                          />
                        </section>
                        <section className="w-full h-fit">
                          <p className="text-f-gray font-medium text-p-sc md:text-p-sm text-nowrap mb-2">
                            FAR
                          </p>
                          <textarea
                            type="text"
                            name="new_prescription_od_far"
                            value={medformData.new_prescription_od.np_FAR}
                            onChange={(e) =>
                              handleChange(e, "new_prescription_od.np_FAR")
                            }
                            className="w-full px-4 py-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary resize-none"
                            rows={2}
                            placeholder="Input prescription"
                          />
                        </section>
                      </section>
                    </div>
                    <div className="w-full lg:w-1/3">
                      <header className="flex justify-center py-2 rounded-t-md w-full border border-f-gray text-c-secondary text-p-sm md:text-p-rg font-semibold bg-bg-sb">
                        <h1>OS</h1>
                      </header>
                      <section className="w-fullflex flex-col gap-1 p-5 border rounded-b-md  bg-white border-f-gray">
                        <section className="w-full h-fit">
                          <p className="text-f-gray font-medium text-p-sc md:text-p-sm text-nowrap mb-2">
                            ADD
                          </p>
                          <textarea
                            type="text"
                            name="new_prescription_os_add"
                            value={medformData.new_prescription_os.np_ADD}
                            onChange={(e) =>
                              handleChange(e, "new_prescription_os.np_ADD")
                            }
                            className="w-full px-4 py-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary resize-none"
                            rows={2}
                            placeholder="Input prescription"
                          />
                        </section>
                        <section className="w-full h-fit">
                          <p className="text-f-gray font-medium text-p-sc md:text-p-sm text-nowrap mb-2">
                            NEAR
                          </p>
                          <textarea
                            type="text"
                            name="new_prescription_os_near"
                            value={medformData.new_prescription_os.np_NEAR}
                            onChange={(e) =>
                              handleChange(e, "new_prescription_os.np_NEAR")
                            }
                            className="w-full px-4 py-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary resize-none"
                            rows={2}
                            placeholder="Input prescription"
                          />
                        </section>
                        <section className="w-full h-fit">
                          <p className="text-f-gray font-medium text-p-sc md:text-p-sm text-nowrap mb-2">
                            FAR
                          </p>
                          <textarea
                            type="text"
                            name="new_prescription_os_far"
                            value={medformData.new_prescription_os.np_FAR}
                            onChange={(e) =>
                              handleChange(e, "new_prescription_os.np_FAR")
                            }
                            className="w-full px-4 py-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary resize-none"
                            rows={2}
                            placeholder="Input prescription"
                          />
                        </section>
                      </section>
                    </div>
                    <div className="w-full lg:w-1/3">
                      <header className="flex justify-center py-2 rounded-t-md w-full border border-f-gray text-c-secondary text-p-sm md:text-p-rg font-semibold bg-bg-sb">
                        <h1>OU</h1>
                      </header>
                      <section className="w-fullflex flex-col gap-1 p-5 border rounded-b-md  bg-white border-f-gray">
                        <section className="w-full h-fit">
                          <p className="text-f-gray font-medium text-p-sc md:text-p-sm text-nowrap mb-2">
                            ADD
                          </p>
                          <textarea
                            type="text"
                            name="new_prescription_ou_add"
                            value={medformData.new_prescription_ou.np_ADD}
                            onChange={(e) =>
                              handleChange(e, "new_prescription_ou.np_ADD")
                            }
                            className="w-full px-4 py-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary resize-none"
                            rows={2}
                            placeholder="Input prescription"
                          />
                        </section>
                        <section className="w-full h-fit">
                          <p className="text-f-gray font-medium text-p-sc md:text-p-sm text-nowrap mb-2">
                            NEAR
                          </p>
                          <textarea
                            type="text"
                            name="new_prescription_ou_near"
                            value={medformData.new_prescription_ou.np_NEAR}
                            onChange={(e) =>
                              handleChange(e, "new_prescription_ou.np_NEAR")
                            }
                            className="w-full px-4 py-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary resize-none"
                            rows={2}
                            placeholder="Input prescription"
                          />
                        </section>
                        <section className="w-full h-fit">
                          <p className="text-f-gray font-medium text-p-sc md:text-p-sm text-nowrap mb-2">
                            FAR
                          </p>
                          <textarea
                            type="text"
                            name="new_prescription_ou_far"
                            value={medformData.new_prescription_ou.np_FAR}
                            onChange={(e) =>
                              handleChange(e, "new_prescription_ou.np_FAR")
                            }
                            className="w-full px-4 py-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary resize-none"
                            rows={2}
                            placeholder="Input prescription"
                          />
                        </section>
                      </section>
                    </div>
                  </div>
                </div>
                <div className="flex gap-5 flex-col md:flex-row"></div>
                <div className="flex gap-5 flex-col md:flex-row">
                  <div className="border border-f-gray p-5 bg-bg-mc rounded-md w-full md:w-1/2">
                    <label className="text-p-sm md:text-p-rg font-semibold text-c-secondary">
                      | Management
                    </label>
                    <textarea
                      type="text"
                      name="management"
                      value={medformData.management}
                      onChange={(e) => handleChange(e, "management")}
                      className="mt-5 w-full px-4 py-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary resize-none"
                      rows={4}
                      placeholder="Input data"
                    />
                  </div>
                  <div className="border border-f-gray p-5 bg-bg-mc rounded-md w-full md:w-1/2">
                    <label className="text-p-sm md:text-p-rg font-semibold text-c-secondary">
                      | Follow-up Care
                    </label>
                    <textarea
                      type="text"
                      name="followup_care"
                      value={medformData.followup_care}
                      onChange={(e) => handleChange(e, "followup_care")}
                      className="mt-5 w-full px-4 py-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary resize-none"
                      rows={4}
                      placeholder="Input data"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
          {currentPage === 3 ? (
            <>
              {(noteId === null || noteId === undefined) && (
                <div className="flex justify-end gap-4">
                  <button
                    className="py-3 px-20 rounded-md border shadow-sm font-semibold text-p-sm md:text-p-rg mt-5 hover:bg-sb-org text-f-dark"
                    onClick={handleBackPage}
                  >
                    Go back
                  </button>
                  <button
                    className="py-3 px-20 rounded-md bg-c-primary font-semibold text-p-sm md:text-p-rg text-f-light mt-5 hover:bg-hover-doctor"
                    onClick={handleSubmitNote}
                  >
                    Submit Scribe
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="flex gap-4 justify-end">
              {currentPage !== 0 && (
                <button
                  className="py-3 px-20 rounded-md border shadow-sm font-semibold text-p-sm md:text-p-rg mt-5 hover:bg-sb-org text-f-dark"
                  onClick={handleBackPage}
                >
                  Go back
                </button>
              )}
              <button
                className="py-3 px-20 rounded-md bg-c-secondary font-semibold text-p-sm md:text-p-rg text-f-light mt-5 hover:bg-hover-org"
                onClick={handleNext}
              >
                Continue
              </button>
            </div>
          )}
        </form>
        {isCanvasOpen && (
          <EyeSketch
            onClose={toggle}
            onSave={handleSaveCanvas}
            backgroundImage={selectedBG}
          />
        )}
      </div>
      <SuccessModal
        isOpen={isSuccess}
        onClose={() => {
          setIsSuccess(false);
          navigateAfterSuccess();
        }}
        title="Patient Note Added Successfully"
        description="The patient note has been successfully added to the records. We will notify you once "
      />
      <Modal
        title="Error"
        description="There was an issue adding the patient note. Please try again."
        isOpen={isError}
        icon={<IoMdCloseCircleOutline className="w-24 h-24 text-red-700" />}
        onClose={() => setIsError(false)}
      />
    </>
  );
};

export default MedForm;
