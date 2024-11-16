from logger import logging
from exception import CustomException
import yaml
import sys
from pathlib import Path

# FUNCTION TO LOAD AND RETRIEVE SYSTEM PROMPTS
def load_sys_prompts(file_path: Path):
    try:
        # LOAD PROMPTS FROM YAML FILE
        with open(file_path, 'r') as file:
            prompts = yaml.safe_load(file)
        
        logging.info("System Prompts Loaded")
        
        return prompts
    except Exception as e:
        raise CustomException(e, sys)

# FUNCTION TO PARSE AGENT FEEDBACK
def build_feedback_parser(state):
    # INITIALIZE feedback_summary DICT
    feedback_summary = {}
    # CHECK IF FEEDBACK IS PRESENT IN THE RESPONSE
    feedback = state.get("feedback", [])

    # MAP EACH FEEDBACK SECTION TO feedback_summary DICT
    for item in feedback:
        section = item.get('section')
        comment = item.get('comment')
        if section and comment:
            feedback_summary[section.lower()] = comment
    
    return feedback_summary