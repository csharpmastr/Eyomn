const optionDefinitions = {
  LRA: "Light reflex abnormalities",
  IIS: "Inflammation-induced synechiae",
};

const sanitizeOption = (option) => {
  let sanitizedOption = option.replace(/_/g, " ").replace(/[^a-zA-Z0-9 ]/g, "");

  if (optionDefinitions[sanitizedOption]) {
    sanitizedOption = optionDefinitions[sanitizedOption];
  }

  return sanitizedOption;
};

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
  // Loop through both source and target objects
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      // If both are objects and not arrays, recursively merge
      if (
        typeof source[key] === "object" &&
        !Array.isArray(source[key]) &&
        source[key] !== null
      ) {
        if (!target[key]) target[key] = {}; // Initialize target[key] if it doesn't exist
        mergeDeep(target[key], source[key]);
      } else if (source[key] !== undefined && source[key] !== "") {
        // Update target with non-undefined, non-empty source values
        target[key] = source[key];
      }
    }
  }
  return target;
};

export const formatPatientNotes = (data) => {
  const notes = [];

  if (data.initial_observation) {
    const selectedOptions = Object.keys(data.initial_observation.options || {})
      .filter((option) => data.initial_observation.options[option])
      .join(", ");

    if (selectedOptions) {
      let initialObservation = `Initial Observations: ${selectedOptions}`;

      if (data.initial_observation.additional_note) {
        initialObservation += `, ${data.initial_observation.additional_note}`;
      }

      notes.push(initialObservation);
    } else if (data.initial_observation.additional_note) {
      notes.push(
        `Additional Note: ${data.initial_observation.additional_note}`
      );
    }
  }

  if (data.general_health_hx) {
    let generalHealthHx = `General Health History: `;

    const healthOptions = [];

    if (!data.general_health_hx.option?.hypertension) {
      healthOptions.push("No history of Hypertension");
    } else {
      healthOptions.push("With history of Hypertension");
    }

    if (!data.general_health_hx.option?.diabetes) {
      healthOptions.push("No history of Diabetes");
    } else {
      healthOptions.push("With history of Diabetes");
    }
    generalHealthHx += healthOptions.join(", ");

    if (data.general_health_hx?.additional_note) {
      generalHealthHx += `, ${data.general_health_hx?.additional_note}`;
    }

    if (data.general_health_hx?.last_exam) {
      generalHealthHx += `, Last Exam: ${data.general_health_hx?.last_exam}`;
    }

    notes.push(generalHealthHx);
  }

  if (data.ocular_history) {
    let ocularHistory = `Ocular History: ${Object.keys(
      data.ocular_history?.option || {}
    )
      .filter((option) => data.ocular_history?.option[option])
      .join(", ")}`;

    if (data.ocular_history?.additional_note) {
      ocularHistory += `, ${data.ocular_history?.additional_note}`;
    }

    if (data.ocular_history?.last_exam) {
      ocularHistory += `, Last Exam: ${data.ocular_history?.last_exam}`;
    }
    notes.push(ocularHistory);
  }

  if (data.fam_ocular_history) {
    let famOcularHistory = `Family Ocular History: ${Object.keys(
      data.fam_ocular_history?.option || {}
    )
      .filter((option) => data.fam_ocular_history?.option[option])
      .join(", ")}`;

    if (data.fam_ocular_history?.additional_note) {
      famOcularHistory += `, ${data.fam_ocular_history?.additional_note}`;
    }

    notes.push(famOcularHistory);

    if (data.fam_ocular_history?.last_exam) {
      notes.push(`Last Exam: ${data.fam_ocular_history?.last_exam}`);
    }
  }

  if (data.current_medication) {
    notes.push(`Current Medication: ${data.current_medication}`);
  }

  if (data.lifestyle) {
    notes.push(`Lifestyle: ${data.lifestyle}`);
  }

  const vitalSigns = [
    data.bp ? `- BP: ${data.bp} mm/Hg` : null,
    data.bg ? `- BG: ${data.bg} mg/dL` : null,
    data.hr ? `- HR: ${data.hr} Bpm` : null,
    data.o2_saturation ? `- O2 Saturation: ${data.o2_saturation} %` : null,
    data.temperature ? `- Temperature: ${data.temperature} C/F` : null,
  ];

  const filteredVitalSigns = vitalSigns.filter(Boolean);

  if (filteredVitalSigns.length) {
    notes.push(`Vital Signs:\n${filteredVitalSigns.join("\n")}`);
  }

  if (data.visual_acuity) {
    let visualAcuity = "";

    const formatSection = (label, values) => {
      const { od, os, ou, custom_od, custom_os, custom_ou, additional_note } =
        values || {};
      let section = [];

      if (od && od.trim()) {
        section.push(`OD ${od.trim()}`);
      } else if (custom_od && custom_od.trim()) {
        section.push(`OD ${custom_od.trim()}`);
      }

      if (os && os.trim()) {
        section.push(`OS ${os.trim()}`);
      } else if (custom_os && custom_os.trim()) {
        section.push(`OS ${custom_os.trim()}`);
      }

      if (ou && ou.trim()) {
        section.push(`OU ${ou.trim()}`);
      } else if (custom_ou && custom_ou.trim()) {
        section.push(`OU ${custom_ou.trim()}`);
      }

      if (additional_note) section.push(`Note: ${additional_note}`);

      return section.length ? `${label}: ${section.join(", ")}` : "";
    };

    const habitualVA = formatSection(
      "Habitual Visual Acuity",
      data.visual_acuity.habitual_va
    );
    const unaidedVA = formatSection(
      "Unaided Visual Acuity",
      data.visual_acuity.unaided_va
    );
    const pinholeVA = formatSection(
      "Pinhole Visual Acuity",
      data.visual_acuity.pinhole_va
    );

    [habitualVA, unaidedVA, pinholeVA].forEach((section) => {
      if (section) visualAcuity += `- ${section}\n`;
    });

    if (visualAcuity.trim()) {
      notes.push(`Visual Acuity:\n${visualAcuity.trim()}`);
    }
  }

  if (data.retinoscopy) {
    let retinoscopy = "";

    const formatSection = (label, values) => {
      const { od, os, custom_od, custom_os, additional_note } = values || {};
      let section = [];

      if (od && od.trim()) {
        section.push(`OD ${od.trim()}`);
      } else if (custom_od && custom_od.trim()) {
        section.push(`OD ${custom_od.trim()}`);
      }

      if (os && os.trim()) {
        section.push(`OS ${os.trim()}`);
      } else if (custom_os && custom_os.trim()) {
        section.push(`OS ${custom_os.trim()}`);
      }

      if (additional_note) section.push(`Note: ${additional_note}`);

      return section.length ? `${label}: ${section.join(", ")}` : "";
    };

    const withDrops = formatSection("With Drops", data.retinoscopy.with_drop);
    const withoutDrops = formatSection(
      "Without Drops",
      data.retinoscopy.without_drop
    );

    [withDrops, withoutDrops].forEach((section) => {
      if (section) retinoscopy += `- ${section}\n`;
    });

    if (retinoscopy.trim()) {
      notes.push(`Retinoscopy:\n${retinoscopy.trim()}`);
    }
  }

  if (data.dominant_EH) {
    const dominantEH = `- Dominant Eye: ${
      data.dominant_EH.dominant_eye.right ? "Right" : "Left"
    },
- Dominant Hand: ${data.dominant_EH.dominant_hand.right ? "Right" : "Left"}`;
    notes.push(dominantEH);
  }
  if (data.pupillary_distance) {
    let pupillaryDistance = "Pupillary Distance:";

    if (data.pupillary_distance?.od) {
      pupillaryDistance += ` OD ${data.pupillary_distance?.od}`;
    }
    if (data.pupillary_distance?.os) {
      pupillaryDistance += `, OS ${data.pupillary_distance?.os}`;
    }
    if (data.pupillary_distance?.ou) {
      pupillaryDistance += `, OU ${data.pupillary_distance?.ou}`;
    }

    if (pupillaryDistance.trim() !== "Pupillary Distance:") {
      notes.push(pupillaryDistance);
    }
  }
  if (data.cover_test) {
    let coverTest = "";
    let coverTestOS = "";

    // OD (Right Eye)
    if (data.cover_test.od) {
      // Check for with RX conditions
      const odWithRXConditions = [
        data.cover_test.od.with_rx?.near,
        data.cover_test.od.with_rx?.distance,
        data.cover_test.od.with_rx?.tropia,
        data.cover_test.od.with_rx?.phoria,
      ];

      if (odWithRXConditions.some(Boolean)) {
        coverTest += `- OD with RX: ${[
          data.cover_test.od.with_rx?.near ? "Near" : "",
          data.cover_test.od.with_rx?.distance ? "Distance" : "",
          data.cover_test.od.with_rx?.tropia ? "Tropia" : "",
          data.cover_test.od.with_rx?.phoria ? "Phoria" : "",
        ]
          .filter(Boolean)
          .join(", ")}`;
      }

      // Check for without RX conditions
      const odWithoutRXConditions = [
        data.cover_test.od.without_rx?.near,
        data.cover_test.od.without_rx?.distance,
        data.cover_test.od.without_rx?.tropia,
        data.cover_test.od.without_rx?.phoria,
      ];

      if (odWithoutRXConditions.some(Boolean)) {
        if (coverTest) coverTest += "\n";
        coverTest += `- OD without RX: ${[
          data.cover_test.od.without_rx?.near ? "Near" : "",
          data.cover_test.od.without_rx?.distance ? "Distance" : "",
          data.cover_test.od.without_rx?.tropia ? "Tropia" : "",
          data.cover_test.od.without_rx?.phoria ? "Phoria" : "",
        ]
          .filter(Boolean)
          .join(", ")}`;
      }

      if (data.cover_test?.additional_note_od) {
        coverTest += `\n- Note OD: ${data.cover_test?.additional_note_od}`;
      }
    }

    if (data.cover_test.os) {
      const osWithRXConditions = [
        data.cover_test.os.with_rx?.near,
        data.cover_test.os.with_rx?.distance,
        data.cover_test.os.with_rx?.tropia,
        data.cover_test.os.with_rx?.phoria,
      ];

      if (osWithRXConditions.some(Boolean)) {
        coverTestOS += `- OS with RX: ${[
          data.cover_test.os.with_rx?.near ? "Near" : "",
          data.cover_test.os.with_rx?.distance ? "Distance" : "",
          data.cover_test.os.with_rx?.tropia ? "Tropia" : "",
          data.cover_test.os.with_rx?.phoria ? "Phoria" : "",
        ]
          .filter(Boolean)
          .join(", ")}`;
      }

      const osWithoutRXConditions = [
        data.cover_test.os.without_rx?.near,
        data.cover_test.os.without_rx?.distance,
        data.cover_test.os.without_rx?.tropia,
        data.cover_test.os.without_rx?.phoria,
      ];

      if (osWithoutRXConditions.some(Boolean)) {
        if (coverTestOS) coverTestOS += "\n";
        coverTestOS += `- OS without RX: ${[
          data.cover_test.os.without_rx?.near ? "Near" : "",
          data.cover_test.os.without_rx?.distance ? "Distance" : "",
          data.cover_test.os.without_rx?.tropia ? "Tropia" : "",
          data.cover_test.os.without_rx?.phoria ? "Phoria" : "",
        ]
          .filter(Boolean)
          .join(", ")}`;
      }

      // Add note for OS without RX
      if (data.cover_test?.additional_note_os) {
        coverTestOS += `\n- Note OS: ${data.cover_test?.additional_note_os}`;
      }
    }

    if (coverTest || coverTestOS) {
      notes.push(`Cover Test:\n${coverTest}\n${coverTestOS}`);
    }
  }

  let additionalTests = "";

  if (data.confrontation_test) {
    let confrontationTest = "";

    if (data.confrontation_test?.od) {
      confrontationTest += `OD ${data.confrontation_test?.od}, `;
    }

    if (data.confrontation_test?.os) {
      confrontationTest += `OS ${data.confrontation_test?.os}`;
    }

    if (confrontationTest) {
      additionalTests += `- Confrontation Test: ${confrontationTest}\n`;
    }
  }
  if (data.stereopsis) {
    let stereopsis = "";

    if (data.stereopsis?.stereopsis_score) {
      if (data.stereopsis?.stereopsis_score.od) {
        stereopsis += `OD Score: ${data.stereopsis.stereopsis_score?.od}, `;
      }
      if (data.stereopsis.stereopsis_score.os) {
        stereopsis += `OS Score: ${data.stereopsis.stereopsis_score?.os}, `;
      }
    }

    if (data.stereopsis?.perceived_DO) {
      if (data.stereopsis.perceived_DO?.od) {
        const odPerceived = data.stereopsis.perceived_DO.od?.yes
          ? "Perceived DO: Yes"
          : "Perceived DO: No";
        stereopsis += `OD: ${odPerceived}, `;
      }

      if (data.stereopsis.perceived_DO?.os) {
        const osPerceived = data.stereopsis.perceived_DO.os?.yes
          ? "Perceived DO: Yes"
          : "Perceived DO: No";
        stereopsis += `OS: ${osPerceived}, `;
      }
    }

    if (data.stereopsis?.additional_note) {
      stereopsis += `Note: ${data.stereopsis?.additional_note}`;
    }

    if (stereopsis) {
      additionalTests += `- Stereopsis: ${stereopsis}\n`;
    }
  }
  if (data.diplopia_test) {
    let diplopiaTest = "";

    if (data.diplopia_test?.present) {
      diplopiaTest = "Present";
    } else if (data.diplopia_test?.absent) {
      diplopiaTest = "Absent";
    }

    if (data.diplopia_test?.additional_note) {
      diplopiaTest += `, Note: ${data.diplopia_test?.additional_note}`;
    }

    if (diplopiaTest) {
      additionalTests += `- Diplopia Test: ${diplopiaTest}\n`;
    }
  }
  if (data.corneal_reflex_test) {
    let cornealReflexTest = "";

    if (data.corneal_reflex_test?.od) {
      if (data.corneal_reflex_test.od?.present) {
        cornealReflexTest += "OD Present, ";
      } else if (data.corneal_reflex_test.od?.absent) {
        cornealReflexTest += "OD Absent, ";
      }
    }

    if (data.corneal_reflex_test?.os) {
      if (data.corneal_reflex_test.os?.present) {
        cornealReflexTest += "OS Present, ";
      } else if (data.corneal_reflex_test.os?.absent) {
        cornealReflexTest += "OS Absent, ";
      }
    }

    if (data.corneal_reflex_test?.additional_note) {
      cornealReflexTest += `Note: ${data.corneal_reflex_test?.additional_note}`;
    }

    if (cornealReflexTest) {
      additionalTests += `- Corneal Reflex Test: ${cornealReflexTest.trimEnd()}\n`;
    }
  }

  if (data.motility_test) {
    let motilityTest = "";

    if (data.motility_test?.od) {
      if (data.motility_test.od?.normal) {
        motilityTest += "OD Normal, ";
      } else if (data.motility_test.od?.abnormal) {
        motilityTest += "OD Abnormal, ";
      }
    }

    if (data.motility_test?.os) {
      if (data.motility_test.os?.normal) {
        motilityTest += "OS Normal, ";
      } else if (data.motility_test.os?.abnormal) {
        motilityTest += "OS Abnormal, ";
      }
    }

    if (data.motility_test?.additional_note) {
      motilityTest += `Note: ${data.motility_test?.additional_note}`;
    }

    if (motilityTest) {
      additionalTests += `- Motility Test: ${motilityTest.trimEnd()}\n`;
    }
  }

  if (data.saccadic_test) {
    let saccadicTest = "";

    if (data.saccadic_test?.od) {
      if (data.saccadic_test.od?.present) {
        saccadicTest += "OD Present, ";
      } else if (data.saccadic_test.od?.absent) {
        saccadicTest += "OD Absent, ";
      }
    }
    if (data.saccadic_test?.os) {
      if (data.saccadic_test.os?.present) {
        saccadicTest += "OS Present, ";
      } else if (data.saccadic_test.os?.absent) {
        saccadicTest += "OS Absent, ";
      }
    }

    if (data.saccadic_test?.additional_note) {
      saccadicTest += `Note: ${data.saccadic_test?.additional_note}`;
    }

    if (saccadicTest) {
      additionalTests += `- Saccadic Test: ${saccadicTest.trimEnd()}\n`;
    }
  }

  if (data.amsler_grid) {
    let amslerGrid = "";
    if (data.amsler_grid?.od) {
      amslerGrid += `OD ${data.amsler_grid?.od}, `;
    }
    if (data.amsler_grid.os) {
      amslerGrid += `OD ${data.amsler_grid?.os}, `;
    }
    if (data.amsler_grid?.additional_note) {
      amslerGrid += `Note: ${data.amsler_grid?.additional_note}`;
    }
    if (amslerGrid) {
      additionalTests += `- Amsler Grid : ${amslerGrid}\n`;
    }
  }

  if (data.worths_FD) {
    let worths = "";
    if (data.worths_FD?.od) {
      worths += `OD ${data.worths_FD?.od}, `;
    }
    if (data.worths_FD?.os) {
      worths += `OD ${data.worths_FD?.os}`;
    }

    if (worths) {
      additionalTests += `- Worth's Four Dots: ${worths}\n`;
    }
  }

  if (data.ishihara_test) {
    let ishihara = "";
    if (data.ishihara_test?.od) {
      ishihara += `OD ${data.ishihara_test?.od}, `;
    }
    if (data.ishihara_test?.os) {
      ishihara += `OD ${data.ishihara_test?.os}`;
    }

    if (ishihara) {
      additionalTests += `- Ishihara Test: ${ishihara}\n`;
    }
  }

  if (data.schirmer_test) {
    let schirmer = "";
    if (data.schirmer_test?.od) {
      schirmer += `OD ${data.schirmer_test?.od}, `;
    }
    if (data.worths_FD.os) {
      schirmer += `OD ${data.schirmer_test?.os}`;
    }

    if (schirmer) {
      additionalTests += `- Schirmer Test : ${schirmer}\n`;
    }
  }
  if (data.ophthalmoscopy) {
    let ophthal = "";
    if (data.ophthalmoscopy?.additional_note_od) {
      ophthal += `OD ${data.ophthalmoscopy?.additional_note_od}`;
    }
    if (data.ophthalmoscopy?.additional_note_os) {
      ophthal += `OS ${data.ophthalmoscopy?.additional_note_os}`;
    }
    if (ophthal) {
      additionalTests += `- Ophthalmosopy ${ophthal}`;
    }
  }

  if (data.IOP) {
    let intraOcular = "";
    if (data.IOP?.od) {
      intraOcular += `OD ${data.IOP.od}, `;
    }
    if (data.IOP?.os) {
      intraOcular += `OD ${data.IOP.os}`;
    }

    if (intraOcular) {
      additionalTests += `- Intra-Ocular Pressure : ${intraOcular}\n`;
    }
  }

  let internalExaminations = "";

  if (data.internal_examination && data.internal_examination.cup_disc_ratio) {
    let cdr = "";
    if (data.internal_examination.cup_disc_ratio?.od) {
      cdr += `OD ${data.internal_examination.cup_disc_ratio?.od}, `;
    }
    if (data.internal_examination.cup_disc_ratio?.os) {
      cdr += `OS ${data.internal_examination.cup_disc_ratio?.os}`;
    }
    if (cdr) {
      internalExaminations += `- Cup Disk Ratio: ${cdr}\n`;
    }
  }

  if (data.internal_examination && data.internal_examination?.av_ratio) {
    let avRatio = "";
    if (data.internal_examination.av_ratio?.od) {
      avRatio += `OD ${data.internal_examination.av_ratio?.od}, `;
    }
    if (data.internal_examination.av_ratio?.os) {
      avRatio += `OS ${data.internal_examination.av_ratio?.os}`;
    }
    if (avRatio) {
      internalExaminations += `- A/V Ratio: ${avRatio}\n`;
    }
  }

  if (data.internal_examination && data.internal_examination?.macula) {
    let macula = "";
    if (data.internal_examination.macula?.od) {
      macula += `OD ${data.internal_examination.macula?.od}, `;
    }
    if (data.internal_examination.macula?.os) {
      macula += `OD ${data.internal_examination.macula?.os}`;
    }
    if (macula) {
      internalExaminations += `- Macula: ${macula}\n`;
    }
  }

  if (data.internal_examination && data.internal_examination?.vitreous) {
    let vitreous = "";
    if (data.internal_examination.vitreous?.od) {
      vitreous += `OD ${data.internal_examination.vitreous?.od}, `;
    }
    if (data.internal_examination.vitreous?.os) {
      vitreous += `OD ${data.internal_examination.vitreous?.os}`;
    }
    if (vitreous) {
      internalExaminations += `- Vitreous: ${vitreous}\n`;
    }
  }
  if (data.internal_examination && data.internal_examination?.vessel) {
    let vessel = "";

    if (data.internal_examination.vessel?.od) {
      if (data.internal_examination.vessel.od?.normal) {
        vessel += `OD Normal, `;
      } else if (data.internal_examination.vessel.od?.abnormal) {
        vessel += `OD Abnormal, `;
      }
    }
    if (data.internal_examination.vessel?.os) {
      if (data.internal_examination.vessel.os?.normal) {
        vessel += `OS Normal`;
      } else if (data.internal_examination.vessel.os?.abnormal) {
        vessel += `OS Abnormal`;
      }
    }
    if (vessel) {
      internalExaminations += `- Vessel: ${vessel}\n`;
    }
  }

  if (data.internal_examination && data.internal_examination?.venous_pulse) {
    let venousPulse = "";

    if (data.internal_examination.venous_pulse?.od) {
      if (data.internal_examination.venous_pulse.od?.normal) {
        venousPulse += `OD Normal, `;
      } else if (data.internal_examination.venous_pulse.od?.abnormal) {
        venousPulse += `OD Abnormal, `;
      }
    }
    if (data.internal_examination.venous_pulse?.os) {
      if (data.internal_examination.venous_pulse.os?.normal) {
        venousPulse += `OS Normal`;
      } else if (data.internal_examination.venous_pulse.os?.abnormal) {
        venousPulse += `OS Abnormal`;
      }
    }
    if (venousPulse) {
      internalExaminations += `- Venous Pulse: ${venousPulse}\n`;
    }
  }

  if (data.internal_examination && data.internal_examination?.forveal_reflex) {
    let forvealReflex = "";

    if (data.internal_examination.forveal_reflex?.od) {
      if (data.internal_examination.forveal_reflex.od?.present) {
        forvealReflex += `OD Present, `;
      } else if (data.internal_examination.forveal_reflex.od?.absent) {
        forvealReflex += `OD Absent, `;
      }
    }
    if (data.internal_examination.forveal_reflex?.os) {
      if (data.internal_examination.forveal_reflex.os?.present) {
        forvealReflex += `OS Present`;
      } else if (data.internal_examination.forveal_reflex.os?.absent) {
        forvealReflex += `OS Absent`;
      }
    }
    if (forvealReflex) {
      internalExaminations += `- Forveal Reflex: ${forvealReflex}\n`;
    }
  }

  if (data.internal_examination && data.internal_examination?.periphery) {
    let periphery = "";

    if (data.internal_examination.periphery?.od) {
      if (data.internal_examination.periphery.od?.normal) {
        periphery += `OD Normal, `;
      } else if (data.internal_examination.periphery.od?.abnormal) {
        periphery += `OD Abnormal, `;
      }
    }
    if (data.internal_examination.periphery?.os) {
      if (data.internal_examination.periphery.os?.normal) {
        periphery += `OS Normal`;
      } else if (data.internal_examination.periphery.os?.abnormal) {
        periphery += `OS Abnormal`;
      }
    }
    if (periphery) {
      internalExaminations += `- Periphery: ${periphery}\n`;
    }
  }
  let externalExamination = "";
  if (data.external_examination && data.external_examination.eyebrow) {
    let eyebrowObservations = "";

    if (data.external_examination.eyebrow?.od) {
      const selectedOdOptions = Object.keys(
        data.external_examination.eyebrow.od?.options || {}
      )
        .filter(
          (option) =>
            data.external_examination.eyebrow.od.options[option] === true
        )
        .map(sanitizeOption)
        .join(", ");

      if (selectedOdOptions) {
        eyebrowObservations += `OD: ${selectedOdOptions}`;
      }

      if (data.external_examination.eyebrow.od?.additional_note) {
        if (selectedOdOptions) {
          eyebrowObservations += `, Note: ${data.external_examination.eyebrow.od?.additional_note} `;
        } else {
          eyebrowObservations += `Note: ${data.external_examination.eyebrow.od?.additional_note} `;
        }
      }
    }

    if (data.external_examination.eyebrow?.os) {
      const selectedOsOptions = Object.keys(
        data.external_examination.eyebrow.os?.options || {}
      )
        .filter(
          (option) =>
            data.external_examination.eyebrow.os?.options[option] === true
        )
        .map(sanitizeOption)
        .join(", ");

      if (selectedOsOptions) {
        if (eyebrowObservations) {
          eyebrowObservations += ", ";
        }
        eyebrowObservations += `OS: ${selectedOsOptions}`;
      }

      if (data.external_examination.eyebrow.os?.additional_note) {
        if (selectedOsOptions) {
          eyebrowObservations += `, Note: ${data.external_examination.eyebrow.os?.additional_note}`;
        } else {
          eyebrowObservations += `Note: ${data.external_examination.eyebrow.os?.additional_note}`;
        }
      }
    }

    if (eyebrowObservations) {
      externalExamination += `- Eyebrow: ${eyebrowObservations}\n`;
    }
  }

  if (data.external_examination && data.external_examination?.eyelashes) {
    let eyelashesObservations = "";

    if (data.external_examination.eyelashes?.od) {
      const selectedOdOptions = Object.keys(
        data.external_examination.eyelashes.od?.options || {}
      )
        .filter(
          (option) =>
            data.external_examination.eyelashes.od?.options[option] === true
        )
        .map(sanitizeOption)
        .join(", ");

      if (selectedOdOptions) {
        eyelashesObservations += `OD: ${selectedOdOptions}`;
      }

      if (data.external_examination.eyelashes.od?.additional_note) {
        if (selectedOdOptions) {
          eyelashesObservations += `, Note: ${data.external_examination.eyelashes.od?.additional_note} `;
        } else {
          eyelashesObservations += `Note: ${data.external_examination.eyelashes.od?.additional_note} `;
        }
      }
    }

    if (data.external_examination.eyelashes?.os) {
      const selectedOsOptions = Object.keys(
        data.external_examination.eyelashes.os?.options || {}
      )
        .filter(
          (option) =>
            data.external_examination.eyelashes.os?.options[option] === true
        )
        .map(sanitizeOption)
        .join(", ");

      if (selectedOsOptions) {
        if (eyelashesObservations) {
          eyelashesObservations += ", ";
        }
        eyelashesObservations += `OS: ${selectedOsOptions}`;
      }

      if (data.external_examination.eyelashes.os?.additional_note) {
        if (selectedOsOptions) {
          eyelashesObservations += `, Note: ${data.external_examination.eyelashes.os?.additional_note}`;
        } else {
          eyelashesObservations += `Note: ${data.external_examination.eyelashes.os?.additional_note}`;
        }
      }
    }

    if (eyelashesObservations) {
      externalExamination += `- Eyelashes: ${eyelashesObservations}\n`;
    }
  }

  if (data.external_examination && data.external_examination?.eyelids) {
    let eyelidsObservations = "";

    if (data.external_examination.eyelids?.od) {
      const selectedOdOptions = Object.keys(
        data.external_examination.eyelids.od?.options || {}
      )
        .filter(
          (option) =>
            data.external_examination.eyelids.od?.options[option] === true
        )
        .map(sanitizeOption)
        .join(", ");

      if (selectedOdOptions) {
        eyelidsObservations += `OD: ${selectedOdOptions}`;
      }

      if (data.external_examination.eyelids.od?.additional_note) {
        if (selectedOdOptions) {
          eyelidsObservations += `, Note: ${data.external_examination.eyelids.od?.additional_note} `;
        } else {
          eyelidsObservations += `Note: ${data.external_examination.eyelids.od?.additional_note}`;
        }
      }
    }

    if (data.external_examination.eyelids?.os) {
      const selectedOsOptions = Object.keys(
        data.external_examination.eyelids.os?.options || {}
      )
        .filter(
          (option) =>
            data.external_examination.eyelids.os?.options[option] === true
        )
        .map(sanitizeOption)
        .join(", ");

      if (selectedOsOptions) {
        if (eyelidsObservations) {
          eyelidsObservations += ", ";
        }
        eyelidsObservations += `OS: ${selectedOsOptions}`;
      }

      if (data.external_examination.eyelids.os?.additional_note) {
        if (selectedOsOptions) {
          eyelidsObservations += `, Note: ${data.external_examination.eyelids.os?.additional_note}`;
        } else {
          eyelidsObservations += `Note: ${data.external_examination.eyelids.os?.additional_note}`;
        }
      }
    }

    if (eyelidsObservations) {
      externalExamination += `- Eyelids: ${eyelidsObservations}\n`;
    }
  }

  if (data.external_examination && data.external_examination?.cornea) {
    let corneaObservations = "";

    if (data.external_examination.cornea?.od) {
      const selectedOdOptions = Object.keys(
        data.external_examination.cornea.od?.options || {}
      )
        .filter(
          (option) =>
            data.external_examination.cornea.od?.options[option] === true
        )
        .map(sanitizeOption)
        .join(", ");

      if (selectedOdOptions) {
        corneaObservations += `OD: ${selectedOdOptions}`;
      }

      if (data.external_examination.cornea.od?.additional_note) {
        if (selectedOdOptions) {
          corneaObservations += `, Note: ${data.external_examination.cornea.od?.additional_note} `;
        } else {
          corneaObservations += `Note: ${data.external_examination.cornea.od?.additional_note}`;
        }
      }
    }

    if (data.external_examination.cornea?.os) {
      const selectedOsOptions = Object.keys(
        data.external_examination.cornea.os?.options || {}
      )
        .filter(
          (option) =>
            data.external_examination.cornea.os?.options[option] === true
        )
        .map(sanitizeOption)
        .join(", ");

      if (selectedOsOptions) {
        if (corneaObservations) {
          corneaObservations += ", ";
        }
        corneaObservations += `OS: ${selectedOsOptions}`;
      }

      if (data.external_examination.cornea.os?.additional_note) {
        if (selectedOsOptions) {
          corneaObservations += `, Note: ${data.external_examination.cornea.os?.additional_note}`;
        } else {
          corneaObservations += `Note: ${data.external_examination.cornea.os?.additional_note}`;
        }
      }
    }

    if (corneaObservations) {
      externalExamination += `- Cornea: ${corneaObservations}\n`;
    }
  }

  if (data.external_examination && data.external_examination?.limbus) {
    let limbusObservations = "";

    if (data.external_examination.limbus?.od) {
      const selectedOdOptions = Object.keys(
        data.external_examination.limbus.od?.options || {}
      )
        .filter(
          (option) =>
            data.external_examination.limbus.od?.options[option] === true
        )
        .map(sanitizeOption)
        .join(", ");

      if (selectedOdOptions) {
        limbusObservations += `OD: ${selectedOdOptions}`;
      }

      if (data.external_examination.limbus.od?.additional_note) {
        if (selectedOdOptions) {
          limbusObservations += `, Note: ${data.external_examination.limbus.od?.additional_note} `;
        } else {
          limbusObservations += `Note: ${data.external_examination.limbus.od?.additional_note}`;
        }
      }
    }

    if (data.external_examination.limbus?.os) {
      const selectedOsOptions = Object.keys(
        data.external_examination.limbus.os?.options || {}
      )
        .filter(
          (option) =>
            data.external_examination.limbus.os?.options[option] === true
        )
        .map(sanitizeOption)
        .join(", ");

      if (selectedOsOptions) {
        if (limbusObservations) {
          limbusObservations += ", ";
        }
        limbusObservations += `OS: ${selectedOsOptions}`;
      }

      if (data.external_examination.limbus.os?.additional_note) {
        if (selectedOsOptions) {
          limbusObservations += `, Note: ${data.external_examination.limbus.os?.additional_note}`;
        } else {
          limbusObservations += `Note: ${data.external_examination.limbus.os?.additional_note}`;
        }
      }
    }

    if (limbusObservations) {
      externalExamination += `- Limbus: ${limbusObservations}\n`;
    }
  }
  if (data.external_examination && data.external_examination?.pupil) {
    let pupilObservations = "";

    if (data.external_examination.pupil?.od) {
      const selectedOdOptions = Object.keys(
        data.external_examination.pupil.od?.options || {}
      )
        .filter(
          (option) =>
            data.external_examination.pupil.od?.options[option] === true
        )
        .map(sanitizeOption)
        .join(", ");

      if (selectedOdOptions) {
        pupilObservations += `OD: ${selectedOdOptions}`;
      }

      if (data.external_examination.pupil.od?.additional_note) {
        if (selectedOdOptions) {
          pupilObservations += `, Note: ${data.external_examination.pupil.od?.additional_note} `;
        } else {
          pupilObservations += `Note: ${data.external_examination.pupil.od?.additional_note}`;
        }
      }
    }

    if (data.external_examination.pupil?.os) {
      const selectedOsOptions = Object.keys(
        data.external_examination.pupil.os?.options || {}
      )
        .filter(
          (option) =>
            data.external_examination.pupil.os?.options[option] === true
        )
        .map(sanitizeOption)
        .join(", ");

      if (selectedOsOptions) {
        if (pupilObservations) {
          pupilObservations += ", ";
        }
        pupilObservations += `OS: ${selectedOsOptions}`;
      }

      if (data.external_examination.pupil.os?.additional_note) {
        if (selectedOsOptions) {
          pupilObservations += `, Note: ${data.external_examination.pupil.os?.additional_note}`;
        } else {
          pupilObservations += `Note: ${data.external_examination.pupil.os?.additional_note}`;
        }
      }
    }

    if (pupilObservations) {
      externalExamination += `- Pupil: ${pupilObservations}\n`;
    }
  }
  if (data.external_examination && data.external_examination?.iris) {
    let irisObservations = "";

    if (data.external_examination.iris?.od) {
      const selectedOdOptions = Object.keys(
        data.external_examination.iris.od?.options || {}
      )
        .filter(
          (option) =>
            data.external_examination.iris.od?.options[option] === true
        )
        .map(sanitizeOption)
        .join(", ");

      if (selectedOdOptions) {
        irisObservations += `OD: ${selectedOdOptions}`;
      }

      if (data.external_examination.iris.od?.additional_note) {
        if (selectedOdOptions) {
          irisObservations += `, Note: ${data.external_examination.iris.od?.additional_note} `;
        } else {
          irisObservations += `Note: ${data.external_examination.iris.od?.additional_note} `;
        }
      }
    }

    if (data.external_examination.iris?.os) {
      const selectedOsOptions = Object.keys(
        data.external_examination.iris.os?.options || {}
      )
        .filter(
          (option) =>
            data.external_examination.iris.os?.options[option] === true
        )
        .map(sanitizeOption)
        .join(", ");

      if (selectedOsOptions) {
        if (irisObservations) {
          irisObservations += ", ";
        }
        irisObservations += `OS: ${selectedOsOptions}`;
      }

      if (data.external_examination.iris.os?.additional_note) {
        if (selectedOsOptions) {
          irisObservations += `, Note: ${data.external_examination.iris.os?.additional_note}`;
        } else {
          irisObservations += `Note: ${data.external_examination.iris.os?.additional_note}`;
        }
      }
    }

    if (irisObservations) {
      externalExamination += `- Iris: ${irisObservations}\n`;
    }
  }

  if (externalExamination.endsWith("\n")) {
    externalExamination = externalExamination.slice(0, -1);
  }

  if (externalExamination) {
    notes.push(`External Examinations:\n${externalExamination}`);
  }

  if (internalExaminations.endsWith("\n")) {
    internalExaminations = internalExaminations.slice(0, -1);
  }
  if (internalExaminations) {
    notes.push(`Internal Examinations:\n${internalExaminations}`);
  }

  if (additionalTests.endsWith("\n")) {
    additionalTests = additionalTests.slice(0, -1);
  }

  if (additionalTests) {
    notes.push(`Additional Tests:\n${additionalTests}`);
  }
  if (data.diagnosis) {
    notes.push(`Diagnosis: ${data.diagnosis}`);
  }
  if (data.refractive_error) {
    notes.push(`Refractive Error: ${data.refractive_error}`);
  }

  if (data.new_prescription_od) {
    let np_od = [];
    if (data.new_prescription_od?.np_ADD) {
      np_od.push(`ADD: ${data.new_prescription_od?.np_ADD}`);
    }
    if (data.new_prescription_od?.np_NEAR) {
      np_od.push(`NEAR: ${data.new_prescription_od?.np_NEAR}`);
    }
    if (data.new_prescription_od?.np_FAR) {
      np_od.push(`FAR: ${data.new_prescription_od?.np_FAR}`);
    }

    if (np_od.length > 0) {
      notes.push(`OD Prescription: ${np_od.join(", ")}`);
    } else {
      notes.push("OD Prescription: No prescription");
    }
  }
  if (data.new_prescription_os) {
    let np_os = [];

    if (data.new_prescription_os?.np_ADD) {
      np_os.push(`ADD: ${data.new_prescription_os?.np_ADD}`);
    }
    if (data.new_prescription_os?.np_NEAR) {
      np_os.push(`NEAR: ${data.new_prescription_os?.np_NEAR}`);
    }
    if (data.new_prescription_os?.np_FAR) {
      np_os.push(`FAR: ${data.new_prescription_os?.np_FAR}`);
    }

    if (np_os.length > 0) {
      notes.push(`OS Prescription: ${np_os.join(", ")}`);
    } else {
      notes.push("OS Prescription: No prescription");
    }
  }
  if (data.new_prescription_ou) {
    let np_ou = [];

    if (data.new_prescription_ou?.np_ADD) {
      np_ou.push(`ADD: ${data.new_prescription_ou?.np_ADD}`);
    }
    if (data.new_prescription_ou?.np_NEAR) {
      np_ou.push(`NEAR: ${data.new_prescription_ou?.np_NEAR}`);
    }
    if (data.new_prescription_ou?.np_FAR) {
      np_ou.push(`FAR: ${data.new_prescription_ou?.np_FAR}`);
    }

    if (np_ou.length > 0) {
      notes.push(`OU Prescription: ${np_ou.join(", ")}`);
    } else {
      notes.push("OU Prescription: No prescription");
    }
  }

  if (data.management) {
    notes.push(`Management: ${data.management}`);
  }
  if (data.followup_care) {
    notes.push(`Follow Up Care: ${data.followup_care}`);
  }
  return notes.join("\n\n");
};

