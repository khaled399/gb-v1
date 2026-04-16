from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.routes.chat import router as chat_router

app = FastAPI(
    title=settings.app_name,
    description="Backend API for AI Pediatric Behavioral Consultant",
    version="1.0.0"
)

# Configure CORS
# In production, specify the allowed origins appropriately.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace "*" with explicit URLs in production (e.g., frontend/mobile domain)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include application routers
app.include_router(chat_router)

@app.get("/", tags=["Health"])
async def root():
    return {"message": "Welcome to the Pediatric Behavioral Chatbot API. Navigate to /docs for the interactive API documentation."}
