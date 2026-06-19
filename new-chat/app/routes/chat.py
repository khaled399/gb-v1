from fastapi import APIRouter
from app.models.schemas import ChatRequest
from app.utils.prompt_builder import build_prompt
from app.services.openrouter_service import openrouter_service
import json
import traceback

router = APIRouter(prefix="/api/v1", tags=["Chat"])

@router.post("/chat")
async def chat_endpoint(request: ChatRequest):

    # 1. Build prompt
    messages_payload = build_prompt(
        child_data=request.child_data,
        user_message=request.message,
        history=request.history
    )

    # 2. Call AI
    try:
        reply_content = await openrouter_service.chat(messages=messages_payload)
    except Exception as e:
        print(f"Error calling OpenRouter: {str(e)}")
        traceback.print_exc()
        return {
            "type": "error",
            "message": str(e)
        }

    # 3. حاول نحوله JSON
    try:
        parsed = json.loads(reply_content)
        return parsed
    except json.JSONDecodeError as e:
        print(f"JSON parse error: {str(e)}")
        print(f"Reply content: {reply_content}")
        # fallback لو AI بعت string مش JSON
        return {
            "type": "text",
            "message": reply_content
        }