# AI Chatbot Integration Guide

## ✅ Integration Complete!

Your Node.js app is now configured to communicate with the Python chatbot service.

## Quick Start

### 1. **Start the Python Chatbot Service**

```bash
cd new-chat
python -m venv venv

# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
cp .env.example .env  # Add your OpenRouter API key

uvicorn app.main:app --reload
```

The chatbot will run on `http://localhost:8000`

### 2. **Start Your Node.js Backend**

```bash
npm run dev
```

The app will run on `http://localhost:5000`

---

## API Endpoint

### Send a Message to the Chatbot

**POST** `http://localhost:5000/api/v1/chat`

**Request Body:**

```json
{
  "message": "My child has ADHD, what should I do?",
  "childData": {
    "age": 7,
    "condition": "ADHD",
    "name": "Ahmed"
  },
  "history": []
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "type": "text",
    "message": "هنلاقي حل يناسب طفلك..."
  }
}
```

---

## Project Structure After Integration

```
app.js                          # Now includes chatbot routes
routes/
  ├── chatbot.routes.js         # NEW: Chat endpoint routes
  └── ... (other routes)

controllers/
  ├── chatbot.controller.js     # NEW: Handles chatbot requests
  └── ... (other controllers)

.env                            # Updated with CHATBOT_API_URL
```

---

## Key Features

✅ **Error Handling**: Connection errors, service unavailable, invalid requests<br>
✅ **Proxy Pattern**: Your Node.js app acts as a gateway to the Python service<br>
✅ **Configurable**: Change chatbot URL in `.env` file<br>
✅ **Async**: Non-blocking HTTP requests<br>

---

## Troubleshooting

| Issue                     | Solution                                                |
| ------------------------- | ------------------------------------------------------- |
| `ECONNREFUSED`            | Make sure the Python chatbot is running on port 8000    |
| `503 Service Unavailable` | Check if the chatbot service is responding              |
| Wrong response format     | Ensure chatbot `.env` has OpenRouter API key configured |

---

## Optional: Environment Setup

If you haven't set up the Python chatbot `.env` yet:

```bash
cd new-chat
cp .env.example .env
```

Then edit `.env` and add your **OpenRouter API key**:

```
OPENROUTER_API_KEY=your_api_key_here
```

---

## Next Steps

1. ✅ Test the endpoint using Postman or cURL
2. 🔄 Integrate with your frontend to send chat messages
3. 📊 Add authentication/authorization if needed
4. 🚀 Deploy both services (Node.js and Python) to production
