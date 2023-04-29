from inference_service.prompts import prompt_chunks
from inference_service.context.context_retriever import pull_context


def generate_gpt_prompt(context, subject_modifier):
    try:
        subject_prompt = prompt_chunks.PROMPT_MAP[subject_modifier]
    except KeyError:
        subject_prompt = prompt_chunks.DEFAULT_PROMPT
    context = pull_context()
    subject_plus_context = (
        subject_prompt
        + "\n Use the following context to help answer the next question. \n Context:\n"
        + context
    )
