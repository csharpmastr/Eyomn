import sys
from logger import logging
from exception import CustomException
from pathlib import Path
from langchain_huggingface import HuggingFacePipeline


def construct_graph(
    supervisor_pipeline: HuggingFacePipeline,
    assistant_pipeline: HuggingFacePipeline,
    ophthal_pipeline: HuggingFacePipeline):
    from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
    from langchain_huggingface import ChatHuggingFace
    from langchain_core.messages import BaseMessage, SystemMessage
    from langgraph.graph import END, StateGraph, START
    from langgraph.prebuilt import create_react_agent
    
    from LangGraph.agent_tools import PatientData, SOAPNote
    from LangGraph.helper_utils import agent_node, validate_patient_data, validate_soap_note
    
    from pydantic import BaseModel
    from typing import Literal, Annotated
    import functools
    import operator
    from typing import Sequence
    from typing_extensions import TypedDict
    
    try:
        
        # configure the llm pipelines
        supervisor_pipeline.pipeline_kwargs = dict(
                task="text-generation",
                max_new_tokens=512,
                temperature=0.3,
                do_sample=False,
                repetition_penalty=1.03,
                top_p=0.95,
                top_k=50
            )
        assistant_pipeline.pipeline_kwargs = dict(
                task="text-generation",
                max_new_tokens=1628,
                temperature=0.1,
                do_sample=False,
                repetition_penalty=1.03,
                top_p=0.95,
                top_k=50
            )
        ophthal_pipeline.pipeline_kwargs = dict(
                task="text-generation",
                max_new_tokens=1024,
                temperature=0.1,
                do_sample=False,
                repetition_penalty=1.03,
                top_p=0.95,
                top_k=50
            )
        
        # define agent members
        members = ["Ophthalmic Medical Assistant", "Certified Ophthalmologist"]
        
        # Supervisor agent prompt setup
        system_prompt = (
            "With your extensive experience in managing clinical workflows, "
            "your role is to effectively handle communications between the following workers: "
            "{members}. Given the following user request, respond with the correct worker to act next. "
            "Each worker will perform a task and respond with their results and status. "
            "When finished, respond with FINISH."
        )
        options = ["FINISH"] + members
        
        class RouteResponse(BaseModel):
            next: Literal["FINISH", "Ophthalmic Medical Assistant", "Certified Ophthalmologist"]
        
        # Define supervisor prompt
        supervisor_prompt = ChatPromptTemplate.from_messages(
            [
                ("system", system_prompt),
                MessagesPlaceholder(variable_name="messages"),
                (
                    "system",
                    "Given the conversation above, who should act next? "
                    "Or should we FINISH? Select one of: {options}",
                ),
            ]
        ).partial(options=str(options), members=", ".join(members))
        
        # Configure Supervisor LLM
        supervisor_llm = ChatHuggingFace(llm=supervisor_pipeline)
        
        # Supervisor agent function
        def supervisor_agent(state):
            supervisor_chain = supervisor_prompt | supervisor_llm.with_structured_output(RouteResponse)
            return supervisor_chain.invoke(state)
        
        logging.info("Supervisor Agent Created")
        
        # Define agent state
        class AgentState(BaseModel):
            messages: Annotated[Sequence[BaseMessage], operator.add]
            next: str
        
        # Configure assistant LLM        
        assistant_llm = ChatHuggingFace(llm=assistant_pipeline).with_structured_output(PatientData)
        
        assistant_rp = SystemMessage(
            content=(
                "You are a Certified Ophthalmic Medical Assistant. Your task is to organize and "
                "prepare patient data for the Certified Ophthalmologist, ensuring it aligns with "
                "the required clinical data model. Structure your response in the format specified "
                "by the 'PatientRecord' model, with nested fields such as 'Observation', 'HealthHistory', "
                "'OcularHistory', and 'VisualAcuity'. Boolean fields should be True or False, while dates "
                "should match 'YYYY-MM-DD'."
            )
        )
        
        # bind tools with assistant agent
        assistant_agent_with_tools = assistant_llm.bind(tools=[validate_patient_data])
        #assistant_agent = create_react_agent(model=assistant_llm, tools=assistant_tools, state_modifier=assistant_rp)
        
        # Custom assistant agent logic function
        
        
        logging.info("Ophthalmic Assistant Agent Created")
        
        # Configure ophthalmologist LLM
        ophthal_llm = ChatHuggingFace(model=ophthal_pipeline).with_structured_output(SOAPNote)
        
        ophthal_rp = SystemMessage(
            content=(
                "You are a Certified Ophthalmologist. Your role is to review the structured patient data "
                "provided by the Ophthalmic Medical Assistant and convert it into a SOAP note format. "
                "Structure your response as a 'SOAPNote' with 'Subjective', 'Objective', 'Assessment', "
                "and 'Plan' sections. Return the structured data in JSON format following the 'SOAPNote' schema."
            )
        )
        
        ophthal_tools = [validate_soap_note]
        ophthal_agent = create_react_agent(model=ophthal_llm, tools=ophthal_tools, state_modifier=ophthal_rp)
        
        logging.info("Ophthal Agent Created")
        
        # Define agent nodes
        assistant_node = functools.partial(agent_node, agent=assistant_agent, name="Certified Ophthalmic Medical Assistant")
        ophthal_node = functools.partial(agent_node, agent=ophthal_agent, name="Certified Ophthalmologist")

        # Define the workflow graph
        workflow = StateGraph(AgentState)
        workflow.add_node("Certified Ophthalmic Medical Assistant", assistant_node)
        workflow.add_node("Certified Ophthalmologist", ophthal_node)
        workflow.add_node("supervisor", supervisor_agent)

        # Connect edges in the graph
        for member in members:
            workflow.add_edge(member, "supervisor")

        # Define conditional edges for the supervisor's routing
        conditional_map = {k: k for k in members}
        conditional_map["FINISH"] = END
        workflow.add_conditional_edges("supervisor", lambda x: x["next"], conditional_map)

        # Define the entry point for the workflow
        workflow.add_edge(START, "supervisor")

        return workflow.compile()
        
    except Exception as e:
        raise CustomException(e, sys)