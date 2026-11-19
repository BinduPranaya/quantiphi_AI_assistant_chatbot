from openai import OpenAI
from config import Config

TONE_INSTRUCTIONS = {
    "Professional": "Respond in a clear, formal, professional manner.",
    "Casual": "Respond in a friendly, natural, conversational manner.",
    "Concise": "Respond briefly and directly. Prefer short answers and avoid unnecessary detail."
}

def get_client():
    if not Config.OPENAI_API_KEY:
        raise RuntimeError("OPENAI_API_KEY is missing. Add it to backend/.env and restart the server.")
    return OpenAI(api_key=Config.OPENAI_API_KEY)

def stream_chat(messages, tone):
    client = get_client()
    tone_instruction = TONE_INSTRUCTIONS.get(tone, TONE_INSTRUCTIONS["Professional"])
    system_message = {
        "role": "system",
        "content": (
            "You are a helpful AI chat assistant. Answer accurately and clearly. "
            + tone_instruction
        )
    }
    safe_messages = []
    for item in messages[-20:]:
        role = item.get("role")
        content = item.get("content", "")
        if role in ("user", "assistant") and isinstance(content, str) and content.strip():
            safe_messages.append({"role": role, "content": content[:12000]})
    return client.chat.completions.create(
        model=Config.OPENAI_MODEL,
        messages=[system_message, *safe_messages],
        stream=True,
        temperature=0.7
    )
