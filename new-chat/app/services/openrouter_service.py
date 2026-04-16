import httpx
from fastapi import HTTPException
from app.core.config import settings
from typing import List, Dict

class OpenRouterService:
    def __init__(self):
        self.api_key = settings.openrouter_api_key
        
        # ✅ CHECK مهم
        if not self.api_key:
            raise ValueError("OPENROUTER_API_KEY is missing. Please add it to your .env file.")
        
        self.model = settings.openrouter_model
        self.url = "https://openrouter.ai/api/v1/chat/completions"
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": "https://myapp.com",
            "X-Title": "Pediatric Behavioral Chatbot",
        }

    async def chat(self, messages: List[Dict]) -> str:
        payload = {
            "model": self.model,
            "messages": messages,
            "temperature": 0.4  # ✅ تعديل مهم
        }

        async with httpx.AsyncClient(timeout=30.0) as client:
            try:
                response = await client.post(
                    self.url,
                    headers=self.headers,
                    json=payload
                )
                response.raise_for_status()
                data = response.json()

                if "choices" in data and len(data["choices"]) > 0:
                    return data["choices"][0]["message"]["content"]
                else:
                    raise HTTPException(status_code=500, detail="Invalid response format from OpenRouter.")

            except httpx.HTTPStatusError as e:
                print(f"HTTPStatusError: {e.response.text}")
                raise HTTPException(status_code=e.response.status_code, detail=f"OpenRouter API error: {e.response.text}")

            except httpx.RequestError as e:
                print(f"RequestError: {str(e)}")
                raise HTTPException(status_code=500, detail="Network error communicating with OpenRouter.")

            except Exception as e:
                print(f"Unexpected error: {str(e)}")
                raise HTTPException(status_code=500, detail="An unexpected error occurred during the API call.")


openrouter_service = OpenRouterService()