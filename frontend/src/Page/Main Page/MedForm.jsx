import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AiOutlineArrowLeft } from "react-icons/ai";
import EyeSketch from "../../Component/ui/EyeSketch";
import OD from "../../assets/Image/OD.png";
import OS from "../../assets/Image/OS.png";
import CROSS from "../../assets/Image/CROSS.png";
import BLANK from "../../assets/Image/BLANK.png";
import FRONT from "../../assets/Image/FRONT.png";
import { useAddNote } from "../../Hooks/useAddNote";
import Loader from "../../Component/ui/Loader";
import SuccessModal from "../../Component/ui/SuccessModal";
import { useDispatch } from "react-redux";
import { addNewNote } from "../../Slice/NoteSlice";
import Modal from "../../Component/ui/Modal";
import { IoMdCloseCircleOutline } from "react-icons/io";

const MedForm = () => {
  const { patientId } = useParams();
  const [currentPage, setCurrentPage] = useState(0);
  const pageTitles = ["Subjective", "Objective", "Assessment", "Plan"];
  const reduxDispatch = useDispatch();
  const [isCanvasOpen, setIsCanvasOpen] = useState(false);
  const [selectedBG, setSelectedBG] = useState("OD");
  const navigate = useNavigate();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const { addNote, isLoading, error } = useAddNote();
  const [isSuccess, setIsSuccess] = useState();
  const [isError, setIsError] = useState(false);
  const [canvasImages, setCanvasImages] = useState({
    OD: "",
    OS: "",
    CROSS: "",
    BLANK: "",
    FRONT: "",
  });
  const [medformData, setMedformData] = useState({
    //Subjective
    subjective: {
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

      occular_history: {
        option: {
          glaucoma: false,
          cataract: false,
          astigmatism: false,
          macular: false,
        },
        last_exam: "",
        additional_note: "",
      },

      fam_occular_history: {
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
    },

    //Objective
    objective: {
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
          additional_note: "",
        },
        unaided_va: {
          od: "",
          os: "",
          ou: "",
          additional_note: "",
        },
        pinhole_va: {
          od: "",
          os: "",
          additional_note: "",
        },
      },

      retinoscopy: {
        with_drop: {
          od: "",
          os: "",
          additional_note: "",
        },
        without_drop: {
          od: "",
          os: "",
          additional_note: "",
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
        additional_note: "",
      },

      confrontation_test: {
        od: "",
        os: "",
        image: "",
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
        },
        os: {
          present: false,
          absent: false,
        },
        additional_note: "",
      },

      motility_test: {
        od: {
          normal: false,
          abnormal: false,
        },
        os: {
          normal: false,
          abnormal: false,
        },
        additional_note: "",
      },

      saccadic_test: {
        od: {
          present: false,
          absent: false,
        },
        os: {
          present: false,
          absent: false,
        },
        additional_note: "",
      },

      amsler_grid: {
        od: "",
        os: "",
        additional_note: "",
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

      ophthalmoscopy: {
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
        virteous: {
          od: "",
          os: "",
        },
        vessel: {
          od: {
            normal: false,
            abnormal: false,
          },
          os: {
            normal: false,
            abnormal: false,
          },
        },
        venous_pulse: {
          od: {
            normal: false,
            abnormal: false,
          },
          os: {
            normal: false,
            abnormal: false,
          },
        },
        forveal_reflex: {
          od: {
            present: false,
            absent: false,
          },
          os: {
            present: false,
            absent: false,
          },
        },
        periphery: {
          od: {
            normal: false,
            abnormal: false,
          },
          os: {
            normal: false,
            abnormal: false,
          },
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
              pupil_distortion: false,
              LRA: false,
            },
            additional_note: "",
          },
          os: {
            options: {
              miosis_or_mydriasis: false,
              IIS: false,
              pupil_distortion: false,
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

      habitual_prescription: {
        date_prescribed: "",
        od: "",
        os: "",
      },

      contact_lens_prescription: {
        date_prescribed: "",
        od: "",
        os: "",
      },
    },

    //Assessment
    assessment: {
      diagnosis: "",
      refractive_error: "",
    },

    //Plan
    plan: {
      new_prescription_od: "",
      new_prescription_os: "",
      management: "",
      followup_care: "",
    },
  });

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
    setHasUnsavedChanges(false);
    try {
      const response = await addNote(medformData, patientId);
      if (response) {
        console.log(response);
        reduxDispatch(
          addNewNote({
            ...medformData,
            patientId: patientId,
            noteId: response.noteId,
            createdAt: response.createdAt,
          })
        );
        setIsSuccess(true);
      }
    } catch (error) {
      setIsError(true);
      console.log(error);
    }
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (currentPage < pageTitles.length - 1) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };
  const handleBackPage = (e) => {
    e.preventDefault();
    if (currentPage < pageTitles.length - 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const toggle = () => setIsCanvasOpen(!isCanvasOpen);

  const handleSaveCanvas = (image) => {
    setCanvasImages((prevImages) => ({
      ...prevImages,
      [selectedBG]: image,
    }));
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
    sessionStorage.setItem("currentPath", `/scribe/${patientId}`);
  };
  return (
    <>
      {isLoading && <Loader />}
      <div className="w-full p-4 md:p-6 xl:p-8 bg-bg-mc">
        <header className="text-f-dark flex justify-between mb-6">
          <div className="flex gap-2 font-Poppins">
            <div>
              <p
                className="flex gap-2 text-p-rg  hover:cursor-pointer"
                onClick={handleBack}
              >
                <AiOutlineArrowLeft className="h-6 w-6" /> Back
              </p>
              <h1 className="font-Poppins text-p-lg font-semibold">
                Patient Medical Records
              </h1>
            </div>
          </div>
          <nav className="flex gap-1">
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
        <form onSubmit={handleSubmitNote} className="">
          <div className="w-full bg-white border border-f-gray rounded-lg ">
            <header className=" bg-bg-sb border border-b-f-gray flex justify-center items-center h-14 font-semibold text-p-lg text-c-secondary">
              <h1>Medical Form ({pageTitles[currentPage]})</h1>
            </header>
            {currentPage === 0 && (
              <div className="p-5 flex flex-col gap-5">
                <div className="flex gap-5">
                  <div className="border border-f-gray p-5 bg-bg-mc rounded-md w-1/2">
                    <label className="text-p-rg font-semibold text-c-secondary">
                      | Initial Obeservation
                    </label>
                    <section className="text-p-sm font-semibold mt-5 flex">
                      <div className="flex flex-col gap-3 w-1/2">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            name="initial_headache"
                            checked={
                              medformData.subjective.initial_observation.options
                                .headache
                            }
                            onChange={(e) =>
                              handleChange(
                                e,
                                "subjective.initial_observation.options.headache"
                              )
                            }
                            className="w-6 h-6"
                          />
                          <span className="text-c-gray3 font-medium text-p-sm">
                            Headache
                          </span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            name="initial_bov"
                            checked={
                              medformData.subjective.initial_observation.options
                                .bov
                            }
                            onChange={(e) =>
                              handleChange(
                                e,
                                "subjective.initial_observation.options.bov"
                              )
                            }
                            className="w-6 h-6"
                          />
                          <span className="text-c-gray3 font-medium text-p-sm">
                            BOV
                          </span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            name="initial_halo"
                            checked={
                              medformData.subjective.initial_observation.options
                                .halo
                            }
                            onChange={(e) =>
                              handleChange(
                                e,
                                "subjective.initial_observation.options.halo"
                              )
                            }
                            className="w-6 h-6"
                          />
                          <span className="text-c-gray3 font-medium text-p-sm">
                            Halo
                          </span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            name="initial_photophobia"
                            checked={
                              medformData.subjective.initial_observation.options
                                .photophobia
                            }
                            onChange={(e) =>
                              handleChange(
                                e,
                                "subjective.initial_observation.options.photophobia"
                              )
                            }
                            className="w-6 h-6"
                          />
                          <span className="text-c-gray3 font-medium text-p-sm">
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
                              medformData.subjective.initial_observation.options
                                .diplopia
                            }
                            onChange={(e) =>
                              handleChange(
                                e,
                                "subjective.initial_observation.options.diplopia"
                              )
                            }
                            className="w-6 h-6"
                          />
                          <span className="text-c-gray3 font-medium text-p-sm">
                            Diplopia
                          </span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            name="initial_tearing"
                            checked={
                              medformData.subjective.initial_observation.options
                                .tearing
                            }
                            onChange={(e) =>
                              handleChange(
                                e,
                                "subjective.initial_observation.options.tearing"
                              )
                            }
                            className="w-6 h-6"
                          />
                          <span className="text-c-gray3 font-medium text-p-sm">
                            Tearing
                          </span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            name="initial_glare"
                            checked={
                              medformData.subjective.initial_observation.options
                                .glare
                            }
                            onChange={(e) =>
                              handleChange(
                                e,
                                "subjective.initial_observation.options.glare"
                              )
                            }
                            className="w-6 h-6"
                          />
                          <span className="text-c-gray3 font-medium text-p-sm">
                            Glare
                          </span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            name="initial_eyepain"
                            checked={
                              medformData.subjective.initial_observation.options
                                .eyepain
                            }
                            onChange={(e) =>
                              handleChange(
                                e,
                                "subjective.initial_observation.options.eyepain"
                              )
                            }
                            className="w-6 h-6"
                          />
                          <span className="text-c-gray3 font-medium text-p-sm">
                            Eye pain
                          </span>
                        </label>
                      </div>
                    </section>
                    <textarea
                      type="text"
                      name="initial_additional_note"
                      value={
                        medformData.subjective.initial_observation
                          .additional_note
                      }
                      onChange={(e) =>
                        handleChange(
                          e,
                          "subjective.initial_observation.additional_note"
                        )
                      }
                      className="mt-3 h-24 w-full px-4 py-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                      placeholder="If option not available"
                    />
                  </div>
                  <div className="border border-f-gray p-5 bg-bg-mc rounded-md w-1/2">
                    <label className="text-p-rg font-semibold text-c-secondary">
                      | General Health Hx
                    </label>
                    <section className="text-p-sm font-semibold mt-5 flex">
                      <div className="flex flex-col gap-3 w-1/2">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            name="gen_health_hypertension"
                            checked={
                              medformData.subjective.general_health_hx.option
                                .hypertension
                            }
                            onChange={(e) =>
                              handleChange(
                                e,
                                "subjective.general_health_hx.option.hypertension"
                              )
                            }
                            className="w-6 h-6"
                          />
                          <span className="text-c-gray3 font-medium text-p-sm">
                            Hypertension
                          </span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            name="gen_health_cardiovascular_problem"
                            checked={
                              medformData.subjective.general_health_hx.option
                                .cardiovas_prob
                            }
                            onChange={(e) =>
                              handleChange(
                                e,
                                "subjective.general_health_hx.option.cardiovas_prob"
                              )
                            }
                            className="w-6 h-6"
                          />
                          <span className="text-c-gray3 font-medium text-p-sm">
                            Cardiovascular Problem
                          </span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            name="gen_health_diabetes"
                            checked={
                              medformData.subjective.general_health_hx.option
                                .diabetes
                            }
                            onChange={(e) =>
                              handleChange(
                                e,
                                "subjective.general_health_hx.option.diabetes"
                              )
                            }
                            className="w-6 h-6"
                          />
                          <span className="text-c-gray3 font-medium text-p-sm">
                            Diabetes
                          </span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            name="gen_health_asthma"
                            checked={
                              medformData.subjective.general_health_hx.option
                                .asthma
                            }
                            onChange={(e) =>
                              handleChange(
                                e,
                                "subjective.general_health_hx.option.asthma"
                              )
                            }
                            className="w-6 h-6"
                          />
                          <span className="text-c-gray3 font-medium text-p-sm">
                            Asthma
                          </span>
                        </label>
                      </div>
                      <div className="flex flex-col gap-3 w-1/2 items-end">
                        <label>
                          <p className="text-c-gray3 font-medium text-p-sm">
                            Date of last Medical Exam
                          </p>
                          <input
                            type="date"
                            name="gen_health_gen_date"
                            max={new Date().toISOString().split("T")[0]}
                            value={
                              medformData.subjective.general_health_hx.last_exam
                            }
                            onChange={(e) =>
                              handleChange(
                                e,
                                "subjective.general_health_hx.last_exam"
                              )
                            }
                            className="mt-1 w-fit h-fit px-4 py-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                          />
                        </label>
                      </div>
                    </section>
                    <textarea
                      type="text"
                      name="gen_health_additional_note"
                      value={
                        medformData.subjective.general_health_hx.additional_note
                      }
                      onChange={(e) =>
                        handleChange(
                          e,
                          "subjective.general_health_hx.additional_note"
                        )
                      }
                      className="mt-3 h-24 w-full px-4 py-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                      placeholder="If option not available"
                    />
                  </div>
                </div>
                <div className="flex gap-5">
                  <div className="border border-f-gray p-5 bg-bg-mc rounded-md w-1/2">
                    <label className="text-p-rg font-semibold text-c-secondary">
                      | Occular Condition/History
                    </label>
                    <section className="text-p-sm font-semibold mt-5 flex">
                      <div className="flex flex-col gap-3 w-1/2">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            name="occhis_glaucoma"
                            checked={
                              medformData.subjective.occular_history.option
                                .glaucoma
                            }
                            onChange={(e) =>
                              handleChange(
                                e,
                                "subjective.occular_history.option.glaucoma"
                              )
                            }
                            className="w-6 h-6"
                          />
                          <span className="text-c-gray3 font-medium text-p-sm">
                            Glaucoma
                          </span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            name="occhis_cataract"
                            checked={
                              medformData.subjective.occular_history.option
                                .cataract
                            }
                            onChange={(e) =>
                              handleChange(
                                e,
                                "subjective.occular_history.option.cataract"
                              )
                            }
                            className="w-6 h-6"
                          />
                          <span className="text-c-gray3 font-medium text-p-sm">
                            Cataract
                          </span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            name="occhis_stigmatism"
                            checked={
                              medformData.subjective.occular_history.option
                                .astigmatism
                            }
                            onChange={(e) =>
                              handleChange(
                                e,
                                "subjective.occular_history.option.astigmatism"
                              )
                            }
                            className="w-6 h-6"
                          />
                          <span className="text-c-gray3 font-medium text-p-sm">
                            Astigmatism
                          </span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            name="occhis_macular"
                            checked={
                              medformData.subjective.occular_history.option
                                .macular
                            }
                            onChange={(e) =>
                              handleChange(
                                e,
                                "subjective.occular_history.option.macular"
                              )
                            }
                            className="w-6 h-6"
                          />
                          <span className="text-c-gray3 font-medium text-p-sm">
                            Macular
                          </span>
                        </label>
                      </div>
                      <div className="flex flex-col gap-3 w-1/2 items-end">
                        <label>
                          <p className="text-c-gray3 font-medium text-p-sm">
                            Date of last Eye Exam:
                          </p>
                          <input
                            type="date"
                            name="occhis_date"
                            max={new Date().toISOString().split("T")[0]}
                            value={
                              medformData.subjective.occular_history.last_exam
                            }
                            onChange={(e) =>
                              handleChange(
                                e,
                                "subjective.occular_history.last_exam"
                              )
                            }
                            className="mt-1 w-fit h-fit px-4 py-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                          />
                        </label>
                      </div>
                    </section>
                    <textarea
                      type="text"
                      name="occhis_additional_note"
                      value={
                        medformData.subjective.occular_history.additional_note
                      }
                      onChange={(e) =>
                        handleChange(
                          e,
                          "subjective.occular_history.additional_note"
                        )
                      }
                      className="mt-3 h-24 w-full px-4 py-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                      placeholder="If option not available"
                    />
                  </div>
                  <div className="border border-f-gray p-5 bg-bg-mc rounded-md w-1/2">
                    <label className="text-p-rg font-semibold text-c-secondary">
                      | Family Occular Conditon
                    </label>
                    <section className="text-p-sm font-semibold mt-5 flex flex-col gap-3">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          name="fam_occhis_glaucoma"
                          checked={
                            medformData.subjective.fam_occular_history.option
                              .glaucoma
                          }
                          onChange={(e) =>
                            handleChange(
                              e,
                              "subjective.fam_occular_history.option.glaucoma"
                            )
                          }
                          className="w-6 h-6"
                        />
                        <span className="text-c-gray3 font-medium text-p-sm">
                          Glaucoma
                        </span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          name="fam_occhis_cataract"
                          checked={
                            medformData.subjective.fam_occular_history.option
                              .cataract
                          }
                          onChange={(e) =>
                            handleChange(
                              e,
                              "subjective.fam_occular_history.option.cataract"
                            )
                          }
                          className="w-6 h-6"
                        />
                        <span className="text-c-gray3 font-medium text-p-sm">
                          Cataract
                        </span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          name="fam_occhis_astigmatism"
                          checked={
                            medformData.subjective.fam_occular_history.option
                              .astigmatism
                          }
                          onChange={(e) =>
                            handleChange(
                              e,
                              "subjective.fam_occular_history.option.astigmatism"
                            )
                          }
                          className="w-6 h-6"
                        />
                        <span className="text-c-gray3 font-medium text-p-sm">
                          Astigmatism
                        </span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          name="fam_occhis_macular"
                          checked={
                            medformData.subjective.fam_occular_history.option
                              .macular
                          }
                          onChange={(e) =>
                            handleChange(
                              e,
                              "subjective.fam_occular_history.option.macular"
                            )
                          }
                          className="w-6 h-6"
                        />
                        <span className="text-c-gray3 font-medium text-p-sm">
                          Macular
                        </span>
                      </label>
                    </section>
                    <textarea
                      type="text"
                      name="fam_occhis_additional_note"
                      value={
                        medformData.subjective.fam_occular_history
                          .additional_note
                      }
                      onChange={(e) =>
                        handleChange(
                          e,
                          "subjective.fam_occular_history.additional_note"
                        )
                      }
                      className="mt-3 h-24 w-full px-4 py-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                      placeholder="If option not available"
                    />
                  </div>
                </div>
                <div className="flex gap-5">
                  <div className="border border-f-gray p-5 bg-bg-mc rounded-md w-1/2">
                    <label className="text-p-rg font-semibold text-c-secondary">
                      | Current Medication
                    </label>
                    <textarea
                      type="text"
                      name="current_medication"
                      value={medformData.subjective.current_medication}
                      onChange={(e) =>
                        handleChange(e, "subjective.current_medication")
                      }
                      className="mt-5 h-52 w-full px-4 py-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                      placeholder="If option not available"
                    />
                  </div>
                  <div className="border border-f-gray p-5 bg-bg-mc rounded-md w-1/2">
                    <label className="text-p-rg font-semibold text-c-secondary">
                      | Lifestyle
                    </label>
                    <textarea
                      type="text"
                      name="lifestyle"
                      value={medformData.subjective.lifestyle}
                      onChange={(e) => handleChange(e, "subjective.lifestyle")}
                      className="mt-5 h-52 w-full px-4 py-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                      placeholder="If option not available"
                    />
                  </div>
                </div>
              </div>
            )}
            {currentPage === 1 && (
              <div className="p-5 flex flex-col gap-5">
                <div className="border border-f-gray p-5 bg-bg-mc rounded-md flex gap-5 w-full">
                  <div className="w-full">
                    <p className="text-f-gray font-medium text-p-sm">
                      Blood Pressure
                    </p>
                    <input
                      type="text"
                      name="bp"
                      value={medformData.objective.bp}
                      onChange={(e) => handleChange(e, "objective.bp")}
                      className="mt-2 w-full  px-3 py-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                    />
                  </div>
                  <div className="w-full">
                    <p className="text-f-gray font-medium text-p-sm">
                      Blood Glucose
                    </p>
                    <input
                      type="text"
                      name="bg"
                      value={medformData.objective.bg}
                      onChange={(e) => handleChange(e, "objective.bg")}
                      className="mt-2 w-full  px-3 py-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                    />
                  </div>
                  <div className="w-full">
                    <p className="text-f-gray font-medium text-p-sm">
                      Heart Rate
                    </p>
                    <input
                      type="text"
                      name="hr"
                      value={medformData.objective.hr}
                      onChange={(e) => handleChange(e, "objective.hr")}
                      className="mt-2 w-full  px-3 py-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                    />
                  </div>
                  <div className="w-full">
                    <p className="text-f-gray font-medium text-p-sm">
                      O2 Saturation
                    </p>
                    <input
                      type="text"
                      name="o2_saturation"
                      value={medformData.objective.o2_saturation}
                      onChange={(e) =>
                        handleChange(e, "objective.o2_saturation")
                      }
                      className="mt-2 w-full  px-3 py-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                    />
                  </div>
                  <div className="w-full">
                    <p className="text-f-gray font-medium text-p-sm">
                      Temperature
                    </p>
                    <input
                      type="text"
                      name="temperature"
                      value={medformData.objective.temperature}
                      onChange={(e) => handleChange(e, "objective.temperature")}
                      className="mt-2 w-full  px-3 py-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                    />
                  </div>
                </div>
                <div className="w-full">
                  <header className="flex justify-center py-2 rounded-t-md w-full border border-f-gray text-c-secondary text-p-rg font-semibold bg-bg-sb mb-2">
                    <h1>Visual Acuity</h1>
                  </header>
                  <div className="flex gap-2">
                    <div className="border border-f-gray bg-bg-mc w-1/2 rounded-bl-md p-5">
                      <label className="text-p-rg font-semibold text-c-secondary">
                        | Habitual VA
                      </label>
                      <section className=" mt-5 flex gap-3 w-full">
                        <div className="flex flex-col w-full">
                          <p className="text-p-sm font-medium text-f-gray">
                            OD
                          </p>
                          <select
                            name="habitual_od"
                            value={
                              medformData.objective.visual_acuity.habitual_va.od
                            }
                            onChange={(e) =>
                              handleChange(
                                e,
                                "objective.visual_acuity.habitual_va.od"
                              )
                            }
                            className="mt-3 w-full p-3 border border-f-gray rounded-md text-f-dark  focus:outline-c-primary"
                          >
                            <option
                              value=""
                              disabled
                              className="text-f-border-f-gray"
                            >
                              -
                            </option>
                            <option value="20/20">20/20</option>
                          </select>
                        </div>
                        <div className="flex flex-col w-full">
                          <p className="text-p-sm font-medium text-f-gray">
                            OS
                          </p>
                          <select
                            name="habitual_os"
                            value={
                              medformData.objective.visual_acuity.habitual_va.os
                            }
                            onChange={(e) =>
                              handleChange(
                                e,
                                "objective.visual_acuity.habitual_va.os"
                              )
                            }
                            className="mt-3 w-full p-3 border border-f-gray rounded-md text-f-dark  focus:outline-c-primary"
                          >
                            <option
                              value=""
                              disabled
                              className="text-f-border-f-gray"
                            >
                              -
                            </option>
                            <option value="20/20">20/20</option>
                          </select>
                        </div>
                        <div className="flex flex-col w-full">
                          <p className="text-p-sm font-medium text-f-gray">
                            OU
                          </p>
                          <select
                            name="habitual_ou"
                            value={
                              medformData.objective.visual_acuity.habitual_va.ou
                            }
                            onChange={(e) =>
                              handleChange(
                                e,
                                "objective.visual_acuity.habitual_va.ou"
                              )
                            }
                            className="mt-3 w-full p-3 border border-f-gray rounded-md text-f-dark  focus:outline-c-primary"
                          >
                            <option
                              value=""
                              disabled
                              className="text-f-border-f-gray"
                            >
                              -
                            </option>
                            <option value="20/20">20/20</option>
                          </select>
                        </div>
                      </section>
                      <textarea
                        type="text"
                        name="habitual_additional_note"
                        value={
                          medformData.objective.visual_acuity.habitual_va
                            .additional_note
                        }
                        onChange={(e) =>
                          handleChange(
                            e,
                            "objective.visual_acuity.habitual_va.additional_note"
                          )
                        }
                        className="mt-3 h-32 w-full px-4 py-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                        placeholder="If option not available"
                      />
                    </div>
                    <div className="border border-f-gray bg-bg-mc w-1/2 p-5">
                      <label className="text-p-rg font-semibold text-c-secondary">
                        | Unaided VA
                      </label>
                      <section className=" mt-5 flex gap-3 w-full">
                        <div className="flex flex-col w-full">
                          <p className="text-p-sm font-medium text-f-gray">
                            OD
                          </p>
                          <select
                            name="unaided_od"
                            value={
                              medformData.objective.visual_acuity.unaided_va.od
                            }
                            onChange={(e) =>
                              handleChange(
                                e,
                                "objective.visual_acuity.unaided_va.od"
                              )
                            }
                            className="mt-3 w-full p-3 border border-f-gray rounded-md text-f-dark  focus:outline-c-primary"
                          >
                            <option
                              value=""
                              disabled
                              className="text-f-border-f-gray"
                            >
                              -
                            </option>
                            <option value="20/20">20/20</option>
                          </select>
                        </div>
                        <div className="flex flex-col w-full">
                          <p className="text-p-sm font-medium text-f-gray">
                            OS
                          </p>
                          <select
                            name="unaided_os"
                            value={
                              medformData.objective.visual_acuity.unaided_va.os
                            }
                            onChange={(e) =>
                              handleChange(
                                e,
                                "objective.visual_acuity.unaided_va.os"
                              )
                            }
                            className="mt-3 w-full p-3 border border-f-gray rounded-md text-f-dark  focus:outline-c-primary"
                          >
                            <option
                              value=""
                              disabled
                              className="text-f-border-f-gray"
                            >
                              -
                            </option>
                            <option value="20/20">20/20</option>
                          </select>
                        </div>
                        <div className="flex flex-col w-full">
                          <p className="text-p-sm font-medium text-f-gray">
                            OU
                          </p>
                          <select
                            name="unaided_ou"
                            value={
                              medformData.objective.visual_acuity.unaided_va.ou
                            }
                            onChange={(e) =>
                              handleChange(
                                e,
                                "objective.visual_acuity.unaided_va.ou"
                              )
                            }
                            className="mt-3 w-full p-3 border border-f-gray rounded-md text-f-dark  focus:outline-c-primary"
                          >
                            <option
                              value=""
                              disabled
                              className="text-f-border-f-gray"
                            >
                              -
                            </option>
                            <option value="20/20">20/20</option>
                          </select>
                        </div>
                      </section>
                      <textarea
                        type="text"
                        name="unaided_additional_note"
                        value={
                          medformData.objective.visual_acuity.unaided_va
                            .additional_note
                        }
                        onChange={(e) =>
                          handleChange(
                            e,
                            "objective.visual_acuity.unaided_va.additional_note"
                          )
                        }
                        className="mt-3 h-32 w-full px-4 py-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                        placeholder="If option not available"
                      />
                    </div>
                    <div className="border border-f-gray bg-bg-mc w-1/3 rounded-br-md p-5">
                      <label className="text-p-rg font-semibold text-c-secondary">
                        | Pinhole VA
                      </label>
                      <section className=" mt-5 flex gap-3 w-full">
                        <div className="flex flex-col w-full">
                          <p className="text-p-sm font-medium text-f-gray">
                            OD
                          </p>
                          <select
                            name="pinhole_od"
                            value={
                              medformData.objective.visual_acuity.pinhole_va.od
                            }
                            onChange={(e) =>
                              handleChange(
                                e,
                                "objective.visual_acuity.pinhole_va.od"
                              )
                            }
                            className="mt-3 w-full p-3 border border-f-gray rounded-md text-f-dark  focus:outline-c-primary"
                          >
                            <option
                              value=""
                              disabled
                              className="text-f-border-f-gray"
                            >
                              -
                            </option>
                            <option value="20/20">20/20</option>
                          </select>
                        </div>
                        <div className="flex flex-col w-full">
                          <p className="text-p-sm font-medium text-f-gray">
                            OS
                          </p>
                          <select
                            name="pinhole_os"
                            value={
                              medformData.objective.visual_acuity.pinhole_va.os
                            }
                            onChange={(e) =>
                              handleChange(
                                e,
                                "objective.visual_acuity.pinhole_va.os"
                              )
                            }
                            className="mt-3 w-full p-3 border border-f-gray rounded-md text-f-dark  focus:outline-c-primary"
                          >
                            <option
                              value=""
                              disabled
                              className="text-f-border-f-gray"
                            >
                              -
                            </option>
                            <option value="20/20">20/20</option>
                          </select>
                        </div>
                      </section>
                      <textarea
                        type="text"
                        name="pinhole_additional_note"
                        value={
                          medformData.objective.visual_acuity.pinhole_va
                            .additional_note
                        }
                        onChange={(e) =>
                          handleChange(
                            e,
                            "objective.visual_acuity.pinhole_va.additional_note"
                          )
                        }
                        className="mt-3 h-32 w-full px-4 py-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                        placeholder="If option not available"
                      />
                    </div>
                  </div>
                </div>
                <div className="w-full">
                  <header className="flex justify-center py-2 rounded-t-md w-full border border-f-gray text-c-secondary text-p-rg font-semibold bg-bg-sb mb-2">
                    <h1>Retinoscopy / AR</h1>
                  </header>
                  <div className="flex gap-2">
                    <div className="border border-f-gray bg-bg-mc w-1/2 rounded-bl-md p-5">
                      <label className="text-p-rg font-semibold text-c-secondary">
                        | With Drops
                      </label>
                      <section className=" mt-5 flex gap-3 w-full">
                        <div className="flex flex-col w-full">
                          <p className="text-p-sm font-medium text-f-gray">
                            OD
                          </p>
                          <select
                            name="retinoscopy_w_od"
                            value={
                              medformData.objective.retinoscopy.with_drop.od
                            }
                            onChange={(e) =>
                              handleChange(
                                e,
                                "objective.retinoscopy.with_drop.od"
                              )
                            }
                            className="mt-3 w-full p-3 border border-f-gray rounded-md text-f-dark  focus:outline-c-primary"
                          >
                            <option
                              value=""
                              disabled
                              className="text-f-border-f-gray"
                            >
                              -
                            </option>
                            <option value="20/20">20/20</option>
                          </select>
                        </div>
                        <div className="flex flex-col w-full">
                          <p className="text-p-sm font-medium text-f-gray">
                            OS
                          </p>
                          <select
                            name="retinoscopy_w_os"
                            value={
                              medformData.objective.retinoscopy.with_drop.os
                            }
                            onChange={(e) =>
                              handleChange(
                                e,
                                "objective.retinoscopy.with_drop.os"
                              )
                            }
                            className="mt-3 w-full p-3 border border-f-gray rounded-md text-f-dark  focus:outline-c-primary"
                          >
                            <option
                              value=""
                              disabled
                              className="text-f-border-f-gray"
                            >
                              -
                            </option>
                            <option value="20/20">20/20</option>
                          </select>
                        </div>
                      </section>
                      <textarea
                        name="retinoscopy_w_additional_note"
                        value={
                          medformData.objective.retinoscopy.with_drop
                            .additional_note
                        }
                        onChange={
                          (e) =>
                            handleChange(
                              e,
                              "objective.retinoscopy.with_drop.additional_note"
                            ) // Update this line for correct path
                        }
                        className="mt-3 h-32 w-full px-4 py-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                        placeholder="If option not available"
                      />
                    </div>
                    <div className="border border-f-gray bg-bg-mc w-1/2 rounded-br-md p-5">
                      <label className="text-p-rg font-semibold text-c-secondary">
                        | Without Drops
                      </label>
                      <section className=" mt-5 flex gap-3 w-full">
                        <div className="flex flex-col w-full">
                          <p className="text-p-sm font-medium text-f-gray">
                            OD
                          </p>
                          <select
                            name="retinoscopy_wo_od"
                            value={
                              medformData.objective.retinoscopy.without_drop.od
                            }
                            onChange={(e) =>
                              handleChange(
                                e,
                                "objective.retinoscopy.without_drop.od"
                              )
                            }
                            className="mt-3 w-full p-3 border border-f-gray rounded-md text-f-dark  focus:outline-c-primary"
                          >
                            <option
                              value=""
                              disabled
                              className="text-f-border-f-gray"
                            >
                              -
                            </option>
                            <option value="20/20">20/20</option>
                          </select>
                        </div>
                        <div className="flex flex-col w-full">
                          <p className="text-p-sm font-medium text-f-gray">
                            OS
                          </p>
                          <select
                            name="retinoscopy_wo_os"
                            value={
                              medformData.objective.retinoscopy.without_drop.os
                            }
                            onChange={(e) =>
                              handleChange(
                                e,
                                "objective.retinoscopy.without_drop.os"
                              )
                            }
                            className="mt-3 w-full p-3 border border-f-gray rounded-md text-f-dark  focus:outline-c-primary"
                          >
                            <option
                              value=""
                              disabled
                              className="text-f-border-f-gray"
                            >
                              -
                            </option>
                            <option value="20/20">20/20</option>
                          </select>
                        </div>
                      </section>
                      <textarea
                        name="retinoscopy_wo_additional_note"
                        value={
                          medformData.objective.retinoscopy.without_drop
                            .additional_note
                        }
                        onChange={
                          (e) =>
                            handleChange(
                              e,
                              "objective.retinoscopy.without_drop.additional_note"
                            ) // Update this line for correct path
                        }
                        className="mt-3 h-32 w-full px-4 py-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                        placeholder="If option not available"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex gap-5">
                  <div className="border border-f-gray bg-bg-mc w-1/2 rounded-md p-5">
                    <label className="text-p-rg font-semibold text-c-secondary">
                      | Dominant Eye & Hand
                    </label>
                    <section className=" mt-5 flex gap-3 w-full">
                      <div className="w-full">
                        <p className="font-medium text-f-gray text-p-sm">
                          Dominant Eye
                        </p>
                        <section className="flex gap-8 mt-3">
                          <div className="flex items-center">
                            <input
                              type="radio"
                              name="dominant_e_right"
                              value="right"
                              checked={
                                medformData.objective.dominant_EH.dominant_eye
                                  .right
                              }
                              onChange={() =>
                                setMedformData((prevData) => ({
                                  ...prevData,
                                  objective: {
                                    ...prevData.objective,
                                    dominant_EH: {
                                      ...prevData.objective.dominant_EH,
                                      dominant_eye: {
                                        right: true,
                                        left: false,
                                      },
                                    },
                                  },
                                }))
                              }
                              className="mr-3 w-6 h-6"
                            />
                            <span className="text-f-gray font-semibold text-p-sm">
                              Right
                            </span>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="radio"
                              name="dominant_e_left"
                              value="left"
                              checked={
                                medformData.objective.dominant_EH.dominant_eye
                                  .left
                              }
                              onChange={() =>
                                setMedformData((prevData) => ({
                                  ...prevData,
                                  objective: {
                                    ...prevData.objective,
                                    dominant_EH: {
                                      ...prevData.objective.dominant_EH,
                                      dominant_eye: {
                                        right: false,
                                        left: true,
                                      },
                                    },
                                  },
                                }))
                              }
                              className="mr-3 w-6 h-6"
                            />
                            <span className="text-f-gray font-semibold text-p-sm">
                              Left
                            </span>
                          </div>
                        </section>
                      </div>
                      <div className="w-full">
                        <p className="font-medium text-f-gray text-p-sm">
                          Dominant Hand
                        </p>
                        <section className="flex gap-8 mt-3">
                          <div className="flex items-center">
                            <input
                              type="radio"
                              name="dominant_h_right"
                              value="right"
                              checked={
                                medformData.objective.dominant_EH.dominant_hand
                                  .right
                              }
                              onChange={() =>
                                setMedformData((prevData) => ({
                                  ...prevData,
                                  objective: {
                                    ...prevData.objective,
                                    dominant_EH: {
                                      ...prevData.objective.dominant_EH,
                                      dominant_hand: {
                                        right: true,
                                        left: false,
                                      },
                                    },
                                  },
                                }))
                              }
                              className="mr-3 w-6 h-6"
                            />
                            <span className="text-f-gray font-semibold text-p-sm">
                              Right
                            </span>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="radio"
                              name="dominant_h_left"
                              value="left"
                              checked={
                                medformData.objective.dominant_EH.dominant_hand
                                  .left
                              }
                              onChange={() =>
                                setMedformData((prevData) => ({
                                  ...prevData,
                                  objective: {
                                    ...prevData.objective,
                                    dominant_EH: {
                                      ...prevData.objective.dominant_EH,
                                      dominant_hand: {
                                        right: false,
                                        left: true,
                                      },
                                    },
                                  },
                                }))
                              }
                              className="mr-3 w-6 h-6"
                            />
                            <span className="text-f-gray font-semibold text-p-sm">
                              Left
                            </span>
                          </div>
                        </section>
                      </div>
                    </section>
                    <textarea
                      type="text"
                      name="dominant_he_additional_note"
                      value={medformData.objective.dominant_EH.additional_note}
                      onChange={(e) =>
                        handleChange(e, "objective.dominant_EH.additional_note")
                      }
                      className="mt-4 h-36 w-full px-4 py-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                      placeholder="If option not available"
                    />
                  </div>
                  <div className="border border-f-gray bg-bg-mc w-1/2 rounded-md p-5">
                    <label className="text-p-rg font-semibold text-c-secondary">
                      | Pupillary Distance
                    </label>
                    <section className=" mt-5 flex gap-3 w-full">
                      <div className="flex flex-col w-full">
                        <p className="text-p-sm font-medium text-f-gray">OD</p>
                        <input
                          type="text"
                          name="pd_od"
                          value={medformData.objective.pupillary_distance.od}
                          onChange={(e) =>
                            handleChange(e, "objective.pupillary_distance.od")
                          }
                          className="mt-2 w-full  px-3 py-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                        />
                      </div>
                      <div className="flex flex-col w-full">
                        <p className="text-p-sm font-medium text-f-gray">OS</p>
                        <input
                          type="text"
                          name="pd_os"
                          value={medformData.objective.pupillary_distance.os}
                          onChange={(e) =>
                            handleChange(e, "objective.pupillary_distance.os")
                          }
                          className="mt-2 w-full  px-3 py-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                        />
                      </div>
                      <div className="flex flex-col w-full">
                        <p className="text-p-sm font-medium text-f-gray">OU</p>
                        <input
                          type="text"
                          name="pd_ou"
                          value={medformData.objective.pupillary_distance.ou}
                          onChange={(e) =>
                            handleChange(e, "objective.pupillary_distance.ou")
                          }
                          className="mt-2 w-full  px-3 py-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                        />
                      </div>
                    </section>
                    <textarea
                      type="text"
                      name="pd_additional_note"
                      value={
                        medformData.objective.pupillary_distance.additional_note
                      }
                      onChange={(e) =>
                        handleChange(
                          e,
                          "objective.pupillary_distance.additional_note"
                        )
                      }
                      className="mt-3 h-32 w-full px-4 py-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                      placeholder="If option not available"
                    />
                  </div>
                </div>
                <div className="border border-f-gray p-5 bg-bg-mc rounded-md w-full">
                  <label className="text-p-rg font-semibold text-c-secondary">
                    | Cover Test
                  </label>
                  <section className="mt-5 flex gap-3 w-full">
                    <div className="w-1/2">
                      <p className="text-p-sm font-medium text-f-gray">OD</p>
                      <div className="border border-f-gray bg-white p-5 rounded-md mt-3 flex flex-col gap-5">
                        <div className="flex">
                          <p className="text-f-dark font-medium w-1/4">
                            With Rx
                          </p>
                          <section className="flex justify-between w-full">
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="with_rx_near"
                                value="near"
                                checked={
                                  medformData.objective.cover_test.od.with_rx
                                    .near
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "objective.cover_test.od.with_rx.near"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-f-gray font-medium text-p-sm">
                                Near
                              </span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="with_rx_distance"
                                value="distance"
                                checked={
                                  medformData.objective.cover_test.od.with_rx
                                    .distance
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "objective.cover_test.od.with_rx.distance"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-f-gray font-medium text-p-sm">
                                Distance
                              </span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="with_rx_tropia"
                                value="tropia"
                                checked={
                                  medformData.objective.cover_test.od.with_rx
                                    .tropia
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "objective.cover_test.od.with_rx.tropia"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-f-gray font-medium text-p-sm">
                                Tropia
                              </span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="with_rx_phoria"
                                value="phoria"
                                checked={
                                  medformData.objective.cover_test.od.with_rx
                                    .phoria
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "objective.cover_test.od.with_rx.phoria"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-f-gray font-medium text-p-sm">
                                Phoria
                              </span>
                            </label>
                          </section>
                        </div>
                        <div className="flex">
                          <p className="text-f-dark font-medium w-1/4">
                            Without Rx
                          </p>
                          <section className="flex justify-between w-full">
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="without_rx_near"
                                value="near"
                                checked={
                                  medformData.objective.cover_test.od.without_rx
                                    .near
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "objective.cover_test.od.without_rx.near"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-f-gray font-medium text-p-sm">
                                Near
                              </span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="without_rx_distance"
                                value="distance"
                                checked={
                                  medformData.objective.cover_test.od.without_rx
                                    .distance
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "objective.cover_test.od.without_rx.distance"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-f-gray font-medium text-p-sm">
                                Distance
                              </span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="without_rx_tropia"
                                value="tropia"
                                checked={
                                  medformData.objective.cover_test.od.without_rx
                                    .tropia
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "objective.cover_test.od.without_rx.tropia"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-f-gray font-medium text-p-sm">
                                Tropia
                              </span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="without_rx_phoria"
                                value="phoria"
                                checked={
                                  medformData.objective.cover_test.od.without_rx
                                    .phoria
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "objective.cover_test.od.without_rx.phoria"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-f-gray font-medium text-p-sm">
                                Phoria
                              </span>
                            </label>
                          </section>
                        </div>
                      </div>
                    </div>
                    <div className="w-1/2">
                      <p className="text-p-sm font-medium text-f-gray">OS</p>
                      <div className="border border-f-gray bg-white p-5 rounded-md mt-3 flex flex-col gap-5">
                        <div className="flex">
                          <p className="text-f-dark font-medium w-1/4">
                            With Rx
                          </p>
                          <section className="flex justify-between w-full">
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="with_rx_near"
                                value="near"
                                checked={
                                  medformData.objective.cover_test.os.with_rx
                                    .near
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "objective.cover_test.os.with_rx.near"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-f-gray font-medium text-p-sm">
                                Near
                              </span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="with_rx_distance"
                                value="distance"
                                checked={
                                  medformData.objective.cover_test.os.with_rx
                                    .distance
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "objective.cover_test.os.with_rx.distance"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-f-gray font-medium text-p-sm">
                                Distance
                              </span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="with_rx_tropia"
                                value="tropia"
                                checked={
                                  medformData.objective.cover_test.os.with_rx
                                    .tropia
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "objective.cover_test.os.with_rx.tropia"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-f-gray font-medium text-p-sm">
                                Tropia
                              </span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="with_rx_phoria"
                                value="phoria"
                                checked={
                                  medformData.objective.cover_test.os.with_rx
                                    .phoria
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "objective.cover_test.os.with_rx.phoria"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-f-gray font-medium text-p-sm">
                                Phoria
                              </span>
                            </label>
                          </section>
                        </div>
                        <div className="flex">
                          <p className="text-f-dark font-medium w-1/4">
                            Without Rx
                          </p>
                          <section className="flex justify-between w-full">
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="without_rx_near"
                                value="near"
                                checked={
                                  medformData.objective.cover_test.os.without_rx
                                    .near
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "objective.cover_test.os.without_rx.near"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-f-gray font-medium text-p-sm">
                                Near
                              </span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="without_rx_distance"
                                value="distance"
                                checked={
                                  medformData.objective.cover_test.os.without_rx
                                    .distance
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "objective.cover_test.os.without_rx.distance"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-f-gray font-medium text-p-sm">
                                Distance
                              </span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="without_rx_tropia"
                                value="tropia"
                                checked={
                                  medformData.objective.cover_test.os.without_rx
                                    .tropia
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "objective.cover_test.os.without_rx.tropia"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-f-gray font-medium text-p-sm">
                                Tropia
                              </span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="without_rx_phoria"
                                value="phoria"
                                checked={
                                  medformData.objective.cover_test.os.without_rx
                                    .phoria
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "objective.cover_test.os.without_rx.phoria"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-f-gray font-medium text-p-sm">
                                Phoria
                              </span>
                            </label>
                          </section>
                        </div>
                      </div>
                    </div>
                  </section>
                  <textarea
                    type="text"
                    name="cover_test_additional_note"
                    value={medformData.objective.cover_test.additional_note}
                    onChange={(e) =>
                      handleChange(e, "objective.cover_test.additional_note")
                    }
                    className="mt-3 h-24 w-full px-4 py-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                    placeholder="If option not available"
                  />
                </div>
                <div className="flex gap-5">
                  <div className="border border-f-gray bg-bg-mc w-1/2 rounded-md p-5">
                    <label className="text-p-rg font-semibold text-c-secondary">
                      | Confrontation Test
                    </label>
                    <div className="flex gap-5 mt-5">
                      <section className="w-2/3">
                        <div className="flex flex-col w-full">
                          <p className="text-p-sm font-medium text-f-gray">
                            OD
                          </p>
                          <textarea
                            type="text"
                            name="confrontation_test_od"
                            value={medformData.objective.confrontation_test.od}
                            onChange={(e) =>
                              handleChange(e, "objective.confrontation_test.od")
                            }
                            className="mt-4 h-20 w-full px-4 py-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                            placeholder=""
                          />
                        </div>
                        <div className="flex flex-col w-full">
                          <p className="text-p-sm font-medium text-f-gray">
                            OS
                          </p>
                          <textarea
                            type="text"
                            name="confrontation_test_os"
                            value={medformData.objective.confrontation_test.os}
                            onChange={(e) =>
                              handleChange(e, "objective.confrontation_test.os")
                            }
                            className="mt-4 h-20 w-full px-4 py-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                            placeholder=""
                          />
                        </div>
                      </section>
                      <div className="w-2/3 border border-c-gray p-5 bg-white rounded-sm">
                        <img
                          src={canvasImages.CROSS || CROSS}
                          alt="CROSS IMG"
                          className="w-full aspect-square"
                          onClick={() => handleImageClick("CROSS")}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="border border-f-gray bg-bg-mc w-1/2 rounded-md p-5">
                    <label className="text-p-rg font-semibold text-c-secondary">
                      | Stereopsis
                    </label>
                    <section className="mt-5 flex flex-col gap-3">
                      <div className="flex gap-3">
                        <div className="py-4 flex items-end">
                          <p className="text-p-sm font-medium text-f-gray text-nowrap">
                            Stereopsis Score
                          </p>
                        </div>
                        <div className="flex flex-col w-full">
                          <p className="text-p-sm font-medium text-f-gray">
                            OD
                          </p>
                          <input
                            type="text"
                            name="stereopsis_score_od"
                            value={
                              medformData.objective.stereopsis.stereopsis_score
                                .od
                            }
                            onChange={(e) =>
                              handleChange(
                                e,
                                "objective.stereopsis.stereopsis_score.od"
                              )
                            }
                            className="mt-2 w-full p-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                          />
                        </div>
                        <div className="flex flex-col w-full">
                          <p className="text-p-sm font-medium text-f-gray">
                            OS
                          </p>
                          <input
                            type="text"
                            name="stereopsis_score_os"
                            value={
                              medformData.objective.stereopsis.stereopsis_score
                                .os
                            }
                            onChange={(e) =>
                              handleChange(
                                e,
                                "objective.stereopsis.stereopsis_score.os"
                              )
                            }
                            className="mt-2 w-full p-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                          />
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className="w-2/3">
                          <p className="text-p-sm font-medium text-f-gray">
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
                                medformData.objective.stereopsis.perceived_DO.od
                                  .yes
                              }
                              onChange={() =>
                                setMedformData((prevData) => ({
                                  ...prevData,
                                  objective: {
                                    ...prevData.objective,
                                    stereopsis: {
                                      ...prevData.objective.stereopsis,
                                      perceived_DO: {
                                        ...prevData.objective.stereopsis
                                          .perceived_DO,
                                        od: { yes: true, no: false },
                                      },
                                    },
                                  },
                                }))
                              }
                              className="mr-3 w-6 h-6"
                            />
                            <span className="text-f-gray font-semibold text-p-sm">
                              Yes
                            </span>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="radio"
                              name="pdo_od_no"
                              value="no"
                              checked={
                                medformData.objective.stereopsis.perceived_DO.od
                                  .no
                              }
                              onChange={() =>
                                setMedformData((prevData) => ({
                                  ...prevData,
                                  objective: {
                                    ...prevData.objective,
                                    stereopsis: {
                                      ...prevData.objective.stereopsis,
                                      perceived_DO: {
                                        ...prevData.objective.stereopsis
                                          .perceived_DO,
                                        od: { yes: false, no: true },
                                      },
                                    },
                                  },
                                }))
                              }
                              className="mr-3 w-6 h-6"
                            />
                            <span className="text-f-gray font-semibold text-p-sm">
                              No
                            </span>
                          </div>
                        </section>
                        <section className="flex gap-3 w-full justify-center">
                          <div className="flex items-center">
                            <input
                              type="radio"
                              name="pdo_os_yes"
                              value="yes"
                              checked={
                                medformData.objective.stereopsis.perceived_DO.os
                                  .yes
                              }
                              onChange={() =>
                                setMedformData((prevData) => ({
                                  ...prevData,
                                  objective: {
                                    ...prevData.objective,
                                    stereopsis: {
                                      ...prevData.objective.stereopsis,
                                      perceived_DO: {
                                        ...prevData.objective.stereopsis
                                          .perceived_DO,
                                        os: { yes: true, no: false },
                                      },
                                    },
                                  },
                                }))
                              }
                              className="mr-3 w-6 h-6"
                            />
                            <span className="text-f-gray font-semibold text-p-sm">
                              Yes
                            </span>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="radio"
                              name="pdo_os_no"
                              value="no"
                              checked={
                                medformData.objective.stereopsis.perceived_DO.os
                                  .no
                              }
                              onChange={() =>
                                setMedformData((prevData) => ({
                                  ...prevData,
                                  objective: {
                                    ...prevData.objective,
                                    stereopsis: {
                                      ...prevData.objective.stereopsis,
                                      perceived_DO: {
                                        ...prevData.objective.stereopsis
                                          .perceived_DO,
                                        os: { yes: false, no: true },
                                      },
                                    },
                                  },
                                }))
                              }
                              className="mr-3 w-6 h-6"
                            />
                            <span className="text-f-gray font-semibold text-p-sm">
                              No
                            </span>
                          </div>
                        </section>
                      </div>
                    </section>
                    <textarea
                      type="text"
                      name="stereopsis_additional_note"
                      value={medformData.objective.stereopsis.additional_note}
                      onChange={(e) =>
                        handleChange(e, "objective.stereopsis.additional_note")
                      }
                      className="mt-4 h-24 w-full px-4 py-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                      placeholder="If option not available"
                    />
                  </div>
                </div>
                <div className="w-full flex gap-5">
                  <div className="w-1/2 flex flex-col gap-5">
                    <div className="border border-f-gray bg-bg-mc w-full rounded-md p-5">
                      <label className="text-p-rg font-semibold text-c-secondary">
                        | Diplopia Test
                      </label>
                      <section className="mt-5 flex gap-5">
                        <div className="flex flex-col gap-3">
                          <div className="flex items-center">
                            <input
                              type="radio"
                              name="diplopia_present"
                              value="present"
                              checked={
                                medformData.objective.diplopia_test.present
                              }
                              onChange={() =>
                                setMedformData((prevData) => ({
                                  ...prevData,
                                  objective: {
                                    ...prevData.objective,
                                    diplopia_test: {
                                      ...prevData.objective.diplopia_test,
                                      present: true,
                                      absent: false,
                                    },
                                  },
                                }))
                              }
                              className="mr-3 w-6 h-6"
                            />
                            <span className="text-f-gray font-semibold text-p-sm">
                              Present
                            </span>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="radio"
                              name="diplopia_absent"
                              value="absent"
                              checked={
                                medformData.objective.diplopia_test.absent
                              }
                              onChange={() =>
                                setMedformData((prevData) => ({
                                  ...prevData,
                                  objective: {
                                    ...prevData.objective,
                                    diplopia_test: {
                                      ...prevData.objective.diplopia_test,
                                      present: false,
                                      absent: true,
                                    },
                                  },
                                }))
                              }
                              className="mr-3 w-6 h-6"
                            />
                            <span className="text-f-gray font-semibold text-p-sm">
                              Absent
                            </span>
                          </div>
                        </div>
                        <textarea
                          type="text"
                          name="diplopia_additional_note"
                          value={
                            medformData.objective.diplopia_test.additional_note
                          }
                          onChange={(e) =>
                            handleChange(
                              e,
                              "objective.diplopia_test.additional_note"
                            )
                          }
                          className="w-full p-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                        />
                      </section>
                    </div>
                    <div className="border border-f-gray bg-bg-mc w-full rounded-md p-5">
                      <label className="text-p-rg font-semibold text-c-secondary">
                        | Corneal Reflex Test
                      </label>
                      <section className="mt-5 flex justify-between">
                        <div>
                          <p className="text-p-sm font-medium text-f-gray text-nowrap mb-3">
                            OD
                          </p>
                          <div className="flex gap-8">
                            <div className="flex items-center">
                              <input
                                type="radio"
                                name="corneal_od_present"
                                value="present"
                                checked={
                                  medformData.objective.corneal_reflex_test.od
                                    .present
                                }
                                onChange={() =>
                                  setMedformData((prevData) => ({
                                    ...prevData,
                                    objective: {
                                      ...prevData.objective,
                                      corneal_reflex_test: {
                                        ...prevData.objective
                                          .corneal_reflex_test,
                                        od: { present: true, absent: false },
                                      },
                                    },
                                  }))
                                }
                                className="mr-3 w-6 h-6"
                              />
                              <span className="text-f-gray font-semibold text-p-sm">
                                Present
                              </span>
                            </div>
                            <div className="flex items-center">
                              <input
                                type="radio"
                                name="corneal_od_absent"
                                value="absent"
                                checked={
                                  medformData.objective.corneal_reflex_test.od
                                    .absent
                                }
                                onChange={() =>
                                  setMedformData((prevData) => ({
                                    ...prevData,
                                    objective: {
                                      ...prevData.objective,
                                      corneal_reflex_test: {
                                        ...prevData.objective
                                          .corneal_reflex_test,
                                        od: { present: false, absent: true },
                                      },
                                    },
                                  }))
                                }
                                className="mr-3 w-6 h-6"
                              />
                              <span className="text-f-gray font-semibold text-p-sm">
                                Absent
                              </span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <p className="text-p-sm font-medium text-f-gray text-nowrap mb-3">
                            OS
                          </p>
                          <div className="flex gap-8">
                            <div className="flex items-center">
                              <input
                                type="radio"
                                name="corneal_os_present"
                                value="present"
                                checked={
                                  medformData.objective.corneal_reflex_test.os
                                    .present
                                }
                                onChange={() =>
                                  setMedformData((prevData) => ({
                                    ...prevData,
                                    objective: {
                                      ...prevData.objective,
                                      corneal_reflex_test: {
                                        ...prevData.objective
                                          .corneal_reflex_test,
                                        os: { present: true, absent: false },
                                      },
                                    },
                                  }))
                                }
                                className="mr-3 w-6 h-6"
                              />
                              <span className="text-f-gray font-semibold text-p-sm">
                                Present
                              </span>
                            </div>
                            <div className="flex items-center">
                              <input
                                type="radio"
                                name="corneal_os_absent"
                                value="absent"
                                checked={
                                  medformData.objective.corneal_reflex_test.os
                                    .absent
                                }
                                onChange={() =>
                                  setMedformData((prevData) => ({
                                    ...prevData,
                                    objective: {
                                      ...prevData.objective,
                                      corneal_reflex_test: {
                                        ...prevData.objective
                                          .corneal_reflex_test,
                                        os: { present: false, absent: true },
                                      },
                                    },
                                  }))
                                }
                                className="mr-3 w-6 h-6"
                              />
                              <span className="text-f-gray font-semibold text-p-sm">
                                Absent
                              </span>
                            </div>
                          </div>
                        </div>
                      </section>
                      <textarea
                        type="text"
                        name="corneal_additional_note"
                        value={
                          medformData.objective.corneal_reflex_test
                            .additional_note
                        }
                        onChange={(e) =>
                          handleChange(
                            e,
                            "objective.corneal_reflex_test.additional_note"
                          )
                        }
                        className="mt-4 h-24 w-full px-4 py-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                        placeholder=""
                      />
                    </div>
                    <div className="border border-f-gray bg-bg-mc w-full rounded-md p-5">
                      <label className="text-p-rg font-semibold text-c-secondary">
                        | Motility Test
                      </label>
                      <section className="mt-5 flex justify-between">
                        <div>
                          <p className="text-p-sm font-medium text-f-gray text-nowrap mb-3">
                            OD
                          </p>
                          <div className="flex gap-8">
                            <div className="flex items-center">
                              <input
                                type="radio"
                                name="motility_od_normal"
                                value="normal"
                                checked={
                                  medformData.objective.motility_test.od.normal
                                }
                                onChange={() =>
                                  setMedformData((prevData) => ({
                                    ...prevData,
                                    objective: {
                                      ...prevData.objective,
                                      motility_test: {
                                        ...prevData.objective.motility_test,
                                        od: { normal: true, abnormal: false },
                                      },
                                    },
                                  }))
                                }
                                className="mr-3 w-6 h-6"
                              />
                              <span className="text-f-gray font-semibold text-p-sm">
                                Normal
                              </span>
                            </div>
                            <div className="flex items-center">
                              <input
                                type="radio"
                                name="motility_od_abnormal"
                                value="abnormal"
                                checked={
                                  medformData.objective.motility_test.od
                                    .abnormal
                                }
                                onChange={() =>
                                  setMedformData((prevData) => ({
                                    ...prevData,
                                    objective: {
                                      ...prevData.objective,
                                      motility_test: {
                                        ...prevData.objective.motility_test,
                                        od: { normal: false, abnormal: true },
                                      },
                                    },
                                  }))
                                }
                                className="mr-3 w-6 h-6"
                              />
                              <span className="text-f-gray font-semibold text-p-sm">
                                Abnormal
                              </span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <p className="text-p-sm font-medium text-f-gray text-nowrap mb-3">
                            OS
                          </p>
                          <div className="flex gap-8">
                            <div className="flex items-center">
                              <input
                                type="radio"
                                name="motility_os_normal"
                                value="normal"
                                checked={
                                  medformData.objective.motility_test.os.normal
                                }
                                onChange={() =>
                                  setMedformData((prevData) => ({
                                    ...prevData,
                                    objective: {
                                      ...prevData.objective,
                                      motility_test: {
                                        ...prevData.objective.motility_test,
                                        os: { normal: true, abnormal: false },
                                      },
                                    },
                                  }))
                                }
                                className="mr-3 w-6 h-6"
                              />
                              <span className="text-f-gray font-semibold text-p-sm">
                                Normal
                              </span>
                            </div>
                            <div className="flex items-center">
                              <input
                                type="radio"
                                name="motility_os_abnormal"
                                value="abnormal"
                                checked={
                                  medformData.objective.motility_test.os
                                    .abnormal
                                }
                                onChange={() =>
                                  setMedformData((prevData) => ({
                                    ...prevData,
                                    objective: {
                                      ...prevData.objective,
                                      motility_test: {
                                        ...prevData.objective.motility_test,
                                        os: { normal: false, abnormal: true },
                                      },
                                    },
                                  }))
                                }
                                className="mr-3 w-6 h-6"
                              />
                              <span className="text-f-gray font-semibold text-p-sm">
                                Abnormal
                              </span>
                            </div>
                          </div>
                        </div>
                      </section>
                      <textarea
                        type="text"
                        name="motility_additional_note"
                        value={
                          medformData.objective.motility_test.additional_note
                        }
                        onChange={(e) =>
                          handleChange(
                            e,
                            "objective.motility_test.additional_note"
                          )
                        }
                        className="mt-4 h-24 w-full px-4 py-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                        placeholder=""
                      />
                    </div>
                    <div className="border border-f-gray bg-bg-mc w-full rounded-md p-5">
                      <label className="text-p-rg font-semibold text-c-secondary">
                        | Saccadic Test
                      </label>
                      <section className="mt-5 flex justify-between">
                        <div>
                          <p className="text-p-sm font-medium text-f-gray text-nowrap mb-3">
                            OD
                          </p>
                          <div className="flex gap-8">
                            <div className="flex items-center">
                              <input
                                type="radio"
                                name="saccadic_od_present"
                                value="present"
                                checked={
                                  medformData.objective.saccadic_test.od.present
                                }
                                onChange={() =>
                                  setMedformData((prevData) => ({
                                    ...prevData,
                                    objective: {
                                      ...prevData.objective,
                                      saccadic_test: {
                                        ...prevData.objective.saccadic_test,
                                        od: { present: true, absent: false },
                                      },
                                    },
                                  }))
                                }
                                className="mr-3 w-6 h-6"
                              />
                              <span className="text-f-gray font-semibold text-p-sm">
                                Present
                              </span>
                            </div>
                            <div className="flex items-center">
                              <input
                                type="radio"
                                name="saccadic_od_absent"
                                value="absent"
                                checked={
                                  medformData.objective.saccadic_test.od.absent
                                }
                                onChange={() =>
                                  setMedformData((prevData) => ({
                                    ...prevData,
                                    objective: {
                                      ...prevData.objective,
                                      saccadic_test: {
                                        ...prevData.objective.saccadic_test,
                                        od: { present: false, absent: true },
                                      },
                                    },
                                  }))
                                }
                                className="mr-3 w-6 h-6"
                              />
                              <span className="text-f-gray font-semibold text-p-sm">
                                Absent
                              </span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <p className="text-p-sm font-medium text-f-gray text-nowrap mb-3">
                            OS
                          </p>
                          <div className="flex gap-8">
                            <div className="flex items-center">
                              <input
                                type="radio"
                                name="saccadic_os_present"
                                value="present"
                                checked={
                                  medformData.objective.saccadic_test.os.present
                                }
                                onChange={() =>
                                  setMedformData((prevData) => ({
                                    ...prevData,
                                    objective: {
                                      ...prevData.objective,
                                      saccadic_test: {
                                        ...prevData.objective.saccadic_test,
                                        os: { present: true, absent: false },
                                      },
                                    },
                                  }))
                                }
                                className="mr-3 w-6 h-6"
                              />
                              <span className="text-f-gray font-semibold text-p-sm">
                                Present
                              </span>
                            </div>
                            <div className="flex items-center">
                              <input
                                type="radio"
                                name="saccadic_os_absent"
                                value="absent"
                                checked={
                                  medformData.objective.saccadic_test.os.absent
                                }
                                onChange={() =>
                                  setMedformData((prevData) => ({
                                    ...prevData,
                                    objective: {
                                      ...prevData.objective,
                                      saccadic_test: {
                                        ...prevData.objective.saccadic_test,
                                        os: { present: false, absent: true },
                                      },
                                    },
                                  }))
                                }
                                className="mr-3 w-6 h-6"
                              />
                              <span className="text-f-gray font-semibold text-p-sm">
                                Absent
                              </span>
                            </div>
                          </div>
                        </div>
                      </section>
                      <textarea
                        type="text"
                        name="saccadic_additional_note"
                        value={
                          medformData.objective.saccadic_test.additional_note
                        }
                        onChange={(e) =>
                          handleChange(
                            e,
                            "objective.saccadic_test.additional_note"
                          )
                        }
                        className="mt-4 h-24 w-full px-4 py-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                        placeholder=""
                      />
                    </div>
                  </div>
                  <div className="w-1/2 flex flex-col gap-5">
                    <div className="border border-f-gray bg-bg-mc rounded-md p-5">
                      <label className="text-p-rg font-semibold text-c-secondary">
                        | Amsler Grid
                      </label>
                      <section className=" mt-6 flex gap-3 w-full">
                        <div className="flex flex-col w-full">
                          <p className="text-p-sm font-medium text-f-gray">
                            OD
                          </p>
                          <select
                            name="amsler_od"
                            value={medformData.objective.amsler_grid.od}
                            onChange={(e) =>
                              handleChange(e, "objective.amsler_grid.od")
                            }
                            className="mt-3 w-full p-3 border border-f-gray rounded-md text-f-dark  focus:outline-c-primary"
                          >
                            <option
                              value=""
                              disabled
                              className="text-f-border-f-gray"
                            >
                              -
                            </option>
                            <option value="Full Field">Full Field</option>
                          </select>
                        </div>
                        <div className="flex flex-col w-full">
                          <p className="text-p-sm font-medium text-f-gray">
                            OS
                          </p>
                          <select
                            name="amsler_os"
                            value={medformData.objective.amsler_grid.os}
                            onChange={(e) =>
                              handleChange(e, "objective.amsler_grid.os")
                            }
                            className="mt-3 w-full p-3 border border-f-gray rounded-md text-f-dark  focus:outline-c-primary"
                          >
                            <option
                              value=""
                              disabled
                              className="text-f-border-f-gray"
                            >
                              -
                            </option>
                            <option value="Full Field">Full Field</option>
                          </select>
                        </div>
                      </section>
                      <section className="flex gap-5 mt-5 ">
                        <textarea
                          type="text"
                          name="amsler_additional_note"
                          value={
                            medformData.objective.amsler_grid.additional_note
                          }
                          onChange={(e) =>
                            handleChange(
                              e,
                              "objective.amsler_grid.additional_note"
                            )
                          }
                          className="h-32 w-full px-4 py-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                          placeholder=""
                        />
                        <div className="flex flex-col justify-center items-center gap-3">
                          <p className="text-p-sm font-medium text-f-gray text-nowrap">
                            Sample Image
                          </p>
                          <img
                            src=""
                            alt=""
                            className="bg-blue-900 w-24 h-24"
                          />
                        </div>
                      </section>
                    </div>
                    <div className="border border-f-gray bg-bg-mc rounded-md p-5">
                      <label className="text-p-rg font-semibold text-c-secondary">
                        | Worth’s Four Dots
                      </label>
                      <section className="flex gap-3 mt-5">
                        <div className="flex flex-col w-full">
                          <p className="text-p-sm font-medium text-f-gray">
                            OD
                          </p>
                          <textarea
                            type="text"
                            name="wfd_od"
                            value={medformData.objective.worths_FD.od}
                            onChange={(e) =>
                              handleChange(e, "objective.worths_FD.od")
                            }
                            className="mt-4 h-20 w-full px-4 py-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                            placeholder=""
                          />
                        </div>
                        <div className="flex flex-col w-full">
                          <p className="text-p-sm font-medium text-f-gray">
                            OS
                          </p>
                          <textarea
                            type="text"
                            name="wfd_os"
                            value={medformData.objective.worths_FD.os}
                            onChange={(e) =>
                              handleChange(e, "objective.worths_FD.os")
                            }
                            className="mt-4 h-20 w-full px-4 py-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                            placeholder=""
                          />
                        </div>
                      </section>
                    </div>
                    <div className="border border-f-gray bg-bg-mc rounded-md p-5">
                      <label className="text-p-rg font-semibold text-c-secondary">
                        | Ishihara Test
                      </label>
                      <section className="flex gap-3 mt-5">
                        <div className="flex flex-col w-full">
                          <p className="text-p-sm font-medium text-f-gray">
                            OD
                          </p>
                          <textarea
                            type="text"
                            name="ishihara_od"
                            value={medformData.objective.ishihara_test.od}
                            onChange={(e) =>
                              handleChange(e, "objective.ishihara_test.od")
                            }
                            className="mt-4 h-20 w-full px-4 py-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                            placeholder=""
                          />
                        </div>
                        <div className="flex flex-col w-full">
                          <p className="text-p-sm font-medium text-f-gray">
                            OS
                          </p>
                          <textarea
                            type="text"
                            name="ishihara_os"
                            value={medformData.objective.ishihara_test.os}
                            onChange={(e) =>
                              handleChange(e, "objective.ishihara_test.os")
                            }
                            className="mt-4 h-20 w-full px-4 py-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                            placeholder=""
                          />
                        </div>
                      </section>
                    </div>
                    <div className="border border-f-gray bg-bg-mc rounded-md p-5">
                      <label className="text-p-rg font-semibold text-c-secondary">
                        | Schirmer Test
                      </label>
                      <section className="flex gap-3 mt-5">
                        <div className="flex flex-col w-full">
                          <p className="text-p-sm font-medium text-f-gray">
                            OD
                          </p>
                          <textarea
                            type="text"
                            name="schirmer_od"
                            value={medformData.objective.schirmer_test.od}
                            onChange={(e) =>
                              handleChange(e, "objective.schirmer_test.od")
                            }
                            className="mt-4 h-20 w-full px-4 py-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                            placeholder=""
                          />
                        </div>
                        <div className="flex flex-col w-full">
                          <p className="text-p-sm font-medium text-f-gray">
                            OS
                          </p>
                          <textarea
                            type="text"
                            name="schirmer_os"
                            value={medformData.objective.schirmer_test.os}
                            onChange={(e) =>
                              handleChange(e, "objective.schirmer_test.os")
                            }
                            className="mt-4 h-20 w-full px-4 py-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                            placeholder=""
                          />
                        </div>
                      </section>
                    </div>
                  </div>
                </div>
                <div className="flex gap-5">
                  <div className="border border-f-gray bg-bg-mc w-1/2 rounded-md p-5">
                    <label className="text-p-rg font-semibold text-c-secondary">
                      | Ophthalmoscopy
                    </label>
                    <section className="flex gap-5 mt-5">
                      <div className="w-1/2 ">
                        <header className="bg-bg-sb border border-c-gray3 py-1 font-semibold text-p-sm text-f-gray rounded-t-md flex justify-center">
                          OD
                        </header>
                        <div className="border border-c-gray3 p-5 bg-white rounded-sm">
                          <img
                            src={canvasImages.BLANK || BLANK}
                            alt="BLANK IMG"
                            className="w-full aspect-square"
                            onClick={() => handleImageClick("BLANK")}
                          />
                        </div>
                      </div>
                      <div className="w-1/2 ">
                        <header className="bg-bg-sb border border-c-gray3 py-1 font-semibold text-p-sm text-f-gray rounded-t-md flex justify-center">
                          OS
                        </header>
                        <div className="border border-c-gray3 p-5 bg-white rounded-sm">
                          <img
                            src={canvasImages.BLANK || BLANK}
                            alt="BLANK IMG"
                            className="w-full aspect-square"
                            onClick={() => handleImageClick("BLANK")}
                          />
                        </div>
                      </div>
                    </section>
                  </div>
                  <div className="border border-f-gray bg-bg-mc w-1/2 rounded-md p-5">
                    <label className="text-p-rg font-semibold text-c-secondary">
                      | Intra-Ocular Pressure (IOP)
                    </label>
                    <section className="flex mt-5 gap-3">
                      <div className="flex flex-col w-full">
                        <p className="text-p-sm font-medium text-f-gray">OD</p>
                        <input
                          type="text"
                          name="iop_od"
                          value={medformData.objective.IOP.od}
                          onChange={(e) => handleChange(e, "objective.IOP.od")}
                          className="mt-2 w-full p-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                        />
                      </div>
                      <div className="flex flex-col w-full">
                        <p className="text-p-sm font-medium text-f-gray">OS</p>
                        <input
                          type="text"
                          name="iop_os"
                          value={medformData.objective.IOP.os}
                          onChange={(e) => handleChange(e, "objective.IOP.os")}
                          className="mt-2 w-full p-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                        />
                      </div>
                    </section>
                    <div className="flex gap-3 mt-3">
                      <input
                        type="image"
                        className="w-full border border-f-gray h-44"
                      />
                      <div className="flex flex-col gap-4 ">
                        <img src="" alt="" className="bg-blue-900 w-20 h-20" />
                        <img src="" alt="" className="bg-blue-900 w-20 h-20" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full">
                  <header className="flex justify-center py-2 rounded-t-md w-full border border-f-gray text-c-secondary text-p-rg font-semibold bg-bg-sb mb-2">
                    <h1>Internal Examination</h1>
                  </header>
                  <div className="p-5 border border-f-gray bg-bg-mc rounded-b-md flex gap-5">
                    <div className="w-1/5">
                      <header className="bg-bg-sb border border-c-gray3 py-1 font-semibold text-p-sm text-f-gray rounded-t-md flex justify-center">
                        OD
                      </header>
                      <div className="border border-c-gray3 p-5 bg-white rounded-sm">
                        <img
                          src={canvasImages.OD || OD}
                          alt="OD IMG"
                          className="w-full aspect-square"
                          onClick={() => handleImageClick("OD")}
                        />
                      </div>
                    </div>
                    <section className="flex flex-col gap-5 w-2/3">
                      <div className="flex gap-3 items-center">
                        <input
                          type="text"
                          name="cdr_od"
                          value={
                            medformData.objective.internal_examination
                              .cup_disc_ratio.od
                          }
                          onChange={(e) =>
                            handleChange(
                              e,
                              "objective.internal_examination.cup_disc_ratio.od"
                            )
                          }
                          className="mt-2 w-2/3 p-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                        />
                        <p className="text-p-sm font-medium text-c-secondary text-nowrap text-center w-1/3">
                          Cup/Disc Ratio
                        </p>
                        <input
                          type="text"
                          name="cdr_os"
                          value={
                            medformData.objective.internal_examination
                              .cup_disc_ratio.os
                          }
                          onChange={(e) =>
                            handleChange(
                              e,
                              "objective.internal_examination.cup_disc_ratio.os"
                            )
                          }
                          className="mt-2 w-2/3  p-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                        />
                      </div>
                      <div className="flex gap-3 items-center">
                        <input
                          type="text"
                          name="avr_od"
                          value={
                            medformData.objective.internal_examination.av_ratio
                              .od
                          }
                          onChange={(e) =>
                            handleChange(
                              e,
                              "objective.internal_examination.av_ratio.od"
                            )
                          }
                          className="mt-2 w-2/3 p-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                        />
                        <p className="text-p-sm font-medium text-c-secondary text-nowrap text-center w-1/3">
                          A/V Ratio
                        </p>
                        <input
                          type="text"
                          name="avr_os"
                          value={
                            medformData.objective.internal_examination.av_ratio
                              .os
                          }
                          onChange={(e) =>
                            handleChange(
                              e,
                              "objective.internal_examination.av_ratio.os"
                            )
                          }
                          className="mt-2 w-2/3 p-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                        />
                      </div>
                      <div className="flex gap-3 items-center">
                        <select
                          name="macula_od"
                          value={
                            medformData.objective.internal_examination.macula.od
                          }
                          onChange={(e) =>
                            handleChange(
                              e,
                              "objective.internal_examination.macula.od"
                            )
                          }
                          className="mt-3 w-2/3 p-3 border border-f-gray rounded-md text-f-dark  focus:outline-c-primary"
                        >
                          <option
                            value=""
                            disabled
                            className="text-f-border-f-gray"
                          >
                            -
                          </option>
                          <option value="Abnormal (Drusen)">
                            Abnormal (Drusen)
                          </option>
                        </select>
                        <p className="text-p-sm font-medium text-c-secondary text-nowrap text-center w-1/3">
                          Macula
                        </p>
                        <select
                          name="macula_os"
                          value={
                            medformData.objective.internal_examination.macula.os
                          }
                          onChange={(e) =>
                            handleChange(
                              e,
                              "objective.internal_examination.macula.os"
                            )
                          }
                          className="mt-3 w-2/3 p-3 border border-f-gray rounded-md text-f-dark  focus:outline-c-primary"
                        >
                          <option
                            value=""
                            disabled
                            className="text-f-border-f-gray"
                          >
                            -
                          </option>
                          <option value="Abnormal (Drusen)">
                            Abnormal (Drusen)
                          </option>
                        </select>
                      </div>
                      <div className="flex gap-3 items-center">
                        <select
                          name="virtreous_od"
                          value={
                            medformData.objective.internal_examination.virteous
                              .od
                          }
                          onChange={(e) =>
                            handleChange(
                              e,
                              "objective.internal_examination.virteous.od"
                            )
                          }
                          className="mt-3 w-2/3 p-3 border border-f-gray rounded-md text-f-dark  focus:outline-c-primary"
                        >
                          <option
                            value=""
                            disabled
                            className="text-f-border-f-gray"
                          >
                            -
                          </option>
                          <option value="Hemorrhage">Hemorrhage</option>
                        </select>
                        <p className="text-p-sm font-medium text-c-secondary text-nowrap text-center w-1/3">
                          Vitreous
                        </p>
                        <select
                          name="virtreous_os"
                          value={
                            medformData.objective.internal_examination.virteous
                              .os
                          }
                          onChange={(e) =>
                            handleChange(
                              e,
                              "objective.internal_examination.virteous.os"
                            )
                          }
                          className="mt-3 w-2/3 p-3 border border-f-gray rounded-md text-f-dark  focus:outline-c-primary"
                        >
                          <option
                            value=""
                            disabled
                            className="text-f-border-f-gray"
                          >
                            -
                          </option>
                          <option value="Hemorrhage">Hemorrhage</option>
                        </select>
                      </div>
                      <div className="flex gap-3 items-center">
                        <div className="flex gap-6 w-2/3 bg-red">
                          <div className="flex items-center">
                            <input
                              type="radio"
                              name="vessel_od_normal"
                              value="normal"
                              checked={
                                medformData.objective.internal_examination
                                  .vessel.od.normal
                              }
                              onChange={() =>
                                setMedformData((prevData) => ({
                                  ...prevData,
                                  objective: {
                                    ...prevData.objective,
                                    internal_examination: {
                                      ...prevData.objective
                                        .internal_examination,
                                      vessel: {
                                        ...prevData.objective
                                          .internal_examination.vessel,
                                        od: { normal: true, abnormal: false },
                                      },
                                    },
                                  },
                                }))
                              }
                              className="mr-3 w-6 h-6"
                            />
                            <span className="text-f-gray font-semibold text-p-sm">
                              Normal
                            </span>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="radio"
                              name="vessel_od_abnormal"
                              value="abnormal"
                              checked={
                                medformData.objective.internal_examination
                                  .vessel.od.abnormal
                              }
                              onChange={() =>
                                setMedformData((prevData) => ({
                                  ...prevData,
                                  objective: {
                                    ...prevData.objective,
                                    internal_examination: {
                                      ...prevData.objective
                                        .internal_examination,
                                      vessel: {
                                        ...prevData.objective
                                          .internal_examination.vessel,
                                        od: { normal: false, abnormal: true },
                                      },
                                    },
                                  },
                                }))
                              }
                              className="mr-3 w-6 h-6"
                            />
                            <span className="text-f-gray font-semibold text-p-sm">
                              Abnormal
                            </span>
                          </div>
                        </div>
                        <p className="text-p-sm font-medium text-c-secondary text-nowrap text-center w-1/3">
                          Vessel
                        </p>
                        <div className="flex gap-6 w-2/3 justify-end">
                          <div className="flex items-center">
                            <input
                              type="radio"
                              name="vessel_os_normal"
                              value="normal"
                              checked={
                                medformData.objective.internal_examination
                                  .vessel.os.normal
                              }
                              onChange={() =>
                                setMedformData((prevData) => ({
                                  ...prevData,
                                  objective: {
                                    ...prevData.objective,
                                    internal_examination: {
                                      ...prevData.objective
                                        .internal_examination,
                                      vessel: {
                                        ...prevData.objective
                                          .internal_examination.vessel,
                                        os: { normal: true, abnormal: false },
                                      },
                                    },
                                  },
                                }))
                              }
                              className="mr-3 w-6 h-6"
                            />
                            <span className="text-f-gray font-semibold text-p-sm">
                              Normal
                            </span>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="radio"
                              name="vessel_os_abnormal"
                              value="abnormal"
                              checked={
                                medformData.objective.internal_examination
                                  .vessel.os.abnormal
                              }
                              onChange={() =>
                                setMedformData((prevData) => ({
                                  ...prevData,
                                  objective: {
                                    ...prevData.objective,
                                    internal_examination: {
                                      ...prevData.objective
                                        .internal_examination,
                                      vessel: {
                                        ...prevData.objective
                                          .internal_examination.vessel,
                                        os: { normal: false, abnormal: true },
                                      },
                                    },
                                  },
                                }))
                              }
                              className="mr-3 w-6 h-6"
                            />
                            <span className="text-f-gray font-semibold text-p-sm">
                              Abnormal
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-3 items-center">
                        <div className="flex gap-6 w-2/3">
                          <div className="flex items-center">
                            <input
                              type="radio"
                              name="venous_od_normal"
                              value="normal"
                              checked={
                                medformData.objective.internal_examination
                                  .venous_pulse.od.normal
                              }
                              onChange={() =>
                                setMedformData((prevData) => ({
                                  ...prevData,
                                  objective: {
                                    ...prevData.objective,
                                    internal_examination: {
                                      ...prevData.objective
                                        .internal_examination,
                                      venous_pulse: {
                                        ...prevData.objective
                                          .internal_examination.venous_pulse,
                                        od: { normal: true, abnormal: false },
                                      },
                                    },
                                  },
                                }))
                              }
                              className="mr-3 w-6 h-6"
                            />
                            <span className="text-f-gray font-semibold text-p-sm">
                              Normal
                            </span>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="radio"
                              name="venous_od_abnormal"
                              value=""
                              checked={
                                medformData.objective.internal_examination
                                  .venous_pulse.od.abnormal
                              }
                              onChange={() =>
                                setMedformData((prevData) => ({
                                  ...prevData,
                                  objective: {
                                    ...prevData.objective,
                                    internal_examination: {
                                      ...prevData.objective
                                        .internal_examination,
                                      venous_pulse: {
                                        ...prevData.objective
                                          .internal_examination.venous_pulse,
                                        od: { normal: false, abnormal: true },
                                      },
                                    },
                                  },
                                }))
                              }
                              className="mr-3 w-6 h-6"
                            />
                            <span className="text-f-gray font-semibold text-p-sm">
                              Abnormal
                            </span>
                          </div>
                        </div>
                        <p className="text-p-sm font-medium text-c-secondary text-nowrap text-center w-1/3">
                          Venous Pulse
                        </p>
                        <div className="flex gap-6 w-2/3 justify-end">
                          <div className="flex items-center">
                            <input
                              type="radio"
                              name="venous_os_normal"
                              value="normal"
                              checked={
                                medformData.objective.internal_examination
                                  .venous_pulse.os.normal
                              }
                              onChange={() =>
                                setMedformData((prevData) => ({
                                  ...prevData,
                                  objective: {
                                    ...prevData.objective,
                                    internal_examination: {
                                      ...prevData.objective
                                        .internal_examination,
                                      venous_pulse: {
                                        ...prevData.objective
                                          .internal_examination.venous_pulse,
                                        os: { normal: true, abnormal: false },
                                      },
                                    },
                                  },
                                }))
                              }
                              className="mr-3 w-6 h-6"
                            />
                            <span className="text-f-gray font-semibold text-p-sm">
                              Normal
                            </span>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="radio"
                              name="venous_os_abnormal"
                              value="abnormal"
                              checked={
                                medformData.objective.internal_examination
                                  .venous_pulse.os.abnormal
                              }
                              onChange={() =>
                                setMedformData((prevData) => ({
                                  ...prevData,
                                  objective: {
                                    ...prevData.objective,
                                    internal_examination: {
                                      ...prevData.objective
                                        .internal_examination,
                                      venous_pulse: {
                                        ...prevData.objective
                                          .internal_examination.venous_pulse,
                                        os: { normal: false, abnormal: true },
                                      },
                                    },
                                  },
                                }))
                              }
                              className="mr-3 w-6 h-6"
                            />
                            <span className="text-f-gray font-semibold text-p-sm">
                              Abnormal
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-3 items-center">
                        <div className="flex gap-6 w-2/3">
                          <div className="flex items-center">
                            <input
                              type="radio"
                              name="forveal_od_present"
                              value="present"
                              checked={
                                medformData.objective.internal_examination
                                  .forveal_reflex.od.present
                              }
                              onChange={() =>
                                setMedformData((prevData) => ({
                                  ...prevData,
                                  objective: {
                                    ...prevData.objective,
                                    internal_examination: {
                                      ...prevData.objective
                                        .internal_examination,
                                      forveal_reflex: {
                                        ...prevData.objective
                                          .internal_examination.forveal_reflex,
                                        od: { present: true, absent: false },
                                      },
                                    },
                                  },
                                }))
                              }
                              className="mr-3 w-6 h-6"
                            />
                            <span className="text-f-gray font-semibold text-p-sm">
                              Present
                            </span>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="radio"
                              name="forveal_od_absent"
                              value="absent"
                              checked={
                                medformData.objective.internal_examination
                                  .forveal_reflex.od.absent
                              }
                              onChange={() =>
                                setMedformData((prevData) => ({
                                  ...prevData,
                                  objective: {
                                    ...prevData.objective,
                                    internal_examination: {
                                      ...prevData.objective
                                        .internal_examination,
                                      forveal_reflex: {
                                        ...prevData.objective
                                          .internal_examination.forveal_reflex,
                                        od: { present: false, absent: true },
                                      },
                                    },
                                  },
                                }))
                              }
                              className="mr-3 w-6 h-6"
                            />
                            <span className="text-f-gray font-semibold text-p-sm">
                              Absent
                            </span>
                          </div>
                        </div>
                        <p className="text-p-sm font-medium text-c-secondary text-nowrap text-center w-1/3">
                          Foveal Reflex
                        </p>
                        <div className="flex gap-6 w-2/3 justify-end">
                          <div className="flex items-center">
                            <input
                              type="radio"
                              name="forveal_os_present"
                              value="present"
                              checked={
                                medformData.objective.internal_examination
                                  .forveal_reflex.os.present
                              }
                              onChange={() =>
                                setMedformData((prevData) => ({
                                  ...prevData,
                                  objective: {
                                    ...prevData.objective,
                                    internal_examination: {
                                      ...prevData.objective
                                        .internal_examination,
                                      forveal_reflex: {
                                        ...prevData.objective
                                          .internal_examination.forveal_reflex,
                                        os: { present: true, absent: false },
                                      },
                                    },
                                  },
                                }))
                              }
                              className="mr-3 w-6 h-6"
                            />
                            <span className="text-f-gray font-semibold text-p-sm">
                              Present
                            </span>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="radio"
                              name="forveal_os_absent"
                              value="absent"
                              checked={
                                medformData.objective.internal_examination
                                  .forveal_reflex.os.absent
                              }
                              onChange={() =>
                                setMedformData((prevData) => ({
                                  ...prevData,
                                  objective: {
                                    ...prevData.objective,
                                    internal_examination: {
                                      ...prevData.objective
                                        .internal_examination,
                                      forveal_reflex: {
                                        ...prevData.objective
                                          .internal_examination.forveal_reflex,
                                        os: { present: false, absent: true },
                                      },
                                    },
                                  },
                                }))
                              }
                              className="mr-3 w-6 h-6"
                            />
                            <span className="text-f-gray font-semibold text-p-sm">
                              Absent
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-3 items-center">
                        <div className="flex gap-6 w-2/3">
                          <div className="flex items-center">
                            <input
                              type="radio"
                              name="periphery_od_normal"
                              value="normal"
                              checked={
                                medformData.objective.internal_examination
                                  .periphery.od.normal
                              }
                              onChange={() =>
                                setMedformData((prevData) => ({
                                  ...prevData,
                                  objective: {
                                    ...prevData.objective,
                                    internal_examination: {
                                      ...prevData.objective
                                        .internal_examination,
                                      periphery: {
                                        ...prevData.objective
                                          .internal_examination.periphery,
                                        od: { normal: true, abnormal: false },
                                      },
                                    },
                                  },
                                }))
                              }
                              className="mr-3 w-6 h-6"
                            />
                            <span className="text-f-gray font-semibold text-p-sm">
                              Normal
                            </span>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="radio"
                              name="periphery_od_abnormal"
                              value="abnormal"
                              checked={
                                medformData.objective.internal_examination
                                  .periphery.od.abnormal
                              }
                              onChange={() =>
                                setMedformData((prevData) => ({
                                  ...prevData,
                                  objective: {
                                    ...prevData.objective,
                                    internal_examination: {
                                      ...prevData.objective
                                        .internal_examination,
                                      periphery: {
                                        ...prevData.objective
                                          .internal_examination.periphery,
                                        od: { normal: false, abnormal: true },
                                      },
                                    },
                                  },
                                }))
                              }
                              className="mr-3 w-6 h-6"
                            />
                            <span className="text-f-gray font-semibold text-p-sm">
                              Abnormal
                            </span>
                          </div>
                        </div>
                        <p className="text-p-sm font-medium text-c-secondary text-nowrap text-center w-1/3">
                          Periphery
                        </p>
                        <div className="flex gap-6 w-2/3 justify-end">
                          <div className="flex items-center">
                            <input
                              type="radio"
                              name="periphery_os_normal"
                              value="normal"
                              checked={
                                medformData.objective.internal_examination
                                  .periphery.os.normal
                              }
                              onChange={() =>
                                setMedformData((prevData) => ({
                                  ...prevData,
                                  objective: {
                                    ...prevData.objective,
                                    internal_examination: {
                                      ...prevData.objective
                                        .internal_examination,
                                      periphery: {
                                        ...prevData.objective
                                          .internal_examination.periphery,
                                        os: { normal: true, abnormal: false },
                                      },
                                    },
                                  },
                                }))
                              }
                              className="mr-3 w-6 h-6"
                            />
                            <span className="text-f-gray font-semibold text-p-sm">
                              Normal
                            </span>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="radio"
                              name="periphery_os_abnormal"
                              value="abnormal"
                              checked={
                                medformData.objective.internal_examination
                                  .periphery.os.abnormal
                              }
                              onChange={() =>
                                setMedformData((prevData) => ({
                                  ...prevData,
                                  objective: {
                                    ...prevData.objective,
                                    internal_examination: {
                                      ...prevData.objective
                                        .internal_examination,
                                      periphery: {
                                        ...prevData.objective
                                          .internal_examination.periphery,
                                        os: { normal: false, abnormal: true },
                                      },
                                    },
                                  },
                                }))
                              }
                              className="mr-3 w-6 h-6"
                            />
                            <span className="text-f-gray font-semibold text-p-sm">
                              Abnormal
                            </span>
                          </div>
                        </div>
                      </div>
                    </section>
                    <div className="w-1/5">
                      <header className="bg-bg-sb border border-c-gray3 py-1 font-semibold text-p-sm text-f-gray rounded-t-md flex justify-center">
                        OD
                      </header>
                      <div className="border border-c-gray3 p-5 bg-white rounded-sm">
                        <img
                          src={canvasImages.OS || OS}
                          alt="OS IMG"
                          className="w-full aspect-square"
                          onClick={() => handleImageClick("OS")}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full">
                  <header className="flex justify-center py-2 rounded-t-md w-full border border-f-gray text-c-secondary text-p-rg font-semibold bg-bg-sb mb-2">
                    <h1>External Examination</h1>
                  </header>
                  <div className="p-5 w-full border border-f-gray bg-bg-mc rounded-b-md flex flex-col gap-5">
                    <div className="w-full flex justify-between px-20">
                      <div className="w-1/4">
                        <header className="bg-bg-sb border border-c-gray3 py-1 font-semibold text-p-sm text-f-gray rounded-t-md flex justify-center">
                          OD
                        </header>
                        <div className="border border-c-gray3 p-5 bg-white rounded-b-md">
                          <img
                            src={canvasImages.FRONT || FRONT}
                            alt="FRONT IMG"
                            className="w-full"
                            onClick={() => handleImageClick("FRONT")}
                          />
                        </div>
                      </div>
                      <div className="w-1/4">
                        <header className="bg-bg-sb border border-c-gray3 py-1 font-semibold text-p-sm text-f-gray rounded-t-md flex justify-center">
                          OS
                        </header>
                        <div className="border border-c-gray3 p-5 bg-white rounded-b-md">
                          <img
                            src={canvasImages.FRONT || FRONT}
                            alt="FRONT IMG"
                            className="w-full"
                            onClick={() => handleImageClick("FRONT")}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center w-full">
                      <div className="border border-f-gray rounded-md bg-white p-5 w-2/3">
                        <div className="flex justify-between">
                          <div className="flex flex-col gap-3">
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="eyebrow_od_inflamation"
                                value="Inflammation"
                                checked={
                                  medformData.objective.external_examination
                                    .eyebrow.od.options.inflamation
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "objective.external_examination.eyebrow.od.options.inflamation"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-c-gray3 font-medium text-p-sm">
                                Inflammation
                              </span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="eyebrow_od_crust_formation"
                                value="Crust formation"
                                checked={
                                  medformData.objective.external_examination
                                    .eyebrow.od.options.crust_formation
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "objective.external_examination.eyebrow.od.options.crust_formation"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-c-gray3 font-medium text-p-sm">
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
                                  medformData.objective.external_examination
                                    .eyebrow.od.options.dandruff
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "objective.external_examination.eyebrow.od.options.dandruff"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-c-gray3 font-medium text-p-sm">
                                Dandruff
                              </span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="eyebrow_od_foreign_body"
                                value="Foreign Bodies"
                                checked={
                                  medformData.objective.external_examination
                                    .eyebrow.od.options.foreign_body
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "objective.external_examination.eyebrow.od.options.foreign_body"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-c-gray3 font-medium text-p-sm">
                                Foreign Bodies
                              </span>
                            </label>
                          </div>
                        </div>
                        <input
                          type="text"
                          name="eyebrow_od_additional_note"
                          value={
                            medformData.objective.external_examination.eyebrow
                              .od.additional_note
                          }
                          onChange={(e) =>
                            handleChange(
                              e,
                              "objective.external_examination.eyebrow.od.additional_note"
                            )
                          }
                          className="mt-3 w-full p-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                        />
                      </div>
                      <p className="text-p-sm font-medium text-c-secondary text-nowrap text-center w-1/3">
                        Eyebrows
                      </p>
                      <div className="border border-f-gray rounded-md bg-white p-5 w-2/3">
                        <div className="flex justify-between">
                          <div className="flex flex-col gap-3">
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="eyebrow_os_inflamation"
                                value="Inflammation"
                                checked={
                                  medformData.objective.external_examination
                                    .eyebrow.os.options.inflamation
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "objective.external_examination.eyebrow.os.options.inflamation"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-c-gray3 font-medium text-p-sm">
                                Inflammation
                              </span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="eyebrow_os_crust_formation"
                                value="Crust formation"
                                checked={
                                  medformData.objective.external_examination
                                    .eyebrow.os.options.crust_formation
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "objective.external_examination.eyebrow.os.options.crust_formation"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-c-gray3 font-medium text-p-sm">
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
                                  medformData.objective.external_examination
                                    .eyebrow.os.options.dandruff
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "objective.external_examination.eyebrow.os.options.dandruff"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-c-gray3 font-medium text-p-sm">
                                Dandruff
                              </span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="eyebrow_os_foreign_body"
                                value="Foreign Bodies"
                                checked={
                                  medformData.objective.external_examination
                                    .eyebrow.os.options.foreign_body
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "objective.external_examination.eyebrow.os.options.foreign_body"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-c-gray3 font-medium text-p-sm">
                                Foreign Bodies
                              </span>
                            </label>
                          </div>
                        </div>
                        <input
                          type="text"
                          name="eyebrow_os_additional_note"
                          value={
                            medformData.objective.external_examination.eyebrow
                              .os.additional_note
                          }
                          onChange={(e) =>
                            handleChange(
                              e,
                              "objective.external_examination.eyebrow.os.additional_note"
                            )
                          }
                          className="mt-3 w-full p-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                        />
                      </div>
                    </div>
                    <div className="flex justify-between items-center w-full">
                      <div className="border border-f-gray rounded-md bg-white p-5 w-2/3">
                        <div className="flex justify-between">
                          <div className="flex flex-col gap-3">
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="eyelashes_od_crusting"
                                value="Crusting"
                                checked={
                                  medformData.objective.external_examination
                                    .eyelashes.od.options.crusting
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "objective.external_examination.eyelashes.od.options.crusting"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-c-gray3 font-medium text-p-sm">
                                Crusting
                              </span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="eyelashes_od_discharge"
                                value="Discharge"
                                checked={
                                  medformData.objective.external_examination
                                    .eyelashes.od.options.discharge
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "objective.external_examination.eyelashes.od.options.discharge"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-c-gray3 font-medium text-p-sm">
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
                                  medformData.objective.external_examination
                                    .eyelashes.od.options.eyelash_lice
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "objective.external_examination.eyelashes.od.options.eyelash_lice"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-c-gray3 font-medium text-p-sm">
                                Eyelash Lice
                              </span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="eyelashes_od_foreign_body"
                                value="Foreign Bodies"
                                checked={
                                  medformData.objective.external_examination
                                    .eyelashes.od.options.foreign_body
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "objective.external_examination.eyelashes.od.options.foreign_body"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-c-gray3 font-medium text-p-sm">
                                Foreign Bodies
                              </span>
                            </label>
                          </div>
                        </div>
                        <input
                          type="text"
                          name="eyelashes_additional_note"
                          value={
                            medformData.objective.external_examination.eyelashes
                              .od.additional_note
                          }
                          onChange={(e) =>
                            handleChange(
                              e,
                              "objective.external_examination.eyelashes.od.additional_note"
                            )
                          }
                          className="mt-3 w-full p-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                        />
                      </div>
                      <p className="text-p-sm font-medium text-c-secondary text-nowrap text-center w-1/3">
                        Eyelashes
                      </p>
                      <div className="border border-f-gray rounded-md bg-white p-5 w-2/3">
                        <div className="flex justify-between">
                          <div className="flex flex-col gap-3">
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="eyelashes_os_crusting"
                                value="Crusting"
                                checked={
                                  medformData.objective.external_examination
                                    .eyelashes.os.options.crusting
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "objective.external_examination.eyelashes.os.options.crusting"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-c-gray3 font-medium text-p-sm">
                                Crusting
                              </span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="eyelashes_os_discharge"
                                value="Discharge"
                                checked={
                                  medformData.objective.external_examination
                                    .eyelashes.os.options.discharge
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "objective.external_examination.eyelashes.os.options.discharge"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-c-gray3 font-medium text-p-sm">
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
                                  medformData.objective.external_examination
                                    .eyelashes.os.options.eyelash_lice
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "objective.external_examination.eyelashes.os.options.eyelash_lice"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-c-gray3 font-medium text-p-sm">
                                Eyelash Lice
                              </span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="eyelashes_os_foreign_body"
                                value="Foreign Bodies"
                                checked={
                                  medformData.objective.external_examination
                                    .eyelashes.os.options.foreign_body
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "objective.external_examination.eyelashes.os.options.foreign_body"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-c-gray3 font-medium text-p-sm">
                                Foreign Bodies
                              </span>
                            </label>
                          </div>
                        </div>
                        <input
                          type="text"
                          name="eyelashes_additional_note"
                          value={
                            medformData.objective.external_examination.eyelashes
                              .os.additional_note
                          }
                          onChange={(e) =>
                            handleChange(
                              e,
                              "objective.external_examination.eyelashes.os.additional_note"
                            )
                          }
                          className="mt-3 w-full p-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                        />
                      </div>
                    </div>
                    <div className="flex justify-between items-center w-full">
                      <div className="border border-f-gray rounded-md bg-white p-5 w-2/3">
                        <div className="flex justify-between">
                          <div className="flex flex-col gap-3">
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="eyelids_od_blepharitis"
                                value="Blepharitis"
                                checked={
                                  medformData.objective.external_examination
                                    .eyelids.od.options.blepharitis
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "objective.external_examination.eyelids.od.options.blepharitis"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-c-gray3 font-medium text-p-sm">
                                Blepharitis
                              </span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="eyelids_od_edema"
                                value="Edema"
                                checked={
                                  medformData.objective.external_examination
                                    .eyelids.od.options.edema
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "objective.external_examination.eyelids.od.options.edema"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-c-gray3 font-medium text-p-sm">
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
                                  medformData.objective.external_examination
                                    .eyelids.od.options.chalazion
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "objective.external_examination.eyelids.od.options.chalazion"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-c-gray3 font-medium text-p-sm">
                                Chalazion
                              </span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="eyelids_od_style"
                                value="Stye(hordeolum)"
                                checked={
                                  medformData.objective.external_examination
                                    .eyelids.od.options.stye
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "objective.external_examination.eyelids.od.options.stye"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-c-gray3 font-medium text-p-sm">
                                Stye(hordeolum)
                              </span>
                            </label>
                          </div>
                        </div>
                        <input
                          type="text"
                          name="eyelids_od_additional_note"
                          value={
                            medformData.objective.external_examination.eyelids
                              .od.additional_note
                          }
                          onChange={(e) =>
                            handleChange(
                              e,
                              "objective.external_examination.eyelids.od.additional_note"
                            )
                          }
                          className="mt-3 w-full p-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                        />
                      </div>
                      <p className="text-p-sm font-medium text-c-secondary text-nowrap text-center w-1/3">
                        Eye Lids
                      </p>
                      <div className="border border-f-gray rounded-md bg-white p-5 w-2/3">
                        <div className="flex justify-between">
                          <div className="flex flex-col gap-3">
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="eyelids_os_blepharitis"
                                value="Blepharitis"
                                checked={
                                  medformData.objective.external_examination
                                    .eyelids.os.options.blepharitis
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "objective.external_examination.eyelids.os.options.blepharitis"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-c-gray3 font-medium text-p-sm">
                                Blepharitis
                              </span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="eyelids_os_edema"
                                value="Edema"
                                checked={
                                  medformData.objective.external_examination
                                    .eyelids.os.options.edema
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "objective.external_examination.eyelids.os.options.edema"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-c-gray3 font-medium text-p-sm">
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
                                  medformData.objective.external_examination
                                    .eyelids.os.options.chalazion
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "objective.external_examination.eyelids.os.options.chalazion"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-c-gray3 font-medium text-p-sm">
                                Chalazion
                              </span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="eyelids_os_style"
                                value="Stye(hordeolum)"
                                checked={
                                  medformData.objective.external_examination
                                    .eyelids.os.options.stye
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "objective.external_examination.eyelids.os.options.stye"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-c-gray3 font-medium text-p-sm">
                                Stye(hordeolum)
                              </span>
                            </label>
                          </div>
                        </div>
                        <input
                          type="text"
                          name="eyelids_os_additional_note"
                          value={
                            medformData.objective.external_examination.eyelids
                              .os.additional_note
                          }
                          onChange={(e) =>
                            handleChange(
                              e,
                              "objective.external_examination.eyelids.os.additional_note"
                            )
                          }
                          className="mt-3 w-full p-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                        />
                      </div>
                    </div>
                    <div className="flex justify-between items-center w-full">
                      <div className="border border-f-gray rounded-md bg-white p-5 w-2/3">
                        <div className="flex justify-between">
                          <div className="flex flex-col gap-3">
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="cornea_od_ca"
                                value="Corneal abrasion"
                                checked={
                                  medformData.objective.external_examination
                                    .cornea.od.options.corneal_abrasion
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "objective.external_examination.cornea.od.options.corneal_abrasion"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-c-gray3 font-medium text-p-sm">
                                Corneal abrasion
                              </span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="cornea_od_keratis"
                                value="Keratitis"
                                checked={
                                  medformData.objective.external_examination
                                    .cornea.od.options.keratitis
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "objective.external_examination.cornea.od.options.keratitis"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-c-gray3 font-medium text-p-sm">
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
                                  medformData.objective.external_examination
                                    .cornea.od.options.pterygium
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "objective.external_examination.cornea.od.options.pterygium"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-c-gray3 font-medium text-p-sm">
                                Pterygium
                              </span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="cornea_od_cs"
                                value="Corneal Scar"
                                checked={
                                  medformData.objective.external_examination
                                    .cornea.od.options.corneal_scar
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "objective.external_examination.cornea.od.options.corneal_scar"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-c-gray3 font-medium text-p-sm">
                                Corneal Scar
                              </span>
                            </label>
                          </div>
                        </div>
                        <input
                          type="text"
                          name="cornea_od_additional_note"
                          value={
                            medformData.objective.external_examination.cornea.od
                              .additional_note
                          }
                          onChange={(e) =>
                            handleChange(
                              e,
                              "objective.external_examination.cornea.od.additional_note"
                            )
                          }
                          className="mt-3 w-full p-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                        />
                      </div>
                      <p className="text-p-sm font-medium text-c-secondary text-nowrap text-center w-1/3">
                        Cornea
                      </p>
                      <div className="border border-f-gray rounded-md bg-white p-5 w-2/3">
                        <div className="flex justify-between">
                          <div className="flex flex-col gap-3">
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="cornea_os_ca"
                                value="Corneal abrasion"
                                checked={
                                  medformData.objective.external_examination
                                    .cornea.os.options.corneal_abrasion
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "objective.external_examination.cornea.os.options.corneal_abrasion"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-c-gray3 font-medium text-p-sm">
                                Corneal abrasion
                              </span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="cornea_os_keratis"
                                value="Keratitis"
                                checked={
                                  medformData.objective.external_examination
                                    .cornea.os.options.keratitis
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "objective.external_examination.cornea.os.options.keratitis"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-c-gray3 font-medium text-p-sm">
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
                                  medformData.objective.external_examination
                                    .cornea.os.options.pterygium
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "objective.external_examination.cornea.os.options.pterygium"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-c-gray3 font-medium text-p-sm">
                                Pterygium
                              </span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="cornea_os_cs"
                                value="Corneal Scar"
                                checked={
                                  medformData.objective.external_examination
                                    .cornea.os.options.corneal_scar
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "objective.external_examination.cornea.os.options.corneal_scar"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-c-gray3 font-medium text-p-sm">
                                Corneal Scar
                              </span>
                            </label>
                          </div>
                        </div>
                        <input
                          type="text"
                          name="objective.cornea_os_additional_note"
                          value={
                            medformData.objective.external_examination.cornea.os
                              .additional_note
                          }
                          onChange={(e) =>
                            handleChange(
                              e,
                              "objective.external_examination.cornea.os.additional_note"
                            )
                          }
                          className="mt-3 w-full p-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                        />
                      </div>
                    </div>
                    <div className="flex justify-between items-center w-full">
                      <div className="border border-f-gray rounded-md bg-white p-5 w-2/3">
                        <div className="flex justify-between">
                          <div className="flex flex-col gap-3">
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="limbus_od_pinguecula"
                                value="Pinguecula"
                                checked={
                                  medformData.objective.external_examination
                                    .limbus.od.options.pinguecula
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "objective.external_examination.limbus.od.options.pinguecula"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-c-gray3 font-medium text-p-sm">
                                Pinguecula
                              </span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="limbus_od_melanosis"
                                value="Melanosis"
                                checked={
                                  medformData.objective.external_examination
                                    .limbus.od.options.melanosis
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "objective.external_examination.limbus.od.options.melanosis"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-c-gray3 font-medium text-p-sm">
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
                                  medformData.objective.external_examination
                                    .limbus.od.options.scarring
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "objective.external_examination.limbus.od.options.scarring"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-c-gray3 font-medium text-p-sm">
                                Scarring
                              </span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="limbus_od_foreign_debri"
                                value="Foreign debris"
                                checked={
                                  medformData.objective.external_examination
                                    .limbus.od.options.foreign_debris
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "objective.external_examination.limbus.od.options.foreign_debris"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-c-gray3 font-medium text-p-sm">
                                Foreign debris
                              </span>
                            </label>
                          </div>
                        </div>
                        <input
                          type="text"
                          name="limbus_od_additional_note"
                          value={
                            medformData.objective.external_examination.limbus.od
                              .additional_note
                          }
                          onChange={(e) =>
                            handleChange(
                              e,
                              "objective.external_examination.limbus.od.additional_note"
                            )
                          }
                          className="mt-3 w-full p-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                        />
                      </div>
                      <p className="text-p-sm font-medium text-c-secondary text-nowrap text-center w-1/3">
                        Limbus
                      </p>
                      <div className="border border-f-gray rounded-md bg-white p-5 w-2/3">
                        <div className="flex justify-between">
                          <div className="flex flex-col gap-3">
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="limbus_os_pinguecula"
                                value="Pinguecula"
                                checked={
                                  medformData.objective.external_examination
                                    .limbus.os.options.pinguecula
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "objective.external_examination.limbus.os.options.pinguecula"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-c-gray3 font-medium text-p-sm">
                                Pinguecula
                              </span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="limbus_os_melanosis"
                                value="Melanosis"
                                checked={
                                  medformData.objective.external_examination
                                    .limbus.os.options.melanosis
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "objective.external_examination.limbus.os.options.melanosis"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-c-gray3 font-medium text-p-sm">
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
                                  medformData.objective.external_examination
                                    .limbus.os.options.scarring
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "objective.external_examination.limbus.os.options.scarring"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-c-gray3 font-medium text-p-sm">
                                Scarring
                              </span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="limbus_os_foreign_debri"
                                value="Foreign debris"
                                checked={
                                  medformData.objective.external_examination
                                    .limbus.os.options.foreign_debris
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "objective.external_examination.limbus.os.options.foreign_debris"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-c-gray3 font-medium text-p-sm">
                                Foreign debris
                              </span>
                            </label>
                          </div>
                        </div>
                        <input
                          type="text"
                          name="limbus_os_additional_note"
                          value={
                            medformData.objective.external_examination.limbus.os
                              .additional_note
                          }
                          onChange={(e) =>
                            handleChange(
                              e,
                              "objective.external_examination.limbus.os.additional_note"
                            )
                          }
                          className="mt-3 w-full p-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                        />
                      </div>
                    </div>
                    <div className="flex justify-between items-center w-full">
                      <div className="border border-f-gray rounded-md bg-white p-5 w-2/3">
                        <div className="flex justify-between">
                          <div className="flex flex-col gap-3">
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="pupil_od_miosis"
                                value="Miosis or mydriasis"
                                checked={
                                  medformData.objective.external_examination
                                    .pupil.od.options.miosis_or_mydriasis
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "objective.external_examination.pupil.od.options.miosis_or_mydriasis"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-c-gray3 font-medium text-p-sm">
                                Miosis or mydriasis
                              </span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="pupil_od_IIS"
                                value="Inflammation-induced synechiae"
                                checked={
                                  medformData.objective.external_examination
                                    .pupil.od.options.IIS
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "objective.external_examination.pupil.od.options.IIS"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-c-gray3 font-medium text-p-sm">
                                Inflammation-induced synechiae
                              </span>
                            </label>
                          </div>
                          <div className="flex flex-col gap-3">
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="pupil_od_distortion"
                                value="Pupil distortion"
                                checked={
                                  medformData.objective.external_examination
                                    .pupil.od.options.pupil_distortion
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "objective.external_examination.pupil.od.options.pupil_distortion"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-c-gray3 font-medium text-p-sm">
                                Pupil distortion
                              </span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="pupil_od_LRA"
                                value="Light reflex abnormalities"
                                checked={
                                  medformData.objective.external_examination
                                    .pupil.od.options.LRA
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "objective.external_examination.pupil.od.options.LRA"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-c-gray3 font-medium text-p-sm">
                                Light reflex abnormalities
                              </span>
                            </label>
                          </div>
                        </div>
                        <input
                          type="text"
                          name="pupil_od_additional_note"
                          value={
                            medformData.objective.external_examination.pupil.od
                              .additional_note
                          }
                          onChange={(e) =>
                            handleChange(
                              e,
                              "objective.external_examination.pupil.od.additional_note"
                            )
                          }
                          className="mt-3 w-full p-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                        />
                      </div>
                      <p className="text-p-sm font-medium text-c-secondary text-nowrap text-center w-1/3">
                        Pupil
                      </p>
                      <div className="border border-f-gray rounded-md bg-white p-5 w-2/3">
                        <div className="flex justify-between">
                          <div className="flex flex-col gap-3">
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="pupil_os_miosis"
                                value="Miosis or mydriasis"
                                checked={
                                  medformData.objective.external_examination
                                    .pupil.os.options.miosis_or_mydriasis
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "objective.external_examination.pupil.os.options.miosis_or_mydriasis"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-c-gray3 font-medium text-p-sm">
                                Miosis or mydriasis
                              </span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="pupil_os_IIS"
                                value="Inflammation-induced synechiae"
                                checked={
                                  medformData.objective.external_examination
                                    .pupil.os.options.IIS
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "objective.external_examination.pupil.os.options.IIS"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-c-gray3 font-medium text-p-sm">
                                Inflammation-induced synechiae
                              </span>
                            </label>
                          </div>
                          <div className="flex flex-col gap-3">
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="pupil_os_distortion"
                                value="Pupil distortion"
                                checked={
                                  medformData.objective.external_examination
                                    .pupil.os.options.pupil_distortion
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "objective.external_examination.pupil.os.options.pupil_distortion"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-c-gray3 font-medium text-p-sm">
                                Pupil distortion
                              </span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="pupil_os_LRA"
                                value="Light reflex abnormalities"
                                checked={
                                  medformData.objective.external_examination
                                    .pupil.os.options.LRA
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "objective.external_examination.pupil.os.options.LRA"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-c-gray3 font-medium text-p-sm">
                                Light reflex abnormalities
                              </span>
                            </label>
                          </div>
                        </div>
                        <input
                          type="text"
                          name="pupil_os_additional_note"
                          value={
                            medformData.objective.external_examination.pupil.os
                              .additional_note
                          }
                          onChange={(e) =>
                            handleChange(
                              e,
                              "objective.external_examination.pupil.os.additional_note"
                            )
                          }
                          className="mt-3 w-full p-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                        />
                      </div>
                    </div>
                    <div className="flex justify-between items-center w-full">
                      <div className="border border-f-gray rounded-md bg-white p-5 w-2/3">
                        <div className="flex justify-between">
                          <div className="flex flex-col gap-3">
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="iris_od_iris_neovascularization"
                                value="Iris neovascularization"
                                checked={
                                  medformData.objective.external_examination
                                    .iris.od.options.iris_neovascularization
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "objective.external_examination.iris.od.options.iris_neovascularization"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-c-gray3 font-medium text-p-sm">
                                Iris neovascularization
                              </span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="iris_od_posterior_synechiae"
                                value="Posterior synechiae"
                                checked={
                                  medformData.objective.external_examination
                                    .iris.od.options.posterior_synechiae
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "objective.external_examination.iris.od.options.posterior_synechiae"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-c-gray3 font-medium text-p-sm">
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
                                  medformData.objective.external_examination
                                    .iris.od.options.hyphema
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "objective.external_examination.iris.od.options.hyphema"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-c-gray3 font-medium text-p-sm">
                                Hyphema
                              </span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="iris_od_inflammatory_deposit"
                                value="Inflammatory deposits"
                                checked={
                                  medformData.objective.external_examination
                                    .iris.od.options.inflammatory_deposit
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "objective.external_examination.iris.od.options.inflammatory_deposit"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-c-gray3 font-medium text-p-sm">
                                Inflammatory deposits
                              </span>
                            </label>
                          </div>
                        </div>
                        <input
                          type="text"
                          name="iris_od_additional_note"
                          value={
                            medformData.objective.external_examination.iris.od
                              .additional_note
                          }
                          onChange={(e) =>
                            handleChange(
                              e,
                              "objective.external_examination.iris.od.additional_note"
                            )
                          }
                          className="mt-3 w-full p-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                        />
                      </div>
                      <p className="text-p-sm font-medium text-c-secondary text-nowrap text-center w-1/3">
                        Iris
                      </p>
                      <div className="border border-f-gray rounded-md bg-white p-5 w-2/3">
                        <div className="flex justify-between">
                          <div className="flex flex-col gap-3">
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="iris_os_iris_neovascularization"
                                value="Iris neovascularization"
                                checked={
                                  medformData.objective.external_examination
                                    .iris.os.options.iris_neovascularization
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "objective.external_examination.iris.os.options.iris_neovascularization"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-c-gray3 font-medium text-p-sm">
                                Iris neovascularization
                              </span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="iris_os_posterior_synechiae"
                                value="Posterior synechiae"
                                checked={
                                  medformData.objective.external_examination
                                    .iris.os.options.posterior_synechiae
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "objective.external_examination.iris.os.options.posterior_synechiae"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-c-gray3 font-medium text-p-sm">
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
                                  medformData.objective.external_examination
                                    .iris.os.options.hyphema
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "objective.external_examination.iris.os.options.hyphema"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-c-gray3 font-medium text-p-sm">
                                Hyphema
                              </span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="iris_os_inflammatory_deposit"
                                value="Inflammatory deposits"
                                checked={
                                  medformData.objective.external_examination
                                    .iris.os.options.inflammatory_deposit
                                }
                                onChange={(e) =>
                                  handleChange(
                                    e,
                                    "objective.external_examination.iris.os.options.inflammatory_deposit"
                                  )
                                }
                                className="w-6 h-6"
                              />
                              <span className="text-c-gray3 font-medium text-p-sm">
                                Inflammatory deposits
                              </span>
                            </label>
                          </div>
                        </div>
                        <input
                          type="text"
                          name="iris_os_additional_note"
                          value={
                            medformData.objective.external_examination.iris.os
                              .additional_note
                          }
                          onChange={(e) =>
                            handleChange(
                              e,
                              "objective.external_examination.iris.os.additional_note"
                            )
                          }
                          className="mt-3 w-full p-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full">
                  <header className="flex justify-center py-2 rounded-t-md w-full border border-f-gray text-c-secondary text-p-rg font-semibold bg-bg-sb mb-2">
                    <h1>Prescription</h1>
                  </header>
                  <div className="flex gap-2">
                    <div className="border border-f-gray bg-bg-mc w-1/2 rounded-br-md p-5">
                      <section className="flex justify-between">
                        <label className="text-p-rg font-semibold text-c-secondary">
                          | Habitual Prescription
                        </label>
                        <label>
                          <p className="text-c-gray3 font-medium text-p-sm">
                            Date Prescribe
                          </p>
                          <input
                            type="date"
                            name="hp_date"
                            max={new Date().toISOString().split("T")[0]}
                            value={
                              medformData.objective.habitual_prescription
                                .date_prescribed
                            }
                            onChange={(e) =>
                              handleChange(
                                e,
                                "objective.habitual_prescription.date_prescribed"
                              )
                            }
                            className="mt-1 w-fit h-fit px-4 py-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                          />
                        </label>
                      </section>
                      <section className="text-p-sm font-semibold mt-5 flex gap-3">
                        <div className="flex flex-col w-full">
                          <p className="text-p-sm font-medium text-f-gray">
                            OD
                          </p>
                          <textarea
                            type="text"
                            name="hp_od"
                            value={
                              medformData.objective.habitual_prescription.od
                            }
                            onChange={(e) =>
                              handleChange(
                                e,
                                "objective.habitual_prescription.od"
                              )
                            }
                            className="mt-3 h-32 w-full px-4 py-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                            placeholder=""
                          />
                        </div>
                        <div className="flex flex-col w-full">
                          <p className="text-p-sm font-medium text-f-gray">
                            OS
                          </p>
                          <textarea
                            type="text"
                            name="hp_os"
                            value={
                              medformData.objective.habitual_prescription.os
                            }
                            onChange={(e) =>
                              handleChange(
                                e,
                                "objective.habitual_prescription.os"
                              )
                            }
                            className="mt-3 h-32 w-full px-4 py-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                            placeholder=""
                          />
                        </div>
                      </section>
                    </div>
                    <div className="border border-f-gray bg-bg-mc w-1/2 rounded-br-md p-5">
                      <section className="flex justify-between">
                        <label className="text-p-rg font-semibold text-c-secondary">
                          | Contact Lens Prescrition
                        </label>
                        <label>
                          <p className="text-c-gray3 font-medium text-p-sm">
                            Date Prescribe
                          </p>
                          <input
                            type="date"
                            name="clp_date"
                            max={new Date().toISOString().split("T")[0]}
                            value={
                              medformData.objective.contact_lens_prescription
                                .date_prescribed
                            }
                            onChange={(e) =>
                              handleChange(
                                e,
                                "objective.contact_lens_prescription.date_prescribed"
                              )
                            }
                            className="mt-1 w-fit h-fit px-4 py-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                          />
                        </label>
                      </section>
                      <section className="text-p-sm font-semibold mt-5 flex gap-3">
                        <div className="flex flex-col w-full">
                          <p className="text-p-sm font-medium text-f-gray">
                            OD
                          </p>
                          <textarea
                            type="text"
                            name="clp_od"
                            value={
                              medformData.objective.contact_lens_prescription.od
                            }
                            onChange={(e) =>
                              handleChange(
                                e,
                                "objective.contact_lens_prescription.od"
                              )
                            }
                            className="mt-3 h-32 w-full px-4 py-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                            placeholder=""
                          />
                        </div>
                        <div className="flex flex-col w-full">
                          <p className="text-p-sm font-medium text-f-gray">
                            OS
                          </p>
                          <textarea
                            type="text"
                            name="clp_os"
                            value={
                              medformData.objective.contact_lens_prescription.os
                            }
                            onChange={(e) =>
                              handleChange(
                                e,
                                "objective.contact_lens_prescription.os"
                              )
                            }
                            className="mt-3 h-32 w-full px-4 py-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                            placeholder=""
                          />
                        </div>
                      </section>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {currentPage === 2 && (
              <div className="p-5 flex gap-5">
                <div className="border border-f-gray p-5 bg-bg-mc rounded-md w-1/2">
                  <label className="text-p-rg font-semibold text-c-secondary">
                    | Diagnosis
                  </label>
                  <textarea
                    type="text"
                    name="diagnosis"
                    value={medformData.assessment.diagnosis}
                    onChange={(e) => handleChange(e, "assessment.diagnosis")}
                    className="mt-5 h-60 w-full px-4 py-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                    placeholder="If option not available"
                  />
                </div>
                <div className="border border-f-gray p-5 bg-bg-mc rounded-md w-1/2">
                  <label className="text-p-rg font-semibold text-c-secondary">
                    | Refractive Error
                  </label>
                  <textarea
                    type="text"
                    name="refractive_error"
                    value={medformData.assessment.refractive_error}
                    onChange={(e) =>
                      handleChange(e, "assessment.refractive_error")
                    }
                    className="mt-5 h-60 w-full px-4 py-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                    placeholder="If option not available"
                  />
                </div>
              </div>
            )}
            {currentPage === 3 && (
              <div className="p-5 flex flex-col gap-5">
                <div className="flex gap-5">
                  <div className="border border-f-gray p-5 bg-bg-mc rounded-md w-1/2">
                    <label className="text-p-rg font-semibold text-c-secondary">
                      | New Prescription OD
                    </label>
                    <textarea
                      type="text"
                      name="new_prescription_od"
                      value={medformData.plan.new_prescription_od}
                      onChange={(e) =>
                        handleChange(e, "plan.new_prescription_od")
                      }
                      className="mt-5 h-60 w-full px-4 py-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                      placeholder="If option not available"
                    />
                  </div>
                  <div className="border border-f-gray p-5 bg-bg-mc rounded-md w-1/2">
                    <label className="text-p-rg font-semibold text-c-secondary">
                      | New Prescription OS
                    </label>
                    <textarea
                      type="text"
                      name="new_prescription_os"
                      value={medformData.plan.new_prescription_os}
                      onChange={(e) =>
                        handleChange(e, "plan.new_prescription_os")
                      }
                      className="mt-5 h-60 w-full px-4 py-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                      placeholder="If option not available"
                    />
                  </div>
                </div>
                <div className="flex gap-5">
                  <div className="border border-f-gray p-5 bg-bg-mc rounded-md w-1/2">
                    <label className="text-p-rg font-semibold text-c-secondary">
                      | Management
                    </label>
                    <textarea
                      type="text"
                      name="management"
                      value={medformData.plan.management}
                      onChange={(e) => handleChange(e, "plan.management")}
                      className="mt-5 h-60 w-full px-4 py-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                      placeholder="If option not available"
                    />
                  </div>
                  <div className="border border-f-gray p-5 bg-bg-mc rounded-md w-1/2">
                    <label className="text-p-rg font-semibold text-c-secondary">
                      | Follow-up Care
                    </label>
                    <textarea
                      type="text"
                      name="followup_care"
                      value={medformData.plan.followup_care}
                      onChange={(e) => handleChange(e, "plan.followup_care")}
                      className="mt-5 h-60 w-full px-4 py-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                      placeholder="If option not available"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
          {currentPage === 3 ? (
            <button
              className="py-4 rounded-md bg-c-primary font-semibold text-p-rg text-f-light w-full mt-5"
              onClick={handleSubmitNote}
            >
              Dito muna submit button
            </button>
          ) : (
            <div className="flex gap-4 justify-end">
              {currentPage !== 0 && (
                <button
                  className="py-3 rounded-md border-c-gray3 border-2  font-semibold text-p-rg text-f-dark w-32 mt-5"
                  onClick={handleBackPage}
                >
                  Back
                </button>
              )}
              <button
                className="py-3 rounded-md bg-c-secondary font-semibold text-p-rg text-f-light w-44  mt-5"
                onClick={handleNext}
              >
                Next
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
        onClose={() => setIsSuccess(false)}
        title="Patient Note Added Successfully"
        description="The patient note has been successfully added to the records."
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
