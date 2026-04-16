from pydantic import BaseModel, Field
from typing import List, Optional, Literal

class ChildData(BaseModel):
    child_name: str = Field(..., description="Name of the child")
    age: int = Field(..., description="Age of the child in years")
    test_type: Literal["Autism", "ADHD", "Behavior Issues"] = Field(
        ..., description="The type of assessment the child took"
    )
    score: float = Field(..., description="The severity or score from the assessment")  # ✅ تعديل هنا

class MessageRecord(BaseModel):
    role: Literal["user", "assistant", "system"] = Field(..., description="Role of the message sender")
    content: str = Field(..., description="The textual content of the message")

class ChatRequest(BaseModel):
    message: str = Field(..., description="The parent or teacher's message/question")
    child_data: ChildData = Field(..., description="The context data about the child")
    history: Optional[List[MessageRecord]] = Field(default=[])

class ChatResponse(BaseModel):
    reply: str = Field(..., description="The AI's response in simple Arabic")