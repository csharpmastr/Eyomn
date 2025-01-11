from pydantic import BaseModel, Field
from typing_extensions import Literal, Optional

# DATA MODEL FOR AGENT GUARD
class AgentGuardOutput(BaseModel):
    "Classification of the given image to be either a VALID ID  or INVALID ID"
    classification: Literal["VALID ID", "INVALID ID"] = Field(description="Given an image, analyze it and classify whether it is a VALID ID  or INVALID ID.")
    reasoning: Optional[str] = Field(default=None, description="Reasoning behind the classification.")

# DATA MODEL FOR AGENT DATA EXTRACTION
class AgentDataExtractionOutput(BaseModel):
    "Extracted data from the given image of an identification card."
    name: str = Field(description="Name of the person on the ID.")
    date_of_birth: str = Field(description="Date of birth of the person on the ID.")
    id_number: str = Field(description="Identification number on the ID.")
    address: str = Field(description="Address of the person on the ID.")
    expiry_date: Optional[str] = Field(default=None, description="Expiry date of the ID.")
    issue_date: Optional[str] = Field(default=None, description="Issue date of the ID.")