from pydantic import BaseModel, Field
from typing import Optional, Dict, Union

class Observation(BaseModel):
    headache: Optional[bool]
    bov: Optional[bool]
    halo: Optional[bool]
    photophobia: Optional[bool]
    additional_note: Optional[str] = None

class HealthHistory(BaseModel):
    hypertension: Optional[bool]
    cardiovas_prob: Optional[bool]
    diabetes: Optional[bool]
    asthma: Optional[bool]
    last_exam: Optional[str] = Field(None, pattern=r"^\d{4}-\d{2}-\d{2}$")
    additional_note: Optional[str] = None

class OcularHistory(BaseModel):
    glaucoma: Optional[bool]
    cataract: Optional[bool]
    astigmatism: Optional[bool]
    last_exam: Optional[str] = Field(None, pattern=r"^\d{4}-\d{2}-\d{2}$")
    additional_note: Optional[str] = None

class VisualAcuity(BaseModel):
    od: str
    os: str
    ou: Optional[str] = None
    additional_note: Optional[str] = None

class Prescription(BaseModel):
    date_prescribed: str = Field(..., pattern=r"^\d{4}-\d{2}-\d{2}$")
    od: str
    os: str

class FamilyHistory(BaseModel):
    glaucoma: Optional[bool]
    cataract: Optional[bool]
    astigmatism: Optional[bool]
    macular: Optional[bool]
    additional_note: Optional[str] = None

class GeneralStatus(BaseModel):
    bp: Optional[str]
    bg: Optional[str]
    hr: Optional[str]
    o2_saturation: Optional[str]
    temperature: Optional[str]

class ExaminationResult(BaseModel):
    od: str
    os: str
    additional_note: Optional[str] = None

class BooleanCheck(BaseModel):
    od: bool
    os: bool

class TestResults(BaseModel):
    stereopsis_score: Dict[str, str]
    perceived_DO: BooleanCheck
    additional_note: Optional[str] = None

class ExaminationDetails(BaseModel):
    cup_disc_ratio: BooleanCheck
    av_ratio: Dict[str, str]
    macula: BooleanCheck
    vitreous: BooleanCheck
    vessel: BooleanCheck
    venous_pulse: BooleanCheck
    foveal_reflex: BooleanCheck
    periphery: BooleanCheck

class ExternalExamination(BaseModel):
    inflammation: Optional[bool] = None
    crust_formation: Optional[bool] = None
    additional_note: Optional[str] = None

class PatientData(BaseModel):
    initial_observation: Optional[Observation]
    general_health_hx: HealthHistory
    ocular_history: OcularHistory
    fam_ocular_history: FamilyHistory
    current_medication: Optional[str] = None
    lifestyle: Optional[str] = None
    general_status: GeneralStatus
    visual_acuity: Dict[str, VisualAcuity]
    retinoscopy: Dict[str, ExaminationResult]
    dominant_EH: Dict[str, BooleanCheck]
    pupillary_distance: Optional[ExaminationResult] = None
    cover_test: Dict[str, Dict[str, Union[bool, BooleanCheck]]]
    confrontation_test: Optional[BooleanCheck] = None
    stereopsis: Optional[TestResults] = None
    diplopia_test: Optional[BooleanCheck] = None
    corneal_reflex_test: Optional[BooleanCheck] = None
    motility_test: Optional[BooleanCheck] = None
    saccadic_test: Optional[BooleanCheck] = None
    amsler_grid: Optional[ExaminationResult] = None
    worths_FD: Optional[BooleanCheck] = None
    ishihara_test: Optional[BooleanCheck] = None
    schirmer_test: Optional[ExaminationResult] = None
    iop: Optional[ExaminationResult] = None
    internal_examination: Optional[ExaminationDetails] = None
    external_examination: Dict[str, ExternalExamination]
    habitual_prescription: Optional[Prescription] = None
    contact_lens_prescription: Optional[Prescription] = None
    diagnosis: Optional[str] = None
    refractive_error: Optional[str] = None
    new_prescription_od: Optional[str] = None
    new_prescription_os: Optional[str] = None
    additional_comments: Optional[str] = None

class SOAPNote(BaseModel):
    Subjective: str = Field(..., description="Subjective information")
    Objective: str = Field(..., description="Objective information")
    Assessment: str = Field(..., description="Assessment information")
    Plan: str = Field(..., description="Plan information")
