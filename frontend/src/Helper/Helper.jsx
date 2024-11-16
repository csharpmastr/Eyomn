export const cleanData = (data) => {
  const cleanedData = {};

  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      const value = data[key];

      if (typeof value === "object" && value !== null) {
        const nestedCleanedData = cleanData(value);

        if (Object.keys(nestedCleanedData).length > 0) {
          cleanedData[key] = nestedCleanedData;
        }
      } else if (value !== "" && value !== null && value !== false) {
        cleanedData[key] = value;
      }
    }
  }

  return cleanedData;
};

export const calculateAge = (birthdate) => {
  if (!birthdate) return null;
  const birthDateObj = new Date(birthdate);
  const today = new Date();
  let age = today.getFullYear() - birthDateObj.getFullYear();
  const monthDiff = today.getMonth() - birthDateObj.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDateObj.getDate())
  ) {
    age--;
  }
  return age;
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

export const mergeDeep = (target, source) => {
  for (const key in target) {
    if (source && source[key] !== undefined) {
      if (
        typeof source[key] === "object" &&
        !Array.isArray(source[key]) &&
        source[key] !== null
      ) {
        target[key] = mergeDeep(target[key], source[key]);
      } else if (source[key] !== "") {
        target[key] = source[key];
      }
    }
  }
  return target;
};

export const formatPatientNotes = (data) => {
  const notes = [];

  if (data.initial_observation && data.initial_observation.options) {
    const selectedOptions = Object.keys(data.initial_observation.options)
      .filter((option) => data.initial_observation.options[option])
      .join(", ");

    if (selectedOptions) {
      const initialObservation = `Initial Observations: ${selectedOptions}`;
      notes.push(initialObservation);
    }

    if (data.initial_observation.additional_note) {
      notes.push(
        `Additional Note: ${data.initial_observation.additional_note}`
      );
    }
  }

  if (data.general_health_hx) {
    const generalHealthHx = `General Health History: ${Object.keys(
      data.general_health_hx.option
    )
      .filter((option) => data.general_health_hx.option[option])
      .join(", ")}`;
    notes.push(generalHealthHx);
    if (data.general_health_hx.last_exam) {
      notes.push(`Last Exam: ${data.general_health_hx.last_exam}`);
    }
    if (data.general_health_hx.additional_note) {
      notes.push(`Additional Note: ${data.general_health_hx.additional_note}`);
    }
  }

  if (data.occular_history) {
    const ocularHistory = `Ocular History: ${Object.keys(
      data.occular_history.option
    )
      .filter((option) => data.occular_history.option[option])
      .join(", ")}`;
    notes.push(ocularHistory);
    if (data.occular_history.last_exam) {
      notes.push(`Last Exam: ${data.occular_history.last_exam}`);
    }
    if (data.occular_history.additional_note) {
      notes.push(`Additional Note: ${data.occular_history.additional_note}`);
    }
  }

  if (data.fam_occular_history) {
    const famOcularHistory = `Family Ocular History: ${Object.keys(
      data.fam_occular_history.option
    )
      .filter((option) => data.fam_occular_history.option[option])
      .join(", ")}`;
    notes.push(famOcularHistory);
    if (data.fam_occular_history.additional_note) {
      notes.push(
        `Additional Note: ${data.fam_occular_history.additional_note}`
      );
    }
  }

  if (data.current_medication) {
    notes.push(`Current Medication: ${data.current_medication}`);
  }

  // Handle lifestyle
  if (data.lifestyle) {
    notes.push(`Lifestyle: ${data.lifestyle}`);
  }

  // Handle vital signs
  const vitalSigns = [
    `BP: ${data.bp}`,
    `BG: ${data.bg}`,
    `HR: ${data.hr}`,
    `O2 Saturation: ${data.o2_saturation}`,
  ];
  notes.push(`Vital Signs: \n${vitalSigns.join("\n")}`);

  // Handle visual acuity
  if (data.visual_acuity) {
    const visualAcuity = `
      Visual Acuity:
      - Habitual Visual Acuity: OD ${data.visual_acuity.habitual_va.od}, OS ${data.visual_acuity.habitual_va.os}, OU ${data.visual_acuity.habitual_va.ou}
      - Unaided Visual Acuity: OD ${data.visual_acuity.unaided_va.od}, OS ${data.visual_acuity.unaided_va.os}, OU ${data.visual_acuity.unaided_va.ou}
      - Pinhole Visual Acuity: OD ${data.visual_acuity.pinhole_va.od}, OS ${data.visual_acuity.pinhole_va.os}`;
    notes.push(visualAcuity);
  }

  // Handle retinoscopy
  if (data.retinoscopy) {
    const retinoscopy = `
      Retinoscopy:
      - With Drops: OD ${data.retinoscopy.with_drop.od}, OS ${data.retinoscopy.with_drop.os}
      - Without Drops: OD ${data.retinoscopy.without_drop.od}, OS ${data.retinoscopy.without_drop.os}`;
    notes.push(retinoscopy);
  }

  // Handle dominant eye and hand (nested objects)
  if (data.dominant_EH) {
    const dominantEH = `
      Dominant Eye: ${data.dominant_EH.dominant_eye.right ? "Right" : "Left"},
      Dominant Hand: ${
        data.dominant_EH.dominant_hand.right ? "Right" : "Left"
      }`;
    notes.push(dominantEH);
  }

  // Handle pupillary distance (nested object)
  if (data.pupillary_distance) {
    const pupillaryDistance = `
      Pupillary Distance: OD ${data.pupillary_distance.od}, OS ${data.pupillary_distance.os}, OU ${data.pupillary_distance.ou}`;
    notes.push(pupillaryDistance);
  }

  // Handle cover test (nested objects)
  if (data.cover_test) {
    const coverTest = `
      Cover Test:
      - OD with RX: ${data.cover_test.od.with_rx.near ? "Near" : ""} ${
      data.cover_test.od.with_rx.distance ? "Distance" : ""
    } ${data.cover_test.od.with_rx.tropia ? "Tropia" : ""} ${
      data.cover_test.od.with_rx.phoria ? "Phoria" : ""
    }
      - OD without RX: ${data.cover_test.od.without_rx.near ? "Near" : ""} ${
      data.cover_test.od.without_rx.distance ? "Distance" : ""
    } ${data.cover_test.od.without_rx.tropia ? "Tropia" : ""} ${
      data.cover_test.od.without_rx.phoria ? "Phoria" : ""
    }
      - OS with RX: ${data.cover_test.os.with_rx.near ? "Near" : ""} ${
      data.cover_test.os.with_rx.distance ? "Distance" : ""
    } ${data.cover_test.os.with_rx.tropia ? "Tropia" : ""} ${
      data.cover_test.os.with_rx.phoria ? "Phoria" : ""
    }
      - OS without RX: ${data.cover_test.os.without_rx.near ? "Near" : ""} ${
      data.cover_test.os.without_rx.distance ? "Distance" : ""
    } ${data.cover_test.os.without_rx.tropia ? "Tropia" : ""} ${
      data.cover_test.os.without_rx.phoria ? "Phoria" : ""
    }`;
    notes.push(coverTest);
  }

  // Handle other complex data structures as needed (e.g., family history, previous conditions, etc.)
  // You can add more sections in a similar manner for any other fields in your object

  return notes.join("\n\n");
};
