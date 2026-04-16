# AI Pediatric Behavioral Chatbot Backend

This is a production-ready FastAPI backend for a pediatric behavioral consultant app.
It utilizes the **OpenRouter API** to provide an intelligent, context-aware chatbot capable of empathizing with parents and providing practical home solutions for issues like Autism, ADHD, and general Behavior Issues, all in simple Arabic.

## Project Structure
- `app/main.py`: Application entry point.
- `app/core/config.py`: Environment variable configuration.
- `app/models/schemas.py`: Pydantic input/output schemas.
- `app/routes/chat.py`: API endpoint definitions.
- `app/services/openrouter_service.py`: Asynchronous OpenRouter API client integration.
- `app/utils/prompt_builder.py`: Core system prompt injection and condition management.

## Setup and Running Locally

1. Create a virtual environment and activate it:
   ```bash
   python -m venv venv
   # Windows:
   venv\Scripts\activate
   # macOS/Linux:
   source venv/bin/activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Setup environment variables:
   Copy `.env.example` to `.env` and fill in your OpenRouter API key.
   ```bash
   cp .env.example .env
   ```

4. Run the server:
   ```bash
   uvicorn app.main:app --reload
   ```

5. Go to `http://127.0.0.1:8000/docs` to see the automated Swagger UI documentation.

---

## Example Request for Postman

**POST** `http://127.0.0.1:8000/api/v1/chat`

**Headers**:
- `Content-Type`: `application/json`

**Body** (JSON):

```json
{
  "message": "ابني بيتحرك كتير جداً ومش بيركز خالص وأنا خايفة يكون عنده مشكلة كبيرة، أعمل إيه؟",
  "child_data": {
    "child_name": "أحمد",
    "age": 7,
    "test_type": "ADHD",
    "score": "High Risk"
  },
  "history": [
    {
      "role": "user",
      "content": "مرحباً، هل يمكنك مساعدتي؟"
    },
    {
      "role": "assistant",
      "content": "أهلاً بك. بالتأكيد، أنا هنا لمساعدتك. تفضل؟"
    }
  ]
}
```

## AI Flow Logic
- Checks child context (name, age, type, score).
- Embeds rules to force simple Arabic, avoid medical diagnosis, but give practical tips.
- Evaluates emotion (e.g., if afraid => reassure -> explain -> tips).
- Sends full conversation (System prompt + History + New User message) to OpenRouter API (by default: `openai/gpt-4o-mini`).
