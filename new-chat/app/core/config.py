import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    """
    Application configuration settings loaded from environment variables or .env file.
    """
    app_name: str = "Pediatric Behavioral Chatbot API"
    openrouter_api_key: str
    openrouter_model: str = "openai/gpt-4o-mini"
    
    # Allows falling back to a .env file in the root of the project
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

# Initialize global settings instance
settings = Settings()