export const extractSoapData = (inputText) => {
  const sections = inputText.split(/\n\s*\n/);

  const subjective = sections[1]
    ? sections[1]
        .replace(/^##?\s*Subjective\s*/i, "") // Remove the "Subjective" header
        .split(/\.\s+/) // Split sentences by period followed by one or more spaces
        .map((sentence) => sentence.trim() + ".") // Trim and re-append period to each sentence
    : [];

  const objective = sections[2]
    ? sections[2]
        .replace(/^##?\s*Objective\s*/i, "") // Remove the "Objective" header
        .split(/\.\s+/) // Split sentences by period followed by one or more spaces
        .map((sentence) => sentence.trim() + ".") // Trim and re-append period to each sentence
    : [];

  const assessment = sections[3]
    ? sections[3]
        .replace(/^##?\s*Assessment\s*/i, "") // Remove the "Assessment" header
        .split(/\.\s+/) // Split sentences by period followed by one or more spaces
        .map((sentence) => sentence.trim() + ".") // Trim and re-append period to each sentence
    : [];

  const plan = sections[4]
    ? sections[4]
        .replace(/^##?\s*Plan\s*/i, "") // Remove the "Plan" header
        .split(/\.\s+/) // Split sentences by period followed by one or more spaces
        .map((sentence) => sentence.trim() + ".") // Trim and re-append period to each sentence
    : [];

  return {
    subjective,
    objective,
    assessment,
    plan,
  };
};
