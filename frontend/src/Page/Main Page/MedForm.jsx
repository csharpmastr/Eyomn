import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const MedForm = () => {
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
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const handleNext = () => {
    if (currentCardIndex < 4) {
      setCurrentCardIndex(currentCardIndex + 1);
    }
  };

  const handleBack = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
    }
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
    <div className="w-full p-2 md:p-8 flex flex-col-reverse lg:flex-row bg-bg-mc gap-8">
      <div className="w-full lg:w-[calc(100%-288px)]">
        <form onSubmit={handleSubmit}>
          {currentCardIndex === 0 && (
            <div>
              <section className="p-2 md:p-6 bg-white rounded-lg border border-f-gray mb-6">
                <label className="text-p-lg font-semibold text-c-secondary">
                  | Initial Obeservation
                </label>
                <textarea
                  type="text"
                  name="initial_observation"
                  value={medformData.initial_observation}
                  onChange={handleChange}
                  className="mt-3 h-20 w-full px-4 py-3 border border-c-gray3 rounded-md text-f-dark focus:outline-c-primary"
                  placeholder="Enter your initial observation"
                />
              </section>
              <section className="p-2 md:p-6 bg-white rounded-lg border border-f-gray">
                <label className="text-p-lg font-semibold text-c-secondary">
                  | Case History
                </label>
                <div className="mt-6 p-2 md:p-4 bg-bg-sb rounded-lg">
                  <p className="text-c-gray3 font-medium text-p-sm">
                    Chief Complaint
                  </p>
                  <textarea
                    type="text"
                    name="chief_complaints"
                    value={medformData.chief_complaints}
                    onChange={handleChange}
                    className="mt-1 h-20 w-full px-4 py-3 border border-c-gray3 rounded-md text-f-dark focus:outline-c-primary"
                    placeholder="Enter patient's complaint"
                  />
                </div>
                <div className="mt-6 p-2 md:p-4 bg-bg-sb rounded-lg flex gap-4">
                  <div className="w-full">
                    <p className="text-c-gray3 font-medium text-p-sm">
                      Occular History
                    </p>
                    <textarea
                      type="text"
                      name="occular_history.description"
                      value={medformData.occular_history.description}
                      onChange={(e) =>
                        handleChange(e, "occular_history.description")
                      }
                      className="mt-1 h-20 w-full px-4 py-3 border border-c-gray3 rounded-md text-f-dark focus:outline-c-primary"
                      placeholder="Enter patient's occular history"
                    />
                  </div>
                  <div>
                    <p className="text-c-gray3 font-medium text-p-sm">
                      Date of last Eye Exam:
                    </p>
                    <input
                      type="date"
                      name="occular_history.last_exam"
                      max={new Date().toISOString().split("T")[0]}
                      value={medformData.occular_history.last_exam}
                      onChange={(e) =>
                        handleChange(e, "occular_history.last_exam")
                      }
                      className="mt-1 w-fit h-fit px-4 py-3 border border-c-gray3 rounded-md text-f-dark focus:outline-c-primary"
                    />
                  </div>
                </div>
                <div className="mt-6 p-2 md:p-4 bg-bg-sb rounded-lg flex gap-4">
                  <div className="w-full">
                    <p className="text-c-gray3 font-medium text-p-sm">
                      General Health Hx
                    </p>
                    <textarea
                      type="text"
                      name="gen_health_hx.description"
                      value={medformData.gen_health_hx.description}
                      onChange={(e) =>
                        handleChange(e, "gen_health_hx.description")
                      }
                      className="mt-1 h-20 w-full px-4 py-3 border border-c-gray3 rounded-md text-f-dark focus:outline-c-primary"
                      placeholder="Enter patient's general health history"
                    />
                  </div>
                  <div>
                    <p className="text-c-gray3 font-medium text-p-sm">
                      Date of last Medical Exam:
                    </p>
                    <input
                      type="date"
                      name="gen_health_hx.last_exam"
                      value={medformData.gen_health_hx.last_exam}
                      max={new Date().toISOString().split("T")[0]}
                      onChange={(e) =>
                        handleChange(e, "gen_health_hx.last_exam")
                      }
                      className="mt-1 w-fit h-fit px-4 py-3 border border-c-gray3 rounded-md text-f-dark focus:outline-c-primary"
                    />
                  </div>
                </div>
                <div className="mt-6 p-2 lg:p-4 bg-bg-sb rounded-lg flex flex-wrap  lg:flex-nowrap gap-3 xl:gap-12">
                  <div>
                    <p className="text-c-gray3 font-medium text-p-sm">
                      Blood Pressure:
                    </p>
                    <input
                      type="text"
                      name="bp"
                      value={medformData.bp}
                      onChange={handleChange}
                      className="mt-1 w-20 lg:w-full  px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                    />
                  </div>
                  <div>
                    <p className="text-c-gray3 font-medium text-p-sm">
                      Blood Glucose:
                    </p>
                    <input
                      type="text"
                      name="bg"
                      value={medformData.bg}
                      onChange={handleChange}
                      className="mt-1 w-20 lg:w-full  px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                    />
                  </div>
                  <div>
                    <p className="text-c-gray3 font-medium text-p-sm">
                      Heart Rate:
                    </p>
                    <input
                      type="text"
                      name="hr"
                      value={medformData.hr}
                      onChange={handleChange}
                      className="mt-1 w-20 lg:w-full  px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                    />
                  </div>
                  <div>
                    <p className="text-c-gray3 font-medium text-p-sm">
                      O2 Saturation:
                    </p>
                    <input
                      type="text"
                      name="o2_saturation"
                      value={medformData.o2_saturation}
                      onChange={handleChange}
                      className="mt-1 w-20 lg:w-full  px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                    />
                  </div>
                  <div>
                    <p className="text-c-gray3 font-medium text-p-sm">
                      Temperature:
                    </p>
                    <input
                      type="text"
                      name="temperature"
                      value={medformData.temperature}
                      onChange={handleChange}
                      className="mt-1 w-20 lg:w-full  px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                    />
                  </div>
                </div>
              </section>
            </div>
          )}
          {currentCardIndex === 1 && (
            <div>
              <section className="p-2 md:p-6 bg-white rounded-lg border border-f-gray mb-6">
                <div>
                  <label className="text-p-lg font-semibold text-c-secondary">
                    | Visual Acuity
                  </label>
                  <div className="mt-6 grid grid-cols-4 gap-4 items-center">
                    <div></div>
                    <div className="text-c-gray3 font-medium text-p-sm">
                      OD:
                    </div>
                    <div className="text-c-gray3 font-medium text-p-sm">
                      OS:
                    </div>
                    <div className="text-c-gray3 font-medium text-p-sm">
                      OU:
                    </div>

                    <div className="text-p-rg text-f-dark">Habitual VA</div>
                    <input
                      type="text"
                      name="habitual_va.od"
                      value={medformData.habitual_va.od}
                      onChange={(e) => handleChange(e, "habitual_va.od")}
                      className="px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                      placeholder="20/30"
                    />
                    <input
                      type="text"
                      name="habitual_va.os"
                      value={medformData.habitual_va.os}
                      onChange={(e) => handleChange(e, "habitual_va.os")}
                      className="px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                      placeholder="20/30"
                    />
                    <input
                      type="text"
                      name="habitual_va.ou"
                      value={medformData.habitual_va.ou}
                      onChange={(e) => handleChange(e, "habitual_va.ou")}
                      className="px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                      placeholder="20/30"
                    />

                    <div className="text-p-rg text-f-dark">Unaided VA</div>
                    <input
                      type="text"
                      name="unaided_va.od"
                      value={medformData.unaided_va.od}
                      onChange={(e) => handleChange(e, "unaided_va.od")}
                      className="px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                      placeholder="20/30"
                    />
                    <input
                      type="text"
                      name="unaided_va.os"
                      value={medformData.unaided_va.os}
                      onChange={(e) => handleChange(e, "unaided_va.os")}
                      className="px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                      placeholder="20/30"
                    />
                    <input
                      type="text"
                      name="unaided_va.ou"
                      value={medformData.unaided_va.ou}
                      onChange={(e) => handleChange(e, "unaided_va.ou")}
                      className="px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                      placeholder="20/30"
                    />

                    <div className="text-p-rg text-f-dark">Pinhole VA</div>
                    <input
                      type="text"
                      name="pinhole_va.od"
                      value={medformData.pinhole_va.od}
                      onChange={(e) => handleChange(e, "pinhole_va.od")}
                      className="px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                      placeholder="20/30"
                    />
                    <input
                      type="text"
                      name="pinhole_va.os"
                      value={medformData.pinhole_va.os}
                      onChange={(e) => handleChange(e, "pinhole_va.os")}
                      className="px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                      placeholder="20/30"
                    />
                    <input
                      type="text"
                      name="pinhole_va.ou"
                      value={medformData.pinhole_va.ou}
                      onChange={(e) => handleChange(e, "pinhole_va.ou")}
                      className="px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                      placeholder="20/30"
                    />
                  </div>
                </div>
                <div className="mt-8">
                  <label className="text-p-lg font-semibold text-c-secondary">
                    | Habitual Prescription
                  </label>
                  <p className="text-c-gray3 font-medium text-p-sm mt-6">
                    Date Prescribe:
                  </p>
                  <input
                    type="date"
                    name="habitual_prescription.date_prescribed"
                    value={medformData.habitual_prescription.date_prescribed}
                    onChange={(e) =>
                      handleChange(e, "habitual_prescription.date_prescribed")
                    }
                    className="mt-1 w-fit h-fit px-4 py-3 border border-c-gray3 rounded-md text-f-dark focus:outline-c-primary"
                  />

                  <div className="flex justify-between mt-6">
                    <div>
                      <p className="text-c-gray3 font-medium text-p-sm">OD:</p>
                      <input
                        type="text"
                        name="habitual_prescription.od"
                        value={medformData.habitual_prescription.od}
                        onChange={(e) =>
                          handleChange(e, "habitual_prescription.od")
                        }
                        className="mt-1 w-20 lg:w-full  px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                      />
                    </div>
                    <div>
                      <p className="text-c-gray3 font-medium text-p-sm">OS:</p>
                      <input
                        type="text"
                        name="habitual_prescription.os"
                        value={medformData.habitual_prescription.os}
                        onChange={(e) =>
                          handleChange(e, "habitual_prescription.os")
                        }
                        className="mt-1 w-20 lg:w-full  px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                      />
                    </div>
                    <div>
                      <p className="text-c-gray3 font-medium text-p-sm">OU:</p>
                      <input
                        type="text"
                        name="habitual_prescription.ou"
                        value={medformData.habitual_prescription.ou}
                        onChange={(e) =>
                          handleChange(e, "habitual_prescription.ou")
                        }
                        className="mt-1 w-20 lg:w-full  px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                      />
                    </div>
                  </div>
                </div>
              </section>
              <section className="p-2 md:p-6 bg-white rounded-lg border border-f-gray mb-6">
                <label className="text-p-lg font-semibold text-c-secondary">
                  | Pupillary Distance
                </label>
                <div className="flex justify-between mt-6">
                  <div>
                    <p className="text-c-gray3 font-medium text-p-sm">OD:</p>
                    <input
                      type="text"
                      name="pupillary_prescription.od"
                      value={medformData.pupillary_distance.od}
                      onChange={(e) => handleChange(e, "pupillary_distance.od")}
                      className="mt-1 w-20 lg:w-full  px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                    />
                  </div>
                  <div>
                    <p className="text-c-gray3 font-medium text-p-sm">OS:</p>
                    <input
                      type="text"
                      name="pupillary_distance.os"
                      value={medformData.pupillary_distance.os}
                      onChange={(e) => handleChange(e, "pupillary_distance.os")}
                      className="mt-1 w-20 lg:w-full  px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                    />
                  </div>
                  <div>
                    <p className="text-c-gray3 font-medium text-p-sm">OU:</p>
                    <input
                      type="text"
                      name="pupillary_distance.ou"
                      value={medformData.pupillary_distance.ou}
                      onChange={(e) => handleChange(e, "pupillary_distance.ou")}
                      className="mt-1 w-20 lg:w-full  px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                    />
                  </div>
                </div>
              </section>
              <section className="p-2 md:p-6 bg-white rounded-lg border border-f-gray mb-6">
                <div>
                  <label className="text-p-lg font-semibold text-c-secondary">
                    | Cover Test
                  </label>
                  <div className="mt-6">
                    <p className="text-c-gray3 font-medium text-p-sm">OD:</p>
                    <div className="w-full flex justify-between p-4 border border-c-gray3 mt-1 rounded-md">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={medformData.cover_test.od.with_rx_distance}
                          onChange={(e) =>
                            handleChange(e, "cover_test.od.with_rx_distance")
                          }
                          className="w-6 h-6"
                        />
                        <span className="text-c-gray3 font-medium text-p-sm">
                          With Rx - Distance
                        </span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={medformData.cover_test.od.with_rx_near}
                          onChange={(e) =>
                            handleChange(e, "cover_test.od.with_rx_near")
                          }
                          className="w-6 h-6"
                        />
                        <span className="text-c-gray3 font-medium text-p-sm">
                          With Rx - Near
                        </span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={
                            medformData.cover_test.od.without_rx_distance
                          }
                          onChange={(e) =>
                            handleChange(e, "cover_test.od.without_rx_distance")
                          }
                          className="w-6 h-6"
                        />
                        <span className="text-c-gray3 font-medium text-p-sm">
                          Without Rx - Distance
                        </span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={medformData.cover_test.od.without_rx_near}
                          onChange={(e) =>
                            handleChange(e, "cover_test.od.without_rx_near")
                          }
                          className="w-6 h-6"
                        />
                        <span className="text-c-gray3 font-medium text-p-sm">
                          Without Rx - Near
                        </span>
                      </label>
                    </div>
                  </div>

                  <div className="mt-6">
                    <p className="text-c-gray3 font-medium text-p-sm">OS:</p>
                    <div className="w-full flex justify-between p-4 border border-c-gray3 mt-1 rounded-md">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          value={medformData.cover_test.os.with_rx_distance}
                          onChange={(e) =>
                            handleChange(e, "cover_test.os.with_rx_distance")
                          }
                          className="w-6 h-6"
                        />
                        <span className="text-c-gray3 font-medium text-p-sm">
                          With Rx - Distance
                        </span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          value={medformData.cover_test.os.with_rx_near}
                          onChange={(e) =>
                            handleChange(e, "cover_test.os.with_rx_near")
                          }
                          className="w-6 h-6"
                        />
                        <span className="text-c-gray3 font-medium text-p-sm">
                          With Rx - Near
                        </span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          value={medformData.cover_test.os.without_rx_distance}
                          onChange={(e) =>
                            handleChange(e, "cover_test.os.without_rx_distance")
                          }
                          className="w-6 h-6"
                        />
                        <span className="text-c-gray3 font-medium text-p-sm">
                          Without Rx - Distance
                        </span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          value={medformData.cover_test.os.without_rx_near}
                          onChange={(e) =>
                            handleChange(e, "cover_test.os.without_rx_near")
                          }
                          className="w-6 h-6"
                        />
                        <span className="text-c-gray3 font-medium text-p-sm">
                          Without Rx - Near
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
                <div className="mt-8">
                  <label className="text-p-lg font-semibold text-c-secondary">
                    | Corneal Reflex Test
                  </label>
                  <div className="mt-6 flex">
                    <div className="flex-1">
                      <p className="text-c-gray3 font-medium text-p-sm">OD:</p>
                      <div className="flex gap-6 mt-1">
                        <div className="flex items-center">
                          <input
                            type="radio"
                            name="corneal_reflex_test_od"
                            value="present"
                            checked={medformData.corneal_reflex_test.od.present}
                            onChange={() =>
                              setMedformData((prevData) => ({
                                ...prevData,
                                corneal_reflex_test: {
                                  ...prevData.corneal_reflex_test,
                                  od: { present: true, absent: false },
                                },
                              }))
                            }
                            className="mr-2 w-6 h-6"
                          />
                          <span className="text-c-gray3 font-medium text-p-sm">
                            Present
                          </span>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="radio"
                            name="corneal_reflex_test_od"
                            value="absent"
                            checked={medformData.corneal_reflex_test.od.absent}
                            onChange={() =>
                              setMedformData((prevData) => ({
                                ...prevData,
                                corneal_reflex_test: {
                                  ...prevData.corneal_reflex_test,
                                  od: { present: false, absent: true },
                                },
                              }))
                            }
                            className="mr-2 w-6 h-6"
                          />
                          <span className="text-c-gray3 font-medium text-p-sm">
                            Absent
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-c-gray3 font-medium text-p-sm">OS:</p>
                      <div className="flex gap-6 mt-1">
                        <div className="flex items-center">
                          <input
                            type="radio"
                            name="corneal_reflex_test_os"
                            value="present"
                            checked={medformData.corneal_reflex_test.os.present}
                            onChange={() =>
                              setMedformData((prevData) => ({
                                ...prevData,
                                corneal_reflex_test: {
                                  ...prevData.corneal_reflex_test,
                                  os: { present: true, absent: false },
                                },
                              }))
                            }
                            className="mr-2 w-6 h-6"
                          />
                          <span className="text-c-gray3 font-medium text-p-sm">
                            Present
                          </span>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="radio"
                            name="corneal_reflex_test_os"
                            value="absent"
                            checked={medformData.corneal_reflex_test.os.absent}
                            onChange={() =>
                              setMedformData((prevData) => ({
                                ...prevData,
                                corneal_reflex_test: {
                                  ...prevData.corneal_reflex_test,
                                  os: { present: false, absent: true },
                                },
                              }))
                            }
                            className="mr-2 w-6 h-6"
                          />
                          <span className="text-c-gray3 font-medium text-p-sm">
                            Absent
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
              <section className="p-2 md:p-6 bg-white rounded-lg border border-f-gray mb-6">
                <label className="text-p-lg font-semibold text-c-secondary">
                  | Dominant Eye & Hand
                </label>
                <div className="mt-6 flex">
                  <div className="flex-1">
                    <p className="text-c-gray3 font-medium text-p-sm">
                      Dominant Eye:
                    </p>
                    <div className="flex gap-6 mt-1">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="dominant_eye"
                          value="left"
                          checked={medformData.dominant_EH.dominant_eye.left}
                          onChange={() =>
                            setMedformData((prevData) => ({
                              ...prevData,
                              dominant_EH: {
                                ...prevData.dominant_EH,
                                dominant_eye: { left: true, right: false },
                              },
                            }))
                          }
                          className="mr-2 w-6 h-6"
                        />
                        <span className="text-c-gray3 font-medium text-p-sm">
                          Left
                        </span>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="dominant_eye"
                          value="right"
                          checked={medformData.dominant_EH.dominant_eye.right}
                          onChange={() =>
                            setMedformData((prevData) => ({
                              ...prevData,
                              dominant_EH: {
                                ...prevData.dominant_EH,
                                dominant_eye: { left: false, right: true },
                              },
                            }))
                          }
                          className="mr-2 w-6 h-6"
                        />
                        <span className="text-c-gray3 font-medium text-p-sm">
                          Right
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-c-gray3 font-medium text-p-sm">
                      Dominant Hand:
                    </p>
                    <div className="flex gap-6 mt-1">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="dominant_hand"
                          value="left"
                          checked={medformData.dominant_EH.dominant_hand.left}
                          onChange={() =>
                            setMedformData((prevData) => ({
                              ...prevData,
                              dominant_EH: {
                                ...prevData.dominant_EH,
                                dominant_hand: { left: true, right: false },
                              },
                            }))
                          }
                          className="mr-2 w-6 h-6"
                        />
                        <span className="text-c-gray3 font-medium text-p-sm">
                          Left
                        </span>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="dominant_hand"
                          value="right"
                          checked={medformData.dominant_EH.dominant_hand.right}
                          onChange={() =>
                            setMedformData((prevData) => ({
                              ...prevData,
                              dominant_EH: {
                                ...prevData.dominant_EH,
                                dominant_hand: { left: false, right: true },
                              },
                            }))
                          }
                          className="mr-2 w-6 h-6"
                        />
                        <span className="text-c-gray3 font-medium text-p-sm">
                          Right
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
              <section className="p-2 md:p-6 bg-white rounded-lg border border-f-gray mb-6">
                <label className="text-p-lg font-semibold text-c-secondary">
                  | Diplopia Test
                </label>
                <div className="flex gap-6 mt-6">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="diplopia"
                      value="left"
                      checked={medformData.diplopia_test.left}
                      onChange={() =>
                        setMedformData((prevData) => ({
                          ...prevData,
                          diplopia_test: {
                            left: true,
                            right: false,
                          },
                        }))
                      }
                      className="mr-2 w-6 h-6"
                    />
                    <span className="text-c-gray3 font-medium text-p-sm">
                      Left
                    </span>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="diplopia"
                      value="right"
                      checked={medformData.diplopia_test.right}
                      onChange={() =>
                        setMedformData((prevData) => ({
                          ...prevData,
                          diplopia_test: {
                            left: false,
                            right: true,
                          },
                        }))
                      }
                      className="mr-2 w-6 h-6"
                    />
                    <span className="text-c-gray3 font-medium text-p-sm">
                      Right
                    </span>
                  </div>
                </div>
              </section>
            </div>
          )}
          {currentCardIndex === 2 && (
            <div>
              <section className="p-2 md:p-6 bg-white rounded-lg border border-f-gray mb-6">
                <label className="text-p-lg font-semibold text-c-secondary">
                  | Pupil Reaction
                </label>

                <div className="flex gap-6 mt-6">
                  <div>
                    <p className="text-c-gray3 font-medium text-p-sm">
                      PERRLA:
                    </p>
                    <select
                      name="pupil_reaction.perrla"
                      value={medformData.pupil_reaction.perrla}
                      onChange={(e) => handleChange(e, "pupil_reaction.perrla")}
                      className="mt-1 w-fit px-3 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                    >
                      <option value="" disabled className="text-c-gray3">
                        Select Status
                      </option>
                      <option value="Pupil Equal">Pupils Equal</option>
                      <option value="Pupil Unequal">Pupils Unequal</option>
                      <option value="Reactive">Reactive</option>
                    </select>
                  </div>

                  <div className="w-full">
                    <p className="text-c-gray3 font-medium text-p-sm">
                      Comment:
                    </p>
                    <input
                      type="text"
                      name="pupil_reaction.comment"
                      value={medformData.pupil_reaction.comment}
                      onChange={(e) =>
                        handleChange(e, "pupil_reaction.comment")
                      }
                      className="mt-1 w-full  px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                      placeholder="Enter your comment"
                    />
                  </div>
                </div>
              </section>
              <section className="p-2 md:p-6 bg-white rounded-lg border border-f-gray mb-6">
                <label className="text-p-lg font-semibold text-c-secondary">
                  | Internal Examination
                </label>
                <div className="mt-6">
                  <p className="text-c-gray3 font-medium text-p-sm">
                    Cup/Disc Ratio:
                  </p>
                  <div className="flex gap-6 mt-1">
                    <div className="flex flex-1 items-center  gap-1">
                      <p className="text-c-gray3 font-medium text-p-sm">OD</p>
                      <input
                        type="text"
                        name="internal_examination.cup_disc_ratio.od"
                        value={
                          medformData.internal_examination.cup_disc_ratio.od
                        }
                        onChange={(e) =>
                          handleChange(
                            e,
                            "internal_examination.cup_disc_ratio.od"
                          )
                        }
                        className="mt-1 w-full  px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                      />
                    </div>
                    <div className="flex flex-1 items-center gap-1">
                      <p className="text-c-gray3 font-medium text-p-sm">OS</p>
                      <input
                        type="text"
                        name="internal_examination.cup_disc_ratio.os"
                        value={
                          medformData.internal_examination.cup_disc_ratio.os
                        }
                        onChange={(e) =>
                          handleChange(
                            e,
                            "internal_examination.cup_disc_ratio.os"
                          )
                        }
                        className="mt-1 w-full  px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-c-gray3 font-medium text-p-sm">Vessel:</p>
                  <div className="flex gap-6 mt-1">
                    <div className="flex flex-1 items-center gap-1">
                      <p className="text-c-gray3 font-medium text-p-sm">OD</p>
                      <select
                        name="internal_examination.vessel.od"
                        value={medformData.internal_examination.vessel.od}
                        onChange={(e) =>
                          handleChange(e, "internal_examination.vessel.od")
                        }
                        className="mt-1 w-full px-3 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                      >
                        <option value="" disabled className="text-c-gray3">
                          Select Status
                        </option>
                        <option value="Normal">Normal</option>
                        <option value="Abnormal">Abnormal</option>
                        <option value="Ewan">Ewan</option>
                      </select>
                    </div>
                    <div className="flex flex-1 items-center gap-1">
                      <p className="text-c-gray3 font-medium text-p-sm">OS</p>
                      <select
                        name="internal_examination.vessel.os"
                        value={medformData.internal_examination.vessel.os}
                        onChange={(e) =>
                          handleChange(e, "internal_examination.vessel.os")
                        }
                        className="mt-1 w-full px-3 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                      >
                        <option value="" disabled className="text-c-gray3">
                          Select Status
                        </option>
                        <option value="Normal">Normal</option>
                        <option value="Abnormal">Abnormal</option>
                        <option value="Ewan">Ewan</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-c-gray3 font-medium text-p-sm">
                    Foveal Reflex:
                  </p>
                  <div className="flex gap-6 mt-1">
                    <div className="flex flex-1 items-center gap-1">
                      <p className="text-c-gray3 font-medium text-p-sm">OD</p>
                      <select
                        name="internal_examination.foveal_reflex.od"
                        value={
                          medformData.internal_examination.foveal_reflex.od
                        }
                        onChange={(e) =>
                          handleChange(
                            e,
                            "internal_examination.foveal_reflex.od"
                          )
                        }
                        className="mt-1 w-full px-3 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                      >
                        <option value="" disabled className="text-c-gray3">
                          Select Status
                        </option>
                        <option value="Present">Present</option>
                        <option value="Absent">Absent</option>
                      </select>
                    </div>
                    <div className="flex flex-1 items-center gap-1">
                      <p className="text-c-gray3 font-medium text-p-sm">OS</p>
                      <select
                        name="internal_examination.foveal_reflex.od"
                        value={
                          medformData.internal_examination.foveal_reflex.os
                        }
                        onChange={(e) =>
                          handleChange(
                            e,
                            "internal_examination.foveal_reflex.os"
                          )
                        }
                        className="mt-1 w-full px-3 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                      >
                        <option value="" disabled className="text-c-gray3">
                          Select Status
                        </option>
                        <option value="Present">Present</option>
                        <option value="Absent">Absent</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="mt-2 flex gap-6">
                  <div className="w-full">
                    <p className="text-c-gray3 font-medium text-p-sm">
                      Macula:
                    </p>
                    <select
                      name="internal_examination.macula"
                      value={medformData.internal_examination.macula}
                      onChange={(e) =>
                        handleChange(e, "internal_examination.macula")
                      }
                      className="mt-1 w-full px-3 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                    >
                      <option value="" disabled className="text-c-gray3">
                        Select Status
                      </option>
                      <option value="Present">Present</option>
                      <option value="Absent">Absent</option>
                    </select>
                  </div>
                  <div className="w-full">
                    <p className="text-c-gray3 font-medium text-p-sm">
                      Vitreous:
                    </p>
                    <select
                      name="internal_examination.vitreous"
                      value={medformData.internal_examination.vitreous}
                      onChange={(e) =>
                        handleChange(e, "internal_examination.vitreous")
                      }
                      className="mt-1 w-full px-3 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                    >
                      <option value="" disabled className="text-c-gray3">
                        Select Status
                      </option>
                      <option value="Present">Present</option>
                      <option value="Absent">Absent</option>
                    </select>
                  </div>
                  <div className="w-full">
                    <p className="text-c-gray3 font-medium text-p-sm">
                      Periphery:
                    </p>
                    <select
                      name="internal_examination.periphery"
                      value={medformData.internal_examination.periphery}
                      onChange={(e) =>
                        handleChange(e, "internal_examination.periphery")
                      }
                      className="mt-1 w-full px-3 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                    >
                      <option value="" disabled className="text-c-gray3">
                        Select Status
                      </option>
                      <option value="Present">Present</option>
                      <option value="Absent">Absent</option>
                    </select>
                  </div>
                </div>
              </section>

              <section className="p-2 md:p-6 bg-white rounded-lg border border-f-gray mb-6">
                <label className="text-p-lg font-semibold text-c-secondary">
                  | External Examination
                </label>
                <div className="mt-6">
                  <p className="text-c-gray3 font-medium text-p-sm">
                    Lids & Lashes:
                  </p>
                  <div className="flex gap-6 mt-1">
                    <div className="flex flex-1 items-center  gap-1">
                      <p className="text-c-gray3 font-medium text-p-sm">OD</p>
                      <input
                        type="text"
                        name="external_examination.lids_lashes.od"
                        value={medformData.external_examination.lids_lashes.od}
                        onChange={(e) =>
                          handleChange(e, "external_examination.lids_lashes.od")
                        }
                        className="mt-1 w-full  px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                        placeholder="Input here..."
                      />
                    </div>
                    <div className="flex flex-1 items-center gap-1">
                      <p className="text-c-gray3 font-medium text-p-sm">OS</p>
                      <input
                        type="text"
                        name="external_examination.lids_lashes.os"
                        value={medformData.external_examination.lids_lashes.os}
                        onChange={(e) =>
                          handleChange(e, "external_examination.lids_lashes.os")
                        }
                        className="mt-1 w-full  px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                        placeholder="Input here..."
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-c-gray3 font-medium text-p-sm">
                    Bulbar Conjunctiva:
                  </p>
                  <div className="flex gap-6 mt-1">
                    <div className="flex flex-1 items-center  gap-1">
                      <p className="text-c-gray3 font-medium text-p-sm">OD</p>
                      <input
                        type="text"
                        name="external_examination.bulbar_conjunctiva.od"
                        value={
                          medformData.external_examination.bulbar_conjunctiva.od
                        }
                        onChange={(e) =>
                          handleChange(
                            e,
                            "external_examination.bulbar_conjunctiva.od"
                          )
                        }
                        className="mt-1 w-full  px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                        placeholder="Input here..."
                      />
                    </div>
                    <div className="flex flex-1 items-center gap-1">
                      <p className="text-c-gray3 font-medium text-p-sm">OS</p>
                      <input
                        type="text"
                        name="external_examination_bulbar_conjunctiva.os"
                        value={
                          medformData.external_examination.bulbar_conjunctiva.os
                        }
                        onChange={(e) =>
                          handleChange(
                            e,
                            "external_examination.bulbar_conjunctiva.os"
                          )
                        }
                        className="mt-1 w-full  px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                        placeholder="Input here..."
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-c-gray3 font-medium text-p-sm">
                    Palpebral Conjunctiva:
                  </p>
                  <div className="flex gap-6 mt-1">
                    <div className="flex flex-1 items-center  gap-1">
                      <p className="text-c-gray3 font-medium text-p-sm">OD</p>
                      <input
                        type="text"
                        name="external_examination.palpebral_conjunctiva
                            .od"
                        value={
                          medformData.external_examination.palpebral_conjunctiva
                            .od
                        }
                        onChange={(e) =>
                          handleChange(
                            e,
                            "external_examination.palpebral_conjunctiva.od"
                          )
                        }
                        className="mt-1 w-full  px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                        placeholder="Input here..."
                      />
                    </div>
                    <div className="flex flex-1 items-center gap-1">
                      <p className="text-c-gray3 font-medium text-p-sm">OS</p>
                      <input
                        type="text"
                        name="external_examination.palpebral_conjunctiva.os"
                        value={
                          medformData.external_examination.palpebral_conjunctiva
                            .os
                        }
                        onChange={(e) =>
                          handleChange(
                            e,
                            "external_examination.palpebral_conjunctiva.os"
                          )
                        }
                        className="mt-1 w-full  px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                        placeholder="Input here..."
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-c-gray3 font-medium text-p-sm">Cornea:</p>
                  <div className="flex gap-6 mt-1">
                    <div className="flex flex-1 items-center  gap-1">
                      <p className="text-c-gray3 font-medium text-p-sm">OD</p>
                      <input
                        type="text"
                        name="external_examination.cornea.od"
                        value={medformData.external_examination.cornea.od}
                        onChange={(e) =>
                          handleChange(e, "external_examination.cornea.od")
                        }
                        className="mt-1 w-full  px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                        placeholder="Input here..."
                      />
                    </div>
                    <div className="flex flex-1 items-center gap-1">
                      <p className="text-c-gray3 font-medium text-p-sm">OS</p>
                      <input
                        type="text"
                        name="external_examination.cornea.os"
                        value={medformData.external_examination.cornea.os}
                        onChange={(e) =>
                          handleChange(e, "external_examination.cornea.os")
                        }
                        className="mt-1 w-full  px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                        placeholder="Input here..."
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <p className="text-c-gray3 font-medium text-p-sm">
                    Anterior Chamber:
                  </p>
                  <div className="flex gap-6 mt-1">
                    <div className="flex flex-1 items-center  gap-1">
                      <p className="text-c-gray3 font-medium text-p-sm">OD</p>
                      <input
                        type="text"
                        name="external_examination.anterior_chamber.od"
                        value={
                          medformData.external_examination.anterior_chamber.od
                        }
                        onChange={(e) =>
                          handleChange(
                            e,
                            "external_examination.anterior_chamber.od"
                          )
                        }
                        className="mt-1 w-full  px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                        placeholder="Input here..."
                      />
                    </div>
                    <div className="flex flex-1 items-center gap-1">
                      <p className="text-c-gray3 font-medium text-p-sm">OS</p>
                      <input
                        type="text"
                        name="external_examination.anterior_chamber.os"
                        value={
                          medformData.external_examination.anterior_chamber.os
                        }
                        onChange={(e) =>
                          handleChange(
                            e,
                            "external_examination.anterior_chamber.os"
                          )
                        }
                        className="mt-1 w-full  px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                        placeholder="Input here..."
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-c-gray3 font-medium text-p-sm">Iris:</p>
                  <div className="flex gap-6 mt-1">
                    <div className="flex flex-1 items-center  gap-1">
                      <p className="text-c-gray3 font-medium text-p-sm">OD</p>
                      <input
                        type="text"
                        name="external_examination.iris.od"
                        value={medformData.external_examination.iris.od}
                        onChange={(e) =>
                          handleChange(e, "external_examination.iris.od")
                        }
                        className="mt-1 w-full  px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                        placeholder="Input here..."
                      />
                    </div>
                    <div className="flex flex-1 items-center gap-1">
                      <p className="text-c-gray3 font-medium text-p-sm">OS</p>
                      <input
                        type="text"
                        name="external_examination.iris.os"
                        value={medformData.external_examination.iris.os}
                        onChange={(e) =>
                          handleChange(e, "external_examination.iris.os")
                        }
                        className="mt-1 w-full  px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                        placeholder="Input here..."
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <p className="text-c-gray3 font-medium text-p-sm">Lens:</p>
                  <div className="flex gap-6 mt-1">
                    <div className="flex flex-1 items-center  gap-1">
                      <p className="text-c-gray3 font-medium text-p-sm">OD</p>
                      <input
                        type="text"
                        name="external_examination.lens.od "
                        value={medformData.external_examination.lens.od}
                        onChange={(e) =>
                          handleChange(e, "external_examination.lens.od")
                        }
                        className="mt-1 w-full  px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                        placeholder="Input here..."
                      />
                    </div>
                    <div className="flex flex-1 items-center gap-1">
                      <p className="text-c-gray3 font-medium text-p-sm">OS</p>
                      <input
                        type="text"
                        name="external_examination.lens.os "
                        value={medformData.external_examination.lens.os}
                        onChange={(e) =>
                          handleChange(e, "external_examination.lens.os")
                        }
                        className="mt-1 w-full  px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                        placeholder="Input here..."
                      />
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}
          {currentCardIndex === 3 && (
            <div>
              <section className="p-2 md:p-6 bg-white rounded-lg border border-f-gray mb-6">
                <label className="text-p-lg font-semibold text-c-secondary">
                  | Objective Refraction
                </label>
                <div className="mt-6">
                  <p className="text-c-gray3 font-medium text-p-sm">
                    Static Retinoscopy (Net):
                  </p>
                  <div className="flex gap-6 mt-1">
                    <div className="flex flex-1 items-center  gap-1">
                      <p className="text-c-gray3 font-medium text-p-sm">OD</p>
                      <input
                        type="text"
                        name="objective_refraction.static_retinoscopy.od"
                        value={
                          medformData.objective_refraction.static_retinoscopy.od
                        }
                        onChange={(e) =>
                          handleChange(
                            e,
                            "objective_refraction.static_retinoscopy.od"
                          )
                        }
                        className="mt-1 w-full  px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                      />
                    </div>
                    <div className="flex flex-1 items-center gap-1">
                      <p className="text-c-gray3 font-medium text-p-sm">OS</p>
                      <input
                        type="text"
                        name="objective_refraction.static_retinoscopy.os"
                        value={
                          medformData.objective_refraction.static_retinoscopy.os
                        }
                        onChange={(e) =>
                          handleChange(
                            e,
                            "objective_refraction.static_retinoscopy.os"
                          )
                        }
                        className="mt-1 w-full  px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-c-gray3 font-medium text-p-sm">
                    Automated Refraction:
                  </p>
                  <div className="flex gap-6 mt-1">
                    <div className="flex flex-1 items-center  gap-1">
                      <p className="text-c-gray3 font-medium text-p-sm">OD</p>
                      <input
                        type="text"
                        name="objective_refraction.automated_refraction.od"
                        value={
                          medformData.objective_refraction.automated_refraction
                            .od
                        }
                        onChange={(e) =>
                          handleChange(
                            e,
                            "objective_refraction.automated_refraction.od"
                          )
                        }
                        className="mt-1 w-full  px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                      />
                    </div>
                    <div className="flex flex-1 items-center gap-1">
                      <p className="text-c-gray3 font-medium text-p-sm">OS</p>
                      <input
                        type="text"
                        name="objective_refraction.automated_refraction.os"
                        value={
                          medformData.objective_refraction.automated_refraction
                            .os
                        }
                        onChange={(e) =>
                          handleChange(
                            e,
                            "objective_refraction.automated_refraction.os"
                          )
                        }
                        className="mt-1 w-full  px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-c-gray3 font-medium text-p-sm">
                    Cup/Disc Ratio:
                  </p>
                  <div className="flex gap-6 mt-1">
                    <div className="flex flex-1 items-center  gap-1">
                      <p className="text-c-gray3 font-medium text-p-sm">OD</p>
                      <input
                        type="text"
                        name="objective_refraction.cup_disc_ratio.od"
                        value={
                          medformData.objective_refraction.cup_disc_ratio.od
                        }
                        onChange={(e) =>
                          handleChange(
                            e,
                            "objective_refraction.cup_disc_ratio.od"
                          )
                        }
                        className="mt-1 w-full  px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                      />
                    </div>
                    <div className="flex flex-1 items-center gap-1">
                      <p className="text-c-gray3 font-medium text-p-sm">OS</p>
                      <input
                        type="text"
                        name="objective_refraction.cup_disc_ratio.os"
                        value={
                          medformData.objective_refraction.cup_disc_ratio.os
                        }
                        onChange={(e) =>
                          handleChange(
                            e,
                            "objective_refraction.cup_disc_ratio.os"
                          )
                        }
                        className="mt-1 w-full  px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                      />
                    </div>
                    <div className="flex flex-1 items-center  gap-1">
                      <p className="text-c-gray3 font-medium text-p-sm">OU</p>
                      <input
                        type="text"
                        name="objective_refraction.cup_disc_ratio.ou"
                        value={
                          medformData.objective_refraction.cup_disc_ratio.ou
                        }
                        onChange={(e) =>
                          handleChange(
                            e,
                            "objective_refraction.cup_disc_ratio.ou"
                          )
                        }
                        className="mt-1 w-full  px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                      />
                    </div>
                  </div>
                </div>
              </section>
              <section className="p-2 md:p-6 bg-white rounded-lg border border-f-gray mb-6">
                <label className="text-p-lg font-semibold text-c-secondary">
                  | Subjective Refraction
                </label>
                <div className="mt-6">
                  <p className="text-c-gray3 font-medium text-p-sm">
                    Near ADD:
                  </p>
                  <div className="flex gap-6 mt-1">
                    <div className="flex flex-1 items-center  gap-1">
                      <p className="text-c-gray3 font-medium text-p-sm">OD</p>
                      <input
                        type="text"
                        name="subjective_refraction.near_add.od"
                        value={medformData.subjective_refraction.near_add.od}
                        onChange={(e) =>
                          handleChange(e, "subjective_refraction.near_add.od")
                        }
                        className="mt-1 w-full  px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                      />
                    </div>
                    <div className="flex flex-1 items-center gap-1">
                      <p className="text-c-gray3 font-medium text-p-sm">OS</p>
                      <input
                        type="text"
                        name="subjective_refraction.near_add.os"
                        value={medformData.subjective_refraction.near_add.os}
                        onChange={(e) =>
                          handleChange(e, "subjective_refraction.near_add.os")
                        }
                        className="mt-1 w-full  px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                      />
                    </div>
                    <div className="flex flex-1 items-center gap-1">
                      <p className="text-c-gray3 font-medium text-p-sm">OU</p>
                      <input
                        type="text"
                        name="subjective_refraction.near_add.ou"
                        value={medformData.subjective_refraction.near_add.ou}
                        onChange={(e) =>
                          handleChange(e, "subjective_refraction.near_add.ou")
                        }
                        className="mt-1 w-full  px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-c-gray3 font-medium text-p-sm">
                    Total Near Correction:
                  </p>
                  <div className="flex gap-6 mt-1">
                    <div className="flex flex-1 items-center  gap-1">
                      <p className="text-c-gray3 font-medium text-p-sm">OD</p>
                      <input
                        type="text"
                        name="subjective_refraction.total_near_correction.od"
                        value={
                          medformData.subjective_refraction
                            .total_near_correction.od
                        }
                        onChange={(e) =>
                          handleChange(
                            e,
                            "subjective_refraction.total_near_correction.od"
                          )
                        }
                        className="mt-1 w-full  px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                      />
                    </div>
                    <div className="flex flex-1 items-center gap-1">
                      <p className="text-c-gray3 font-medium text-p-sm">OS</p>
                      <input
                        type="text"
                        name="subjective_refraction.total_near_correction.os"
                        value={
                          medformData.subjective_refraction
                            .total_near_correction.os
                        }
                        onChange={(e) =>
                          handleChange(
                            e,
                            "subjective_refraction.total_near_correction.os"
                          )
                        }
                        className="mt-1 w-full  px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                      />
                    </div>
                    <div className="flex flex-1 items-center gap-1">
                      <p className="text-c-gray3 font-medium text-p-sm">OU</p>
                      <input
                        type="text"
                        name="subjective_refraction.total_near_correction.ou"
                        value={
                          medformData.subjective_refraction
                            .total_near_correction.ou
                        }
                        onChange={(e) =>
                          handleChange(
                            e,
                            "subjective_refraction.total_near_correction.ou"
                          )
                        }
                        className="mt-1 w-full  px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                      />
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}
          {currentCardIndex === 4 && (
            <div>
              <section className="p-2 md:p-6 bg-white rounded-lg border border-f-gray mb-6">
                <label className="text-p-lg font-semibold text-c-secondary">
                  | Visual Field & Stereopsis Tests
                </label>
                <div className="mt-6">
                  <p className="text-c-gray3 font-medium text-p-sm">
                    Confrontation Test:
                  </p>
                  <div className="flex gap-6 mt-1">
                    <div className="flex flex-1 items-center  gap-1">
                      <p className="text-c-gray3 font-medium text-p-sm">OD</p>
                      <select
                        name="visual_field_stereopsis_test.confrontation_test.od"
                        value={
                          medformData.visual_field_stereopsis_test
                            .confrontation_test.od
                        }
                        onChange={(e) =>
                          handleChange(
                            e,
                            "visual_field_stereopsis_test.confrontation_test.od"
                          )
                        }
                        className="mt-1 w-full px-3 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                      >
                        <option value="" disabled className="text-c-gray3">
                          Select Status
                        </option>
                        <option value="Full Field">Full Field</option>
                        <option value="Restricted">Restricted</option>
                      </select>
                    </div>
                    <div className="flex flex-1 items-center gap-1">
                      <p className="text-c-gray3 font-medium text-p-sm">OS</p>
                      <select
                        name="visual_field_stereopsis_test.confrontation_test.os"
                        value={
                          medformData.visual_field_stereopsis_test
                            .confrontation_test.os
                        }
                        onChange={(e) =>
                          handleChange(
                            e,
                            "visual_field_stereopsis_test.confrontation_test.od"
                          )
                        }
                        className="mt-1 w-full px-3 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                      >
                        <option value="" disabled className="text-c-gray3">
                          Select Status
                        </option>
                        <option value="Full Field">Full Field</option>
                        <option value="Restricted">Restricted</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-c-gray3 font-medium text-p-sm">
                    Facial Amsler:
                  </p>
                  <div className="flex gap-6 mt-1">
                    <div className="flex flex-1 items-center  gap-1">
                      <p className="text-c-gray3 font-medium text-p-sm">OD</p>
                      <select
                        name="visual_field_stereopsis_test.facial_amsler.od"
                        value={
                          medformData.visual_field_stereopsis_test.facial_amsler
                            .od
                        }
                        onChange={(e) =>
                          handleChange(
                            e,
                            "visual_field_stereopsis_test.facial_amsler.od"
                          )
                        }
                        className="mt-1 w-full px-3 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                      >
                        <option value="" disabled className="text-c-gray3">
                          Select Status
                        </option>
                        <option value="Full Field">Full Field</option>
                        <option value="Restricted">Restricted</option>
                      </select>
                    </div>
                    <div className="flex flex-1 items-center gap-1">
                      <p className="text-c-gray3 font-medium text-p-sm">OS</p>
                      <select
                        name="visual_field_stereopsis_test.facial_amsler.os"
                        value={
                          medformData.visual_field_stereopsis_test.facial_amsler
                            .os
                        }
                        onChange={(e) =>
                          handleChange(
                            e,
                            "visual_field_stereopsis_test.facial_amsler.os"
                          )
                        }
                        className="mt-1 w-full px-3 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                      >
                        <option value="" disabled className="text-c-gray3">
                          Select Status
                        </option>
                        <option value="Full Field">Full Field</option>
                        <option value="Restricted">Restricted</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-c-gray3 font-medium text-p-sm">
                    Stereopsis:
                  </p>
                  <select
                    name="visual_field_stereopsis_test.stereopsis"
                    value={medformData.visual_field_stereopsis_test.stereopsis}
                    onChange={(e) =>
                      handleChange(e, "visual_field_stereopsis_test.stereopsis")
                    }
                    className="mt-1 w-1/2 px-3 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                  >
                    <option value="" disabled className="text-c-gray3">
                      Select Status
                    </option>
                    <option value="40 Arc Seconds">40 Arc Seconds</option>
                    <option value="-">-</option>
                  </select>
                </div>
              </section>
              <section className="p-2 md:p-6 bg-white rounded-lg border border-f-gray mb-6">
                <label className="text-p-lg font-semibold text-c-secondary">
                  | Additional Notes
                </label>
                <div className="mt-6">
                  <textarea
                    type="text"
                    name="additional_note"
                    value={medformData.additional_note}
                    onChange={(e) => handleChange(e, "additional_note")}
                    className="mt-1 w-full px-4 py-3 h-52 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                    placeholder="Enter additional notes"
                  />
                </div>
              </section>
            </div>
          )}
        </form>
        <div className="flex justify-end px-3 py-6">
          {currentCardIndex > 0 && (
            <button
              className="px-8 py-2 text-c-secondary text-p-rg font-semibold rounded-md"
              onClick={handleBack}
            >
              Back
            </button>
          )}

          {currentCardIndex < 4 ? (
            <button
              className="ml-2 px-8 py-2 bg-c-secondary text-f-light text-p-rg font-semibold rounded-md hover:bg-hover-c-secondary active:bg-pressed-c-secondary"
              onClick={handleNext}
            >
              Next
            </button>
          ) : (
            <button
              className="ml-2 px-8 py-2 bg-c-secondary text-f-light text-p-rg font-semibold rounded-md hover:bg-hover-c-secondary active:bg-pressed-c-secondary"
              onClick={handleSubmit}
            >
              Save
            </button>
          )}
        </div>
      </div>
      <nav className="flex flex-col gap-4 w-full md:w-64 h-72 bg-white border border-f-gray rounded-lg items-center justify-center">
        <h1
          className={`cursor-pointer ${
            currentCardIndex === 0 ? "font-bold" : ""
          }`}
          onClick={() => setCurrentCardIndex(0)}
        >
          Page 1
        </h1>
        <h1
          className={`cursor-pointer ${
            currentCardIndex === 1 ? "font-bold" : ""
          }`}
          onClick={() => setCurrentCardIndex(1)}
        >
          Page 2
        </h1>
        <h1
          className={`cursor-pointer ${
            currentCardIndex === 2 ? "font-bold" : ""
          }`}
          onClick={() => setCurrentCardIndex(2)}
        >
          Page 3
        </h1>
        <h1
          className={`cursor-pointer ${
            currentCardIndex === 3 ? "font-bold" : ""
          }`}
          onClick={() => setCurrentCardIndex(3)}
        >
          Page 4
        </h1>
        <h1
          className={`cursor-pointer ${
            currentCardIndex === 4 ? "font-bold" : ""
          }`}
          onClick={() => setCurrentCardIndex(4)}
        >
          Page 5
        </h1>
      </nav>
    </div>
  );
};

export default MedForm;
