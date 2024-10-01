import React, { useState } from "react";

const MedForm = () => {
  const [medformData, setMedformData] = useState({
    initial_observation: "",
    chief_complaints: "",
    occular_history: "",
    date_eyeexam: "",
    gen_healthx: "",
    date_medexam: "",
    bp: "",
    bg: "",
    hr: "",
    os: "",
    temperature: "",
    havitual_va_od: "",
    havitual_va_os: "",
    havitual_va_ou: "",
    unaided_va_od: "",
    unaided_va_os: "",
    unaided_va_ou: "",
    pinhole_va_od: "",
    pinhole_va_os: "",
    pinhole_va_ou: "",
    dateprescribe: "",
    habitual_prescription_od: "",
    habitual_prescription_os: "",
    habitual_prescription_ou: "",
    pupillary_prescription_od: "",
    pupillary_prescription_os: "",
    pupillary_prescription_ou: "",
    ct_w_distance_od: "",
    ct_w_near_od: "",
    ct_wo_distance_od: "",
    ct_wo_near_od: "",
    ct_w_distance_os: "",
    ct_w_near_os: "",
    ct_wo_distance_os: "",
    ct_wo_near_os: "",
    crt_present_od: "",
    crt_absent_od: "",
    crt_present_os: "",
    crt_absent_os: "",
    diplopia_right: "",
    diplopia_left: "",
    deh_right_hand: "",
    deh_left_hand: "",
    deh_right_eye: "",
    deh_left_eye: "",
    perrla: "",
    comment: "",
    p2_cdr_od: "",
    p2_cdr_os: "",
    vessel_od: "",
    vessel_os: "",
    fr_od: "",
    fr_os: "",
    macula: "",
    vitreous: "",
    periphery: "",
    lidslashes_od: "",
    lidslashes_os: "",
    bulbar_conjunctiva_od: "",
    bulbar_conjunctiva_os: "",
    palpebral_conjunctiva_od: "",
    palpebral_conjunctiva_os: "",
    cornea_od: "",
    cornea_os: "",
    anterior_chamber_od: "",
    anterior_chamber_os: "",
    lens_os: "",
    lens_od: "",
    iris_os: "",
    iris_od: "",
    static_retinoscopy_od: "",
    static_retinoscopy_os: "",
    automated_refraction_od: "",
    automated_refraction_os: "",
    p3_cdr_od: "",
    p3_cdr_os: "",
    p3_cdr_ou: "",
    nearadd_od: "",
    nearadd_os: "",
    nearadd_ou: "",
    total_near_od: "",
    total_near_os: "",
    total_near_ou: "",
    comfornt_test_od: "",
    comfornt_test_os: "",
    facial_amsler_od: "",
    facial_amsler_os: "",
    stereopsis: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
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

  return (
    <div className="w-full p-2 md:p-8 flex flex-col-reverse lg:flex-row bg-bg-mc gap-8">
      <div className="w-full lg:w-[calc(100%-288px)]">
        <form>
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
                  placeholder="enter your initial observation"
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
                    placeholder="enter your initial observation"
                  />
                </div>
                <div className="mt-6 p-2 md:p-4 bg-bg-sb rounded-lg flex gap-4">
                  <div className="w-full">
                    <p className="text-c-gray3 font-medium text-p-sm">
                      Occular History
                    </p>
                    <textarea
                      type="text"
                      name="occular_history"
                      value={medformData.occular_history}
                      onChange={handleChange}
                      className="mt-1 h-20 w-full px-4 py-3 border border-c-gray3 rounded-md text-f-dark focus:outline-c-primary"
                      placeholder="enter your occular obhshshs"
                    />
                  </div>
                  <div>
                    <p className="text-c-gray3 font-medium text-p-sm">
                      Date of last Eye Exam:
                    </p>
                    <input
                      type="date"
                      name="date_eyeexam"
                      value={medformData.date_eyeexam}
                      onChange={handleChange}
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
                      name="gen_healthx"
                      value={medformData.gen_healthx}
                      onChange={handleChange}
                      className="mt-1 h-20 w-full px-4 py-3 border border-c-gray3 rounded-md text-f-dark focus:outline-c-primary"
                      placeholder="enter your initial observation"
                    />
                  </div>
                  <div>
                    <p className="text-c-gray3 font-medium text-p-sm">
                      Date of last Medical Exam:
                    </p>
                    <input
                      type="date"
                      name="date_medexam"
                      value={medformData.date_medexam}
                      onChange={handleChange}
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
                      name="os"
                      value={medformData.os}
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
                      name="havitual_va_od"
                      value={medformData.havitual_va_od}
                      onChange={handleChange}
                      className="px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                      placeholder="20/30"
                    />
                    <input
                      type="text"
                      name="havitual_va_os"
                      value={medformData.havitual_va_os}
                      onChange={handleChange}
                      className="px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                      placeholder="20/30"
                    />
                    <input
                      type="text"
                      name="havitual_va_ou"
                      value={medformData.havitual_va_ou}
                      onChange={handleChange}
                      className="px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                      placeholder="20/30"
                    />

                    <div className="text-p-rg text-f-dark">Unaided VA</div>
                    <input
                      type="text"
                      name="unaided_va_od"
                      value={medformData.unaided_va_od}
                      onChange={handleChange}
                      className="px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                      placeholder="20/30"
                    />
                    <input
                      type="text"
                      name="unaided_va_os"
                      value={medformData.unaided_va_os}
                      onChange={handleChange}
                      className="px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                      placeholder="20/30"
                    />
                    <input
                      type="text"
                      name="unaided_va_ou"
                      value={medformData.unaided_va_ou}
                      onChange={handleChange}
                      className="px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                      placeholder="20/30"
                    />

                    <div className="text-p-rg text-f-dark">Pinhole VA</div>
                    <input
                      type="text"
                      name="pinhole_va_od"
                      value={medformData.pinhole_va_od}
                      onChange={handleChange}
                      className="px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                      placeholder="20/30"
                    />
                    <input
                      type="text"
                      name="pinhole_va_os"
                      value={medformData.pinhole_va_os}
                      onChange={handleChange}
                      className="px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                      placeholder="20/30"
                    />
                    <input
                      type="text"
                      name="pinhole_va_ou"
                      value={medformData.pinhole_va_ou}
                      onChange={handleChange}
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
                    name="dateprescribe"
                    value={medformData.dateprescribe}
                    onChange={handleChange}
                    className="mt-1 w-fit h-fit px-4 py-3 border border-c-gray3 rounded-md text-f-dark focus:outline-c-primary"
                  />

                  <div className="flex justify-between mt-6">
                    <div>
                      <p className="text-c-gray3 font-medium text-p-sm">OD:</p>
                      <input
                        type="text"
                        name="habitual_prescription_od"
                        value={medformData.habitual_prescription_od}
                        onChange={handleChange}
                        className="mt-1 w-20 lg:w-full  px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                      />
                    </div>
                    <div>
                      <p className="text-c-gray3 font-medium text-p-sm">OS:</p>
                      <input
                        type="text"
                        name="habitual_prescription_os"
                        value={medformData.habitual_prescription_os}
                        onChange={handleChange}
                        className="mt-1 w-20 lg:w-full  px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                      />
                    </div>
                    <div>
                      <p className="text-c-gray3 font-medium text-p-sm">OU:</p>
                      <input
                        type="text"
                        name="habitual_prescription_ou"
                        value={medformData.habitual_prescription_ou}
                        onChange={handleChange}
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
                      name="pupillary_prescription_o"
                      value={medformData.pupillary_prescription_od}
                      onChange={handleChange}
                      className="mt-1 w-20 lg:w-full  px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                    />
                  </div>
                  <div>
                    <p className="text-c-gray3 font-medium text-p-sm">OS:</p>
                    <input
                      type="text"
                      name="pupillary_prescription_os"
                      value={medformData.pupillary_prescription_os}
                      onChange={handleChange}
                      className="mt-1 w-20 lg:w-full  px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                    />
                  </div>
                  <div>
                    <p className="text-c-gray3 font-medium text-p-sm">OU:</p>
                    <input
                      type="text"
                      name="pupillary_prescription_ou"
                      value={medformData.pupillary_prescription_ou}
                      onChange={handleChange}
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
                          name="ct_w_distance_od"
                          value={medformData.ct_w_distance_od}
                          onChange={handleChange}
                          className="w-6 h-6"
                        />
                        <span className="text-c-gray3 font-medium text-p-sm">
                          With Rx - Distance
                        </span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          name="ct_w_near_od"
                          value={medformData.ct_w_near_od}
                          onChange={handleChange}
                          className="w-6 h-6"
                        />
                        <span className="text-c-gray3 font-medium text-p-sm">
                          With Rx - Near
                        </span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          name="ct_wo_distance_od"
                          value={medformData.ct_wo_distance_od}
                          onChange={handleChange}
                          className="w-6 h-6"
                        />
                        <span className="text-c-gray3 font-medium text-p-sm">
                          Without Rx - Near
                        </span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          name="ct_wo_near_od"
                          value={medformData.ct_wo_near_od}
                          onChange={handleChange}
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
                          name="ct_w_distance_os"
                          value={medformData.ct_w_distance_os}
                          onChange={handleChange}
                          className="w-6 h-6"
                        />
                        <span className="text-c-gray3 font-medium text-p-sm">
                          With Rx - Distance
                        </span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          name="ct_w_near_os"
                          value={medformData.ct_w_near_os}
                          onChange={handleChange}
                          className="w-6 h-6"
                        />
                        <span className="text-c-gray3 font-medium text-p-sm">
                          With Rx - Near
                        </span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          name="ct_wo_distance_os"
                          value={medformData.ct_wo_distance_os}
                          onChange={handleChange}
                          className="w-6 h-6"
                        />
                        <span className="text-c-gray3 font-medium text-p-sm">
                          Without Rx - Near
                        </span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          name="medformData.ct_wo_near_os"
                          value={medformData.ct_wo_near_os}
                          onChange={handleChange}
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
                            name="crt_present_od"
                            value={medformData.crt_present_od}
                            className="mr-2 w-6 h-6"
                          />
                          <span className="text-c-gray3 font-medium text-p-sm">
                            Present
                          </span>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="radio"
                            name="crt_absent_od"
                            value={medformData.crt_absent_od}
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
                            ame="crt_present_os"
                            value={medformData.crt_present_os}
                            className="mr-2 w-6 h-6"
                          />
                          <span className="text-c-gray3 font-medium text-p-sm">
                            Present
                          </span>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="radio"
                            name="crt_absent_os"
                            value={medformData.crt_absent_os}
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
                          name="deh_left_eye"
                          value={medformData.deh_left_eye}
                          className="mr-2 w-6 h-6"
                        />
                        <span className="text-c-gray3 font-medium text-p-sm">
                          Left
                        </span>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="deh_right_eye"
                          value={medformData.deh_right_eye}
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
                          name="deh_left_hand "
                          value={medformData.deh_left_hand}
                          className="mr-2 w-6 h-6"
                        />
                        <span className="text-c-gray3 font-medium text-p-sm">
                          Left
                        </span>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="deh_right_hand"
                          value={medformData.deh_right_hand}
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
                      name="diplopia_left"
                      value={medformData.diplopia_left}
                      className="mr-2 w-6 h-6"
                    />
                    <span className="text-c-gray3 font-medium text-p-sm">
                      Left
                    </span>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="diplopia_right"
                      value={medformData.diplopia_right}
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
                      name="perrla"
                      value={medformData.perrla}
                      onChange={handleChange}
                      className="mt-1 w-fit px-3 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                    >
                      <option value="" disabled className="text-c-gray3">
                        Select Status
                      </option>
                      <option value="Pupil Equal">Pupils Equal</option>
                      <option value="-">-</option>
                      <option value="-">-</option>
                    </select>
                  </div>
                  <div className="w-full">
                    <p className="text-c-gray3 font-medium text-p-sm">
                      Comment:
                    </p>
                    <input
                      type="text"
                      name="comment"
                      value={medformData.comment}
                      onChange={handleChange}
                      className="mt-1 w-full  px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                      placeholder="Enter middle name"
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
                        name="p2_cdr_od"
                        value={medformData.p2_cdr_od}
                        onChange={handleChange}
                        className="mt-1 w-full  px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                        placeholder="Enter middle name"
                      />
                    </div>
                    <div className="flex flex-1 items-center gap-1">
                      <p className="text-c-gray3 font-medium text-p-sm">OS</p>
                      <input
                        type="text"
                        name="p2_cdr_os"
                        value={medformData.p2_cdr_os}
                        onChange={handleChange}
                        className="mt-1 w-full  px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                        placeholder="Enter middle name"
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
                        name="vessel_od"
                        value={medformData.vessel_od}
                        onChange={handleChange}
                        className="mt-1 w-full px-3 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                      >
                        <option value="" disabled className="text-c-gray3">
                          Select Status
                        </option>
                        <option value="Normal">Normal</option>
                        <option value="-">-</option>
                        <option value="-">-</option>
                      </select>
                    </div>
                    <div className="flex flex-1 items-center gap-1">
                      <p className="text-c-gray3 font-medium text-p-sm">OS</p>
                      <select
                        name="vessel_os"
                        value={medformData.vessel_os}
                        onChange={handleChange}
                        className="mt-1 w-full px-3 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                      >
                        <option value="" disabled className="text-c-gray3">
                          Select Status
                        </option>
                        <option value="Normal">Normal</option>
                        <option value="-">-</option>
                        <option value="-">-</option>
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
                        name="fr_od"
                        value={medformData.fr_od}
                        onChange={handleChange}
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
                        name="fr_os"
                        value={medformData.fr_os}
                        onChange={handleChange}
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
                      name="macula"
                      value={medformData.macula}
                      onChange={handleChange}
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
                      name="vitreous"
                      value={medformData.vitreous}
                      onChange={handleChange}
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
                      name="periphery"
                      value={medformData.periphery}
                      onChange={handleChange}
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
                        name="lidslashes_od"
                        value={medformData.lidslashes_od}
                        onChange={handleChange}
                        className="mt-1 w-full  px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                        placeholder="Enter middle name"
                      />
                    </div>
                    <div className="flex flex-1 items-center gap-1">
                      <p className="text-c-gray3 font-medium text-p-sm">OS</p>
                      <input
                        type="text"
                        name="lidslashes_os"
                        value={medformData.lidslashes_os}
                        onChange={handleChange}
                        className="mt-1 w-full  px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                        placeholder="Enter middle name"
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
                        name="bulbar_conjunctiva_od"
                        value={medformData.bulbar_conjunctiva_od}
                        onChange={handleChange}
                        className="mt-1 w-full  px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                        placeholder="Enter middle name"
                      />
                    </div>
                    <div className="flex flex-1 items-center gap-1">
                      <p className="text-c-gray3 font-medium text-p-sm">OS</p>
                      <input
                        type="text"
                        name="bulbar_conjunctiva_os"
                        value={medformData.bulbar_conjunctiva_os}
                        onChange={handleChange}
                        className="mt-1 w-full  px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                        placeholder="Enter middle name"
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
                        name="palpebral_conjunctiva_od"
                        value={medformData.palpebral_conjunctiva_od}
                        onChange={handleChange}
                        className="mt-1 w-full  px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                        placeholder="Enter middle name"
                      />
                    </div>
                    <div className="flex flex-1 items-center gap-1">
                      <p className="text-c-gray3 font-medium text-p-sm">OS</p>
                      <input
                        type="text"
                        name="palpebral_conjunctiva_os"
                        value={medformData.palpebral_conjunctiva_os}
                        onChange={handleChange}
                        className="mt-1 w-full  px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                        placeholder="Enter middle name"
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
                        name="cornea_od"
                        value={medformData.cornea_od}
                        onChange={handleChange}
                        className="mt-1 w-full  px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                        placeholder="Enter middle name"
                      />
                    </div>
                    <div className="flex flex-1 items-center gap-1">
                      <p className="text-c-gray3 font-medium text-p-sm">OS</p>
                      <input
                        type="text"
                        name="cornea_os"
                        value={medformData.cornea_os}
                        onChange={handleChange}
                        className="mt-1 w-full  px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                        placeholder="Enter middle name"
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
                        name="anterior_chamber_od"
                        value={medformData.anterior_chamber_od}
                        onChange={handleChange}
                        className="mt-1 w-full  px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                        placeholder="Enter middle name"
                      />
                    </div>
                    <div className="flex flex-1 items-center gap-1">
                      <p className="text-c-gray3 font-medium text-p-sm">OS</p>
                      <input
                        type="text"
                        name="anterior_chamber_os"
                        value={medformData.anterior_chamber_os}
                        onChange={handleChange}
                        className="mt-1 w-full  px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                        placeholder="Enter middle name"
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
                        name="iris_od"
                        value={medformData.iris_od}
                        onChange={handleChange}
                        className="mt-1 w-full  px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                        placeholder="Enter middle name"
                      />
                    </div>
                    <div className="flex flex-1 items-center gap-1">
                      <p className="text-c-gray3 font-medium text-p-sm">OS</p>
                      <input
                        type="text"
                        name="iris_os"
                        value={medformData.iris_os}
                        onChange={handleChange}
                        className="mt-1 w-full  px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                        placeholder="Enter middle name"
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
                        name="lens_od "
                        value={medformData.lens_od}
                        onChange={handleChange}
                        className="mt-1 w-full  px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                        placeholder="Enter middle name"
                      />
                    </div>
                    <div className="flex flex-1 items-center gap-1">
                      <p className="text-c-gray3 font-medium text-p-sm">OS</p>
                      <input
                        type="text"
                        name="lens_os "
                        value={medformData.lens_os}
                        onChange={handleChange}
                        className="mt-1 w-full  px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                        placeholder="Enter middle name"
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
                        name="static_retinoscopy_od"
                        value={medformData.static_retinoscopy_od}
                        onChange={handleChange}
                        className="mt-1 w-full  px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                      />
                    </div>
                    <div className="flex flex-1 items-center gap-1">
                      <p className="text-c-gray3 font-medium text-p-sm">OS</p>
                      <input
                        type="text"
                        name="static_retinoscopy_os"
                        value={medformData.static_retinoscopy_os}
                        onChange={handleChange}
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
                        name="automated_refraction_od"
                        value={medformData.automated_refraction_od}
                        onChange={handleChange}
                        className="mt-1 w-full  px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                      />
                    </div>
                    <div className="flex flex-1 items-center gap-1">
                      <p className="text-c-gray3 font-medium text-p-sm">OS</p>
                      <input
                        type="text"
                        name="automated_refraction_os"
                        value={medformData.automated_refraction_os}
                        onChange={handleChange}
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
                        name="p3_cdr_od"
                        value={medformData.p3_cdr_od}
                        onChange={handleChange}
                        className="mt-1 w-full  px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                      />
                    </div>
                    <div className="flex flex-1 items-center gap-1">
                      <p className="text-c-gray3 font-medium text-p-sm">OS</p>
                      <input
                        type="text"
                        name="p3_cdr_os"
                        value={medformData.p3_cdr_os}
                        onChange={handleChange}
                        className="mt-1 w-full  px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                      />
                    </div>
                    <div className="flex flex-1 items-center  gap-1">
                      <p className="text-c-gray3 font-medium text-p-sm">OU</p>
                      <input
                        type="text"
                        name="p3_cdr_ou"
                        value={medformData.p3_cdr_ou}
                        onChange={handleChange}
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
                        name="nearadd_od"
                        value={medformData.nearadd_od}
                        onChange={handleChange}
                        className="mt-1 w-full  px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                      />
                    </div>
                    <div className="flex flex-1 items-center gap-1">
                      <p className="text-c-gray3 font-medium text-p-sm">OS</p>
                      <input
                        type="text"
                        name="nearadd_os"
                        value={medformData.nearadd_os}
                        onChange={handleChange}
                        className="mt-1 w-full  px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                      />
                    </div>
                    <div className="flex flex-1 items-center gap-1">
                      <p className="text-c-gray3 font-medium text-p-sm">OU</p>
                      <input
                        type="text"
                        name="nearadd_ou"
                        value={medformData.nearadd_ou}
                        onChange={handleChange}
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
                        name="total_near_od"
                        value={medformData.total_near_od}
                        onChange={handleChange}
                        className="mt-1 w-full  px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                      />
                    </div>
                    <div className="flex flex-1 items-center gap-1">
                      <p className="text-c-gray3 font-medium text-p-sm">OS</p>
                      <input
                        type="text"
                        name="total_near_os"
                        value={medformData.total_near_os}
                        onChange={handleChange}
                        className="mt-1 w-full  px-4 py-3 border border-c-gray3 rounded-md text-f-dark mb-4 focus:outline-c-primary"
                      />
                    </div>
                    <div className="flex flex-1 items-center gap-1">
                      <p className="text-c-gray3 font-medium text-p-sm">OU</p>
                      <input
                        type="text"
                        name="total_near_ou"
                        value={medformData.total_near_ou}
                        onChange={handleChange}
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
                        name="comfornt_test_od"
                        value={medformData.comfornt_test_od}
                        onChange={handleChange}
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
                        name="comfornt_test_os"
                        value={medformData.comfornt_test_os}
                        onChange={handleChange}
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
                        name="facial_amsler_od"
                        value={medformData.civil_status}
                        onChange={handleChange}
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
                        name="facial_amsler_os"
                        value={medformData.facial_amsler_os}
                        onChange={handleChange}
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
                    name="stereopsis"
                    value={medformData.stereopsis}
                    onChange={handleChange}
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
            <button className="ml-2 px-8 py-2 bg-c-secondary text-f-light text-p-rg font-semibold rounded-md hover:bg-hover-c-secondary active:bg-pressed-c-secondary">
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
