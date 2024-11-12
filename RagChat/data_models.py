from typing import Literal
from pydantic import BaseModel, Field

# Data Model for Grading Documents
class GradeDocuments(BaseModel):
    """Binary score for relevance check on retrieved documents."""
    score: str = Field(description="Documents are relevant to the question, 'yes' or 'no'")

# Data Model to store Memory
class SummarizedMemory(BaseModel):
    """Store a summary of conversation history"""
    summarized_convo: str = Field(description="Summarized Conversation History")

# Data Model for the Router Node
class RouteQuery(BaseModel):
    """Route a user query to the most relevant datasource."""
    context: Literal["vectorstore", 'acquired_knowledge'] = Field(
        description="Given a user question choose to route it to web search or a vectorstore.",
    )

# Data Model for the Hallucination Checker
class GradeHallucinations(BaseModel):
    """Binary score for hallucination present in generation answer."""
    score: str = Field(description="Answer is grounded in the facts, 'yes' or 'no'")

# Data Model for the Answer Grader
class GradeAnswer(BaseModel):
    """Binary score to assess answer addresses question."""
    score: str = Field(description="Answer addresses the question, 'yes' or 'no'")



