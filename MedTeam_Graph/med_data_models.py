from typing import Optional, List, Dict
from pydantic import BaseModel, Field

# Data Model for the Summarizer Chain
class SummaryWriterDataModel(BaseModel):
    """Summarized Content by the Agent Summarizer"""
    subjective: str = Field(description="Subjective section of the SOAP note")
    objective: str = Field(description="Objective section of the SOAP note")
    assessment: str = Field(description="Assessment section of the SOAP note")
    plan: str = Field(description="Plan section of the SOAP note")

# Data Model for the Hallucination Grader Agent
class HallucinationGradeDataModel(BaseModel):
    """Score for hallucination present in the written Medical Summaries"""
    score: int = Field(
        description="Hallucination score (1-10), where higher scores indicate better grounding and accuracy of the summary in relation to the source data."
    )

# Data Model for the Hallucination Feedback Writer Agent
class HallucinationFeedbackDataModel(BaseModel):
    # List of Specific SOAP section with the given feedback
    feedback: Optional[List[Dict[str, str]]] = Field(
        description="List of specific feedback per SOAP section, with 'section' for the SOAP section name and 'comment' for feedback."
    )

# Data Model for the Summary Rewriter Agent
class SummaryRewriterDataModel(BaseModel):
    """Summarized Content by the Agent Summarizer"""
    subjective: str = Field(description="Edited Subjective section of the SOAP note")
    objective: str = Field(description="Edited Objective section of the SOAP note")
    assessment: str = Field(description="Edited Assessment section of the SOAP note")
    plan: str = Field(description="Edited Plan section of the SOAP note")