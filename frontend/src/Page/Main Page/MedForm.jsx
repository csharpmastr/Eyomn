import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AiOutlineArrowLeft } from "react-icons/ai";
import EyeSketch from "../../Component/ui/EyeSketch";
import OD from "../../assets/Image/OD.png";
import OS from "../../assets/Image/OS.png";
import CROSS from "../../assets/Image/CROSS.png";
import BLANK from "../../assets/Image/BLANK.png";
import FRONT from "../../assets/Image/FRONT.png";

const MedForm = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isCanvasOpen, setIsCanvasOpen] = useState(false);
  const [selectedBG, setSelectedBG] = useState("OD");
  const [canvasImages, setCanvasImages] = useState({
    OD: "",
    OS: "",
    CROSS: "",
    BLANK: "",
    FRONT: "",
  });

  const [medformData, setMedformData] = useState({
    //p1
    initial_observation: "",
    chief_complaints: "",

    occular_history: {
      description: "",
      last_exam: "",
    },
    gen_health_hx: {
      description: "",
      last_exam: "",
    },
    bp: "",
    bg: "",
    hr: "",
    o2_saturation: "",
    temperature: "",

    //p2
    habitual_va: {
      od: "",
      os: "",
      ou: "",
    },
    unaided_va: {
      od: "",
      os: "",
      ou: "",
    },
    pinhole_va: {
      od: "",
      os: "",
      ou: "",
    },
    habitual_prescription: {
      date_prescribed: "",
      od: "",
      os: "",
      ou: "",
    },
    pupillary_distance: {
      od: "",
      os: "",
      ou: "",
    },
    cover_test: {
      od: {
        with_rx_distance: false,
        with_rx_near: false,
        without_rx_distance: false,
        without_rx_near: false,
      },
      os: {
        with_rx_distance: false,
        with_rx_near: false,
        without_rx_distance: false,
        without_rx_near: false,
      },
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
    },
    diplopia_test: {
      left: false,
      right: false,
    },

    //p3
    pupil_reaction: {
      perrla: "",
      comment: "",
    },
    internal_examination: {
      cup_disc_ratio: {
        od: "",
        os: "",
      },
      vessel: {
        od: "",
        os: "",
      },
      foveal_reflex: {
        od: "",
        os: "",
      },
      macula: "",
      vitreous: "",
      periphery: "",
    },
    external_examination: {
      lids_lashes: {
        od: "",
        os: "",
      },
      bulbar_conjunctiva: {
        od: "",
        os: "",
      },
      palpebral_conjunctiva: {
        od: "",
        os: "",
      },
      cornea: {
        od: "",
        os: "",
      },
      anterior_chamber: {
        od: "",
        os: "",
      },
      iris: {
        od: "",
        os: "",
      },
      lens: {
        od: "",
        os: "",
      },
    },

    ///p4
    objective_refraction: {
      static_retinoscopy: {
        od: "",
        os: "",
      },
      automated_refraction: {
        od: "",
        os: "",
      },
      cup_disc_ratio: {
        od: "",
        os: "",
        ou: "",
      },
    },
    subjective_refraction: {
      near_add: {
        od: "",
        os: "",
        ou: "",
      },
      total_near_correction: {
        od: "",
        os: "",
        ou: "",
      },
    },

    //p5
    visual_field_stereopsis_test: {
      confrontation_test: {
        od: "",
        os: "",
      },
      facial_amsler: {
        od: "",
        os: "",
      },
      stereopsis: "",
    },
    additional_note: "",
  });

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

  const { patiendId } = useParams();

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
  };

  const handleSubmit = () => {
    console.log(medformData);
    console.log(patiendId);
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

  return (
    <div className="w-full p-4 md:p-6 xl:p-8 bg-bg-mc">
      <header className="text-f-dark flex justify-between mb-6">
        <div className="flex gap-2 font-semibold">
          <AiOutlineArrowLeft />
          <div>
            <p className="text-p-sm">Patient Case Record</p>
            <h1>Marc Albert Bautista</h1>
          </div>
        </div>
        <nav className="flex gap-1">
          {["Subjective", "Objective", "Assessment", "Plan"].map((med_page) => (
            <div
              key={med_page}
              className={`w-fit pl-2 py-2  cursor-pointer ${
                currentPage === med_page
                  ? " border-b-2 border-c-primary font-semibold text-c-primary"
                  : " border-b-2 border-f-gray font-medium text-c-gray3"
              }`}
            >
              <p>{med_page}</p>
            </div>
          ))}
        </nav>
      </header>
      <form>
        <div className="w-full bg-white border border-f-gray rounded-lg">
          <header className=" bg-bg-sb border border-b-f-gray flex justify-center items-center h-14 font-semibold text-p-lg text-c-secondary">
            <h1>Medical Form ({currentPage})</h1>
          </header>
          {currentPage === "Subjective" && (
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
                          // checked={}
                          // onChange={}
                          className="w-6 h-6"
                        />
                        <span className="text-c-gray3 font-medium text-p-sm">
                          Headache
                        </span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          // checked={}
                          // onChange={}
                          className="w-6 h-6"
                        />
                        <span className="text-c-gray3 font-medium text-p-sm">
                          BOV
                        </span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          // checked={}
                          // onChange={}
                          className="w-6 h-6"
                        />
                        <span className="text-c-gray3 font-medium text-p-sm">
                          Halo
                        </span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          // checked={}
                          // onChange={}
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
                          // checked={}
                          // onChange={}
                          className="w-6 h-6"
                        />
                        <span className="text-c-gray3 font-medium text-p-sm">
                          Diplopia
                        </span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          // checked={}
                          // onChange={}
                          className="w-6 h-6"
                        />
                        <span className="text-c-gray3 font-medium text-p-sm">
                          Tearing
                        </span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          // checked={}
                          // onChange={}
                          className="w-6 h-6"
                        />
                        <span className="text-c-gray3 font-medium text-p-sm">
                          Glare
                        </span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          // checked={}
                          // onChange={}
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
                    name=""
                    // value={}
                    // onChange={}
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
                          // checked={}
                          // onChange={}
                          className="w-6 h-6"
                        />
                        <span className="text-c-gray3 font-medium text-p-sm">
                          Hypertension
                        </span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          // checked={}
                          // onChange={}
                          className="w-6 h-6"
                        />
                        <span className="text-c-gray3 font-medium text-p-sm">
                          Cardiovascular Problem
                        </span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          // checked={}
                          // onChange={}
                          className="w-6 h-6"
                        />
                        <span className="text-c-gray3 font-medium text-p-sm">
                          Diabetes
                        </span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          // checked={}
                          // onChange={}
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
                          name=""
                          max={new Date().toISOString().split("T")[0]}
                          // value={}
                          // onChange={}
                          className="mt-1 w-fit h-fit px-4 py-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                        />
                      </label>
                    </div>
                  </section>
                  <textarea
                    type="text"
                    name=""
                    // value={}
                    // onChange={}
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
                          // checked={}
                          // onChange={}
                          className="w-6 h-6"
                        />
                        <span className="text-c-gray3 font-medium text-p-sm">
                          Glaucoma
                        </span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          // checked={}
                          // onChange={}
                          className="w-6 h-6"
                        />
                        <span className="text-c-gray3 font-medium text-p-sm">
                          Cataract
                        </span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          // checked={}
                          // onChange={}
                          className="w-6 h-6"
                        />
                        <span className="text-c-gray3 font-medium text-p-sm">
                          Astigmatism
                        </span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          // checked={}
                          // onChange={}
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
                          name=""
                          max={new Date().toISOString().split("T")[0]}
                          // value={}
                          // onChange={}
                          className="mt-1 w-fit h-fit px-4 py-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                        />
                      </label>
                    </div>
                  </section>
                  <textarea
                    type="text"
                    name=""
                    // value={}
                    // onChange={}
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
                        // checked={}
                        // onChange={}
                        className="w-6 h-6"
                      />
                      <span className="text-c-gray3 font-medium text-p-sm">
                        Glaucoma
                      </span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        // checked={}
                        // onChange={}
                        className="w-6 h-6"
                      />
                      <span className="text-c-gray3 font-medium text-p-sm">
                        Cataract
                      </span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        // checked={}
                        // onChange={}
                        className="w-6 h-6"
                      />
                      <span className="text-c-gray3 font-medium text-p-sm">
                        Astigmatism
                      </span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        // checked={}
                        // onChange={}
                        className="w-6 h-6"
                      />
                      <span className="text-c-gray3 font-medium text-p-sm">
                        Macular
                      </span>
                    </label>
                  </section>
                  <textarea
                    type="text"
                    name=""
                    // value={}
                    // onChange={}
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
                    name=""
                    // value={}
                    // onChange={}
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
                    name=""
                    // value={}
                    // onChange={}
                    className="mt-5 h-52 w-full px-4 py-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                    placeholder="If option not available"
                  />
                </div>
              </div>
            </div>
          )}
          {currentPage === 0 && (
            <div className="p-5 flex flex-col gap-5">
              <div className="border border-f-gray p-5 bg-bg-mc rounded-md flex gap-5 w-full">
                <div className="w-full">
                  <p className="text-f-gray font-medium text-p-sm">
                    Blood Pressure
                  </p>
                  <input
                    type="text"
                    name="bp"
                    value={medformData.bp}
                    onChange={handleChange}
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
                    value={medformData.bg}
                    onChange={handleChange}
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
                    value={medformData.hr}
                    onChange={handleChange}
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
                    value={medformData.o2_saturation}
                    onChange={handleChange}
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
                    value={medformData.temperature}
                    onChange={handleChange}
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
                        <p className="text-p-sm font-medium text-f-gray">OD</p>
                        <select
                          name=""
                          // value={}
                          // onChange={}
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
                        <p className="text-p-sm font-medium text-f-gray">OS</p>
                        <select
                          name=""
                          // value={}
                          // onChange={}
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
                        <p className="text-p-sm font-medium text-f-gray">OU</p>
                        <select
                          name=""
                          // value={}
                          // onChange={}
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
                      name=""
                      // value={}
                      // onChange={}
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
                        <p className="text-p-sm font-medium text-f-gray">OD</p>
                        <select
                          name=""
                          // value={}
                          // onChange={}
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
                        <p className="text-p-sm font-medium text-f-gray">OS</p>
                        <select
                          name=""
                          // value={}
                          // onChange={}
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
                        <p className="text-p-sm font-medium text-f-gray">OU</p>
                        <select
                          name=""
                          // value={}
                          // onChange={}
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
                      name=""
                      // value={}
                      // onChange={}
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
                        <p className="text-p-sm font-medium text-f-gray">OD</p>
                        <select
                          name=""
                          // value={}
                          // onChange={}
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
                        <p className="text-p-sm font-medium text-f-gray">OS</p>
                        <select
                          name=""
                          // value={}
                          // onChange={}
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
                      name=""
                      // value={}
                      // onChange={}
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
                      | Without Drops
                    </label>
                    <section className=" mt-5 flex gap-3 w-full">
                      <div className="flex flex-col w-full">
                        <p className="text-p-sm font-medium text-f-gray">OD</p>
                        <select
                          name=""
                          // value={}
                          // onChange={}
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
                        <p className="text-p-sm font-medium text-f-gray">OS</p>
                        <select
                          name=""
                          // value={}
                          // onChange={}
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
                      name=""
                      // value={}
                      // onChange={}
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
                        <p className="text-p-sm font-medium text-f-gray">OD</p>
                        <select
                          name=""
                          // value={}
                          // onChange={}
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
                        <p className="text-p-sm font-medium text-f-gray">OS</p>
                        <select
                          name=""
                          // value={}
                          // onChange={}
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
                      name=""
                      // value={}
                      // onChange={}
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
                            name=""
                            value=""
                            // checked={}
                            // onChange={}
                            className="mr-3 w-6 h-6"
                          />
                          <span className="text-f-gray font-semibold text-p-sm">
                            Right
                          </span>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="radio"
                            name=""
                            value=""
                            // checked={}
                            // onChange={}
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
                            name=""
                            value=""
                            // checked={}
                            // onChange={}
                            className="mr-3 w-6 h-6"
                          />
                          <span className="text-f-gray font-semibold text-p-sm">
                            Right
                          </span>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="radio"
                            name=""
                            value=""
                            // checked={}
                            // onChange={}
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
                    name=""
                    // value={}
                    // onChange={}
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
                        name=""
                        // value={}
                        // onChange={}
                        className="mt-2 w-full  px-3 py-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                      />
                    </div>
                    <div className="flex flex-col w-full">
                      <p className="text-p-sm font-medium text-f-gray">OS</p>
                      <input
                        type="text"
                        name=""
                        // value={}
                        // onChange={}
                        className="mt-2 w-full  px-3 py-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                      />
                    </div>
                    <div className="flex flex-col w-full">
                      <p className="text-p-sm font-medium text-f-gray">OU</p>
                      <input
                        type="text"
                        name=""
                        // value={}
                        // onChange={}
                        className="mt-2 w-full  px-3 py-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                      />
                    </div>
                  </section>
                  <textarea
                    type="text"
                    name=""
                    // value={}
                    // onChange={}
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
                        <p className="text-f-dark font-medium w-1/4">With Rx</p>
                        <section className="flex justify-between w-full">
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              // checked={}
                              // onChange={}
                              className="w-6 h-6"
                            />
                            <span className="text-f-gray font-medium text-p-sm">
                              Near
                            </span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              // checked={}
                              // onChange={}
                              className="w-6 h-6"
                            />
                            <span className="text-f-gray font-medium text-p-sm">
                              Distance
                            </span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              // checked={}
                              // onChange={}
                              className="w-6 h-6"
                            />
                            <span className="text-f-gray font-medium text-p-sm">
                              Tropia
                            </span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              // checked={}
                              // onChange={}
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
                              // checked={}
                              // onChange={}
                              className="w-6 h-6"
                            />
                            <span className="text-f-gray font-medium text-p-sm">
                              Near
                            </span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              // checked={}
                              // onChange={}
                              className="w-6 h-6"
                            />
                            <span className="text-f-gray font-medium text-p-sm">
                              Distance
                            </span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              // checked={}
                              // onChange={}
                              className="w-6 h-6"
                            />
                            <span className="text-f-gray font-medium text-p-sm">
                              Tropia
                            </span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              // checked={}
                              // onChange={}
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
                        <p className="text-f-dark font-medium w-1/4">With Rx</p>
                        <section className="flex justify-between w-full">
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              // checked={}
                              // onChange={}
                              className="w-6 h-6"
                            />
                            <span className="text-f-gray font-medium text-p-sm">
                              Near
                            </span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              // checked={}
                              // onChange={}
                              className="w-6 h-6"
                            />
                            <span className="text-f-gray font-medium text-p-sm">
                              Distance
                            </span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              // checked={}
                              // onChange={}
                              className="w-6 h-6"
                            />
                            <span className="text-f-gray font-medium text-p-sm">
                              Tropia
                            </span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              // checked={}
                              // onChange={}
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
                              // checked={}
                              // onChange={}
                              className="w-6 h-6"
                            />
                            <span className="text-f-gray font-medium text-p-sm">
                              Near
                            </span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              // checked={}
                              // onChange={}
                              className="w-6 h-6"
                            />
                            <span className="text-f-gray font-medium text-p-sm">
                              Distance
                            </span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              // checked={}
                              // onChange={}
                              className="w-6 h-6"
                            />
                            <span className="text-f-gray font-medium text-p-sm">
                              Tropia
                            </span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              // checked={}
                              // onChange={}
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
                  name=""
                  // value={}
                  // onChange={}
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
                        <p className="text-p-sm font-medium text-f-gray">OD</p>
                        <textarea
                          type="text"
                          name=""
                          // value={}
                          // onChange={}
                          className="mt-4 h-20 w-full px-4 py-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                          placeholder=""
                        />
                      </div>
                      <div className="flex flex-col w-full">
                        <p className="text-p-sm font-medium text-f-gray">OS</p>
                        <textarea
                          type="text"
                          name=""
                          // value={}
                          // onChange={}
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
                        <p className="text-p-sm font-medium text-f-gray">OD</p>
                        <input
                          type="text"
                          name=""
                          // value={}
                          // onChange={}
                          className="mt-2 w-full p-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                        />
                      </div>
                      <div className="flex flex-col w-full">
                        <p className="text-p-sm font-medium text-f-gray">OS</p>
                        <input
                          type="text"
                          name=""
                          // value={}
                          // onChange={}
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
                            name=""
                            value=""
                            // checked={}
                            // onChange={}
                            className="mr-3 w-6 h-6"
                          />
                          <span className="text-f-gray font-semibold text-p-sm">
                            Yes
                          </span>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="radio"
                            name=""
                            value=""
                            // checked={}
                            // onChange={}
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
                            name=""
                            value=""
                            // checked={}
                            // onChange={}
                            className="mr-3 w-6 h-6"
                          />
                          <span className="text-f-gray font-semibold text-p-sm">
                            Yes
                          </span>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="radio"
                            name=""
                            value=""
                            // checked={}
                            // onChange={}
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
                    name=""
                    // value={}
                    // onChange={}
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
                            name=""
                            value=""
                            // checked={}
                            // onChange={}
                            className="mr-3 w-6 h-6"
                          />
                          <span className="text-f-gray font-semibold text-p-sm">
                            Present
                          </span>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="radio"
                            name=""
                            value=""
                            // checked={}
                            // onChange={}
                            className="mr-3 w-6 h-6"
                          />
                          <span className="text-f-gray font-semibold text-p-sm">
                            Absent
                          </span>
                        </div>
                      </div>
                      <input
                        type="text"
                        name=""
                        // value={}
                        // onChange={}
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
                              name=""
                              value=""
                              // checked={}
                              // onChange={}
                              className="mr-3 w-6 h-6"
                            />
                            <span className="text-f-gray font-semibold text-p-sm">
                              Present
                            </span>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="radio"
                              name=""
                              value=""
                              // checked={}
                              // onChange={}
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
                              name=""
                              value=""
                              // checked={}
                              // onChange={}
                              className="mr-3 w-6 h-6"
                            />
                            <span className="text-f-gray font-semibold text-p-sm">
                              Present
                            </span>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="radio"
                              name=""
                              value=""
                              // checked={}
                              // onChange={}
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
                      name=""
                      // value={}
                      // onChange={}
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
                              name=""
                              value=""
                              // checked={}
                              // onChange={}
                              className="mr-3 w-6 h-6"
                            />
                            <span className="text-f-gray font-semibold text-p-sm">
                              Normal
                            </span>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="radio"
                              name=""
                              value=""
                              // checked={}
                              // onChange={}
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
                              name=""
                              value=""
                              // checked={}
                              // onChange={}
                              className="mr-3 w-6 h-6"
                            />
                            <span className="text-f-gray font-semibold text-p-sm">
                              Normal
                            </span>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="radio"
                              name=""
                              value=""
                              // checked={}
                              // onChange={}
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
                      name=""
                      // value={}
                      // onChange={}
                      className="mt-4 h-24 w-full px-4 py-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                      placeholder=""
                    />
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
                              name=""
                              value=""
                              // checked={}
                              // onChange={}
                              className="mr-3 w-6 h-6"
                            />
                            <span className="text-f-gray font-semibold text-p-sm">
                              Present
                            </span>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="radio"
                              name=""
                              value=""
                              // checked={}
                              // onChange={}
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
                              name=""
                              value=""
                              // checked={}
                              // onChange={}
                              className="mr-3 w-6 h-6"
                            />
                            <span className="text-f-gray font-semibold text-p-sm">
                              Present
                            </span>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="radio"
                              name=""
                              value=""
                              // checked={}
                              // onChange={}
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
                      name=""
                      // value={}
                      // onChange={}
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
                        <p className="text-p-sm font-medium text-f-gray">OD</p>
                        <select
                          name=""
                          // value={}
                          // onChange={}
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
                        <p className="text-p-sm font-medium text-f-gray">OS</p>
                        <select
                          name=""
                          // value={}
                          // onChange={}
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
                        name=""
                        // value={}
                        // onChange={}
                        className="h-32 w-full px-4 py-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                        placeholder=""
                      />
                      <div className="flex flex-col justify-center items-center gap-3">
                        <p className="text-p-sm font-medium text-f-gray text-nowrap">
                          Sample Image
                        </p>
                        <img src="" alt="" className="bg-blue-900 w-24 h-24" />
                      </div>
                    </section>
                  </div>
                  <div className="border border-f-gray bg-bg-mc rounded-md p-5">
                    <label className="text-p-rg font-semibold text-c-secondary">
                      | Worth’s Four Dots
                    </label>
                    <section className="flex gap-3 mt-5">
                      <div className="flex flex-col w-full">
                        <p className="text-p-sm font-medium text-f-gray">OD</p>
                        <textarea
                          type="text"
                          name=""
                          // value={}
                          // onChange={}
                          className="mt-4 h-20 w-full px-4 py-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                          placeholder=""
                        />
                      </div>
                      <div className="flex flex-col w-full">
                        <p className="text-p-sm font-medium text-f-gray">OS</p>
                        <textarea
                          type="text"
                          name=""
                          // value={}
                          // onChange={}
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
                        <p className="text-p-sm font-medium text-f-gray">OD</p>
                        <textarea
                          type="text"
                          name=""
                          // value={}
                          // onChange={}
                          className="mt-4 h-20 w-full px-4 py-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                          placeholder=""
                        />
                      </div>
                      <div className="flex flex-col w-full">
                        <p className="text-p-sm font-medium text-f-gray">OS</p>
                        <textarea
                          type="text"
                          name=""
                          // value={}
                          // onChange={}
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
                        <p className="text-p-sm font-medium text-f-gray">OD</p>
                        <textarea
                          type="text"
                          name=""
                          // value={}
                          // onChange={}
                          className="mt-4 h-20 w-full px-4 py-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                          placeholder=""
                        />
                      </div>
                      <div className="flex flex-col w-full">
                        <p className="text-p-sm font-medium text-f-gray">OS</p>
                        <textarea
                          type="text"
                          name=""
                          // value={}
                          // onChange={}
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
                    | Ophthalmoscopy
                  </label>
                  <section className="flex mt-5 gap-3">
                    <div className="flex flex-col w-full">
                      <p className="text-p-sm font-medium text-f-gray">OD</p>
                      <input
                        type="text"
                        name=""
                        // value={}
                        // onChange={}
                        className="mt-2 w-full p-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                      />
                    </div>
                    <div className="flex flex-col w-full">
                      <p className="text-p-sm font-medium text-f-gray">OS</p>
                      <input
                        type="text"
                        name=""
                        // value={}
                        // onChange={}
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
                        name=""
                        // value={}
                        // onChange={}
                        className="mt-2 w-2/3 p-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                      />
                      <p className="text-p-sm font-medium text-c-secondary text-nowrap text-center w-1/3">
                        Cup/Disc Ratio
                      </p>
                      <input
                        type="text"
                        name=""
                        // value={}
                        // onChange={}
                        className="mt-2 w-2/3  p-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                      />
                    </div>
                    <div className="flex gap-3 items-center">
                      <input
                        type="text"
                        name=""
                        // value={}
                        // onChange={}
                        className="mt-2 w-2/3 p-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                      />
                      <p className="text-p-sm font-medium text-c-secondary text-nowrap text-center w-1/3">
                        A/V Ratio
                      </p>
                      <input
                        type="text"
                        name=""
                        // value={}
                        // onChange={}
                        className="mt-2 w-2/3 p-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                      />
                    </div>
                    <div className="flex gap-3 items-center">
                      <select
                        name=""
                        // value={}
                        // onChange={}
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
                        name=""
                        // value={}
                        // onChange={}
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
                        name=""
                        // value={}
                        // onChange={}
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
                        name=""
                        // value={}
                        // onChange={}
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
                            name=""
                            value=""
                            // checked={}
                            // onChange={}
                            className="mr-3 w-6 h-6"
                          />
                          <span className="text-f-gray font-semibold text-p-sm">
                            Normal
                          </span>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="radio"
                            name=""
                            value=""
                            // checked={}
                            // onChange={}
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
                            name=""
                            value=""
                            // checked={}
                            // onChange={}
                            className="mr-3 w-6 h-6"
                          />
                          <span className="text-f-gray font-semibold text-p-sm">
                            Abnormal
                          </span>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="radio"
                            name=""
                            value=""
                            // checked={}
                            // onChange={}
                            className="mr-3 w-6 h-6"
                          />
                          <span className="text-f-gray font-semibold text-p-sm">
                            Normal
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3 items-center">
                      <div className="flex gap-6 w-2/3">
                        <div className="flex items-center">
                          <input
                            type="radio"
                            name=""
                            value=""
                            // checked={}
                            // onChange={}
                            className="mr-3 w-6 h-6"
                          />
                          <span className="text-f-gray font-semibold text-p-sm">
                            Normal
                          </span>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="radio"
                            name=""
                            value=""
                            // checked={}
                            // onChange={}
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
                            name=""
                            value=""
                            // checked={}
                            // onChange={}
                            className="mr-3 w-6 h-6"
                          />
                          <span className="text-f-gray font-semibold text-p-sm">
                            Abnormal
                          </span>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="radio"
                            name=""
                            value=""
                            // checked={}
                            // onChange={}
                            className="mr-3 w-6 h-6"
                          />
                          <span className="text-f-gray font-semibold text-p-sm">
                            Normal
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3 items-center">
                      <div className="flex gap-6 w-2/3">
                        <div className="flex items-center">
                          <input
                            type="radio"
                            name=""
                            value=""
                            // checked={}
                            // onChange={}
                            className="mr-3 w-6 h-6"
                          />
                          <span className="text-f-gray font-semibold text-p-sm">
                            Present
                          </span>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="radio"
                            name=""
                            value=""
                            // checked={}
                            // onChange={}
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
                            name=""
                            value=""
                            // checked={}
                            // onChange={}
                            className="mr-3 w-6 h-6"
                          />
                          <span className="text-f-gray font-semibold text-p-sm">
                            Absent
                          </span>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="radio"
                            name=""
                            value=""
                            // checked={}
                            // onChange={}
                            className="mr-3 w-6 h-6"
                          />
                          <span className="text-f-gray font-semibold text-p-sm">
                            Present
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3 items-center">
                      <div className="flex gap-6 w-2/3">
                        <div className="flex items-center">
                          <input
                            type="radio"
                            name=""
                            value=""
                            // checked={}
                            // onChange={}
                            className="mr-3 w-6 h-6"
                          />
                          <span className="text-f-gray font-semibold text-p-sm">
                            Normal
                          </span>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="radio"
                            name=""
                            value=""
                            // checked={}
                            // onChange={}
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
                            name=""
                            value=""
                            // checked={}
                            // onChange={}
                            className="mr-3 w-6 h-6"
                          />
                          <span className="text-f-gray font-semibold text-p-sm">
                            Abnormal
                          </span>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="radio"
                            name=""
                            value=""
                            // checked={}
                            // onChange={}
                            className="mr-3 w-6 h-6"
                          />
                          <span className="text-f-gray font-semibold text-p-sm">
                            Normal
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
                              // checked={}
                              // onChange={}
                              className="w-6 h-6"
                            />
                            <span className="text-c-gray3 font-medium text-p-sm">
                              Inflammation
                            </span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              // checked={}
                              // onChange={}
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
                              // checked={}
                              // onChange={}
                              className="w-6 h-6"
                            />
                            <span className="text-c-gray3 font-medium text-p-sm">
                              Dandruff
                            </span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              // checked={}
                              // onChange={}
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
                        name=""
                        // value={}
                        // onChange={}
                        className="mt-3 w-full p-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                      />
                    </div>
                    <p className="text-p-sm font-medium text-c-secondary text-nowrap text-center w-1/3">
                      Periphery
                    </p>
                    <div className="border border-f-gray rounded-md bg-white p-5 w-2/3">
                      <div className="flex justify-between">
                        <div className="flex flex-col gap-3">
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              // checked={}
                              // onChange={}
                              className="w-6 h-6"
                            />
                            <span className="text-c-gray3 font-medium text-p-sm">
                              Inflammation
                            </span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              // checked={}
                              // onChange={}
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
                              // checked={}
                              // onChange={}
                              className="w-6 h-6"
                            />
                            <span className="text-c-gray3 font-medium text-p-sm">
                              Dandruff
                            </span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              // checked={}
                              // onChange={}
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
                        name=""
                        // value={}
                        // onChange={}
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
                              // checked={}
                              // onChange={}
                              className="w-6 h-6"
                            />
                            <span className="text-c-gray3 font-medium text-p-sm">
                              Crusting
                            </span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              // checked={}
                              // onChange={}
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
                              // checked={}
                              // onChange={}
                              className="w-6 h-6"
                            />
                            <span className="text-c-gray3 font-medium text-p-sm">
                              Eyelash Lice
                            </span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              // checked={}
                              // onChange={}
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
                        name=""
                        // value={}
                        // onChange={}
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
                              // checked={}
                              // onChange={}
                              className="w-6 h-6"
                            />
                            <span className="text-c-gray3 font-medium text-p-sm">
                              Crusting
                            </span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              // checked={}
                              // onChange={}
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
                              // checked={}
                              // onChange={}
                              className="w-6 h-6"
                            />
                            <span className="text-c-gray3 font-medium text-p-sm">
                              Eyelash Lice
                            </span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              // checked={}
                              // onChange={}
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
                        name=""
                        // value={}
                        // onChange={}
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
                              // checked={}
                              // onChange={}
                              className="w-6 h-6"
                            />
                            <span className="text-c-gray3 font-medium text-p-sm">
                              Blepharitis
                            </span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              // checked={}
                              // onChange={}
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
                              // checked={}
                              // onChange={}
                              className="w-6 h-6"
                            />
                            <span className="text-c-gray3 font-medium text-p-sm">
                              Chalazion
                            </span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              // checked={}
                              // onChange={}
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
                        name=""
                        // value={}
                        // onChange={}
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
                              // checked={}
                              // onChange={}
                              className="w-6 h-6"
                            />
                            <span className="text-c-gray3 font-medium text-p-sm">
                              Blepharitis
                            </span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              // checked={}
                              // onChange={}
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
                              // checked={}
                              // onChange={}
                              className="w-6 h-6"
                            />
                            <span className="text-c-gray3 font-medium text-p-sm">
                              Chalazion
                            </span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              // checked={}
                              // onChange={}
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
                        name=""
                        // value={}
                        // onChange={}
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
                              // checked={}
                              // onChange={}
                              className="w-6 h-6"
                            />
                            <span className="text-c-gray3 font-medium text-p-sm">
                              Corneal abrasion
                            </span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              // checked={}
                              // onChange={}
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
                              // checked={}
                              // onChange={}
                              className="w-6 h-6"
                            />
                            <span className="text-c-gray3 font-medium text-p-sm">
                              Pterygium
                            </span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              // checked={}
                              // onChange={}
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
                        name=""
                        // value={}
                        // onChange={}
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
                              // checked={}
                              // onChange={}
                              className="w-6 h-6"
                            />
                            <span className="text-c-gray3 font-medium text-p-sm">
                              Corneal abrasion
                            </span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              // checked={}
                              // onChange={}
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
                              // checked={}
                              // onChange={}
                              className="w-6 h-6"
                            />
                            <span className="text-c-gray3 font-medium text-p-sm">
                              Pterygium
                            </span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              // checked={}
                              // onChange={}
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
                        name=""
                        // value={}
                        // onChange={}
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
                              // checked={}
                              // onChange={}
                              className="w-6 h-6"
                            />
                            <span className="text-c-gray3 font-medium text-p-sm">
                              Pinguecula
                            </span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              // checked={}
                              // onChange={}
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
                              // checked={}
                              // onChange={}
                              className="w-6 h-6"
                            />
                            <span className="text-c-gray3 font-medium text-p-sm">
                              Scarring 
                            </span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              // checked={}
                              // onChange={}
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
                        name=""
                        // value={}
                        // onChange={}
                        className="mt-3 w-full p-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                      />
                    </div>
                    <p className="text-p-sm font-medium text-c-secondary text-nowrap text-center w-1/3">
                      Limus
                    </p>
                    <div className="border border-f-gray rounded-md bg-white p-5 w-2/3">
                      <div className="flex justify-between">
                        <div className="flex flex-col gap-3">
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              // checked={}
                              // onChange={}
                              className="w-6 h-6"
                            />
                            <span className="text-c-gray3 font-medium text-p-sm">
                              Pinguecula
                            </span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              // checked={}
                              // onChange={}
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
                              // checked={}
                              // onChange={}
                              className="w-6 h-6"
                            />
                            <span className="text-c-gray3 font-medium text-p-sm">
                              Scarring 
                            </span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              // checked={}
                              // onChange={}
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
                        name=""
                        // value={}
                        // onChange={}
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
                              // checked={}
                              // onChange={}
                              className="w-6 h-6"
                            />
                            <span className="text-c-gray3 font-medium text-p-sm">
                              Miosis or mydriasis
                            </span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              // checked={}
                              // onChange={}
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
                              // checked={}
                              // onChange={}
                              className="w-6 h-6"
                            />
                            <span className="text-c-gray3 font-medium text-p-sm">
                              Pupil distortion
                            </span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              // checked={}
                              // onChange={}
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
                        name=""
                        // value={}
                        // onChange={}
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
                              // checked={}
                              // onChange={}
                              className="w-6 h-6"
                            />
                            <span className="text-c-gray3 font-medium text-p-sm">
                              Miosis or mydriasis
                            </span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              // checked={}
                              // onChange={}
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
                              // checked={}
                              // onChange={}
                              className="w-6 h-6"
                            />
                            <span className="text-c-gray3 font-medium text-p-sm">
                              Pupil distortion
                            </span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              // checked={}
                              // onChange={}
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
                        name=""
                        // value={}
                        // onChange={}
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
                              // checked={}
                              // onChange={}
                              className="w-6 h-6"
                            />
                            <span className="text-c-gray3 font-medium text-p-sm">
                              Iris neovascularization
                            </span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              // checked={}
                              // onChange={}
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
                              // checked={}
                              // onChange={}
                              className="w-6 h-6"
                            />
                            <span className="text-c-gray3 font-medium text-p-sm">
                              Hyphema
                            </span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              // checked={}
                              // onChange={}
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
                        name=""
                        // value={}
                        // onChange={}
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
                              // checked={}
                              // onChange={}
                              className="w-6 h-6"
                            />
                            <span className="text-c-gray3 font-medium text-p-sm">
                              Iris neovascularization
                            </span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              // checked={}
                              // onChange={}
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
                              // checked={}
                              // onChange={}
                              className="w-6 h-6"
                            />
                            <span className="text-c-gray3 font-medium text-p-sm">
                              Hyphema
                            </span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              // checked={}
                              // onChange={}
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
                        name=""
                        // value={}
                        // onChange={}
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
                          name=""
                          max={new Date().toISOString().split("T")[0]}
                          // value={}
                          // onChange={}
                          className="mt-1 w-fit h-fit px-4 py-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                        />
                      </label>
                    </section>
                    <section className="text-p-sm font-semibold mt-5 flex gap-3">
                      <div className="flex flex-col w-full">
                        <p className="text-p-sm font-medium text-f-gray">OD</p>
                        <textarea
                          type="text"
                          name=""
                          // value={}
                          // onChange={}
                          className="mt-3 h-32 w-full px-4 py-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                          placeholder=""
                        />
                      </div>
                      <div className="flex flex-col w-full">
                        <p className="text-p-sm font-medium text-f-gray">OD</p>
                        <textarea
                          type="text"
                          name=""
                          // value={}
                          // onChange={}
                          className="mt-3 h-32 w-full px-4 py-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                          placeholder=""
                        />
                      </div>
                    </section>
                  </div>
                  <div className="border border-f-gray bg-bg-mc w-1/2 rounded-br-md p-5">
                    <section className="flex justify-between">
                      <label className="text-p-rg font-semibold text-c-secondary">
                        | General Health Hx
                      </label>
                      <label>
                        <p className="text-c-gray3 font-medium text-p-sm">
                          Date Prescribe
                        </p>
                        <input
                          type="date"
                          name=""
                          max={new Date().toISOString().split("T")[0]}
                          // value={}
                          // onChange={}
                          className="mt-1 w-fit h-fit px-4 py-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                        />
                      </label>
                    </section>
                    <section className="text-p-sm font-semibold mt-5 flex gap-3">
                      <div className="flex flex-col w-full">
                        <p className="text-p-sm font-medium text-f-gray">OD</p>
                        <textarea
                          type="text"
                          name=""
                          // value={}
                          // onChange={}
                          className="mt-3 h-32 w-full px-4 py-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                          placeholder=""
                        />
                      </div>
                      <div className="flex flex-col w-full">
                        <p className="text-p-sm font-medium text-f-gray">OD</p>
                        <textarea
                          type="text"
                          name=""
                          // value={}
                          // onChange={}
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
          {currentPage === "Assessment" && (
            <div className="p-5 flex gap-5">
              <div className="border border-f-gray p-5 bg-bg-mc rounded-md w-1/2">
                <label className="text-p-rg font-semibold text-c-secondary">
                  | Diagnosis
                </label>
                <textarea
                  type="text"
                  name=""
                  // value={}
                  // onChange={}
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
                  name=""
                  // value={}
                  // onChange={}
                  className="mt-5 h-60 w-full px-4 py-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                  placeholder="If option not available"
                />
              </div>
            </div>
          )}
          {currentPage === "Plan" && (
            <div className="p-5 flex flex-col gap-5">
              <div className="flex gap-5">
                <div className="border border-f-gray p-5 bg-bg-mc rounded-md w-1/2">
                  <label className="text-p-rg font-semibold text-c-secondary">
                    | New Prescription OD
                  </label>
                  <textarea
                    type="text"
                    name=""
                    // value={}
                    // onChange={}
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
                    name=""
                    // value={}
                    // onChange={}
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
                    name=""
                    // value={}
                    // onChange={}
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
                    name=""
                    // value={}
                    // onChange={}
                    className="mt-5 h-60 w-full px-4 py-3 border border-f-gray rounded-md text-f-dark focus:outline-c-primary"
                    placeholder="If option not available"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </form>
      {isCanvasOpen && (
        <EyeSketch
          onClose={toggle}
          onSave={handleSaveCanvas}
          backgroundImage={selectedBG}
        />
      )}
    </div>
  );
};

export default MedForm;
