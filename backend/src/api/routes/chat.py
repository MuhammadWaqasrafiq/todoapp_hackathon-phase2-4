from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import Optional, List, Any
from sqlmodel import Session
from src.core.database import get_session
from src.core.security import verify_token
from src.services.history_service import HistoryService
from src.services.agent_runner import run_agent

router = APIRouter()

@router.get("/api/chat/health")
async def chat_health_check():
    return {"status": "ok"}

class Message(BaseModel):
    role: str
    content: str

class ChatSDKRequest(BaseModel):
    messages: List[Message]
    conversation_id: Optional[int] = None

class ChatResponse(BaseModel):
    conversation_id: int
    response: Optional[str] = None
    tool_calls: Optional[List[Any]] = None

class MessageResponse(BaseModel):
    id: str
    role: str
    content: Optional[str] = None
    tool_calls: Optional[List[Any]] = None

@router.get("/api/{user_id}/chat", response_model=List[MessageResponse])
async def get_chat_history(
    user_id: str,
    conversation_id: Optional[int] = None,
    token_user_id: str = Depends(verify_token),
    session: Session = Depends(get_session)
):
    if user_id != token_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User ID mismatch"
        )
    
    history_service = HistoryService(session, user_id)
    conversation = history_service.get_or_create_conversation(conversation_id)
    messages = history_service.get_messages(conversation.id)
    
    response = []
    for msg in messages:
        response.append(MessageResponse(
            id=str(msg.id),
            role=msg.role,
            content=msg.content,
            tool_calls=msg.tool_calls
        ))
    return response

@router.post("/api/{user_id}/chat", response_model=ChatResponse)
async def chat_endpoint(
    user_id: str,
    request: ChatSDKRequest,
    token_user_id: str = Depends(verify_token),
    session: Session = Depends(get_session)
):
    print(f"DEBUG: Starting chat request for user {user_id}")
    try:
        if user_id != token_user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User ID mismatch"
            )

        # Get the last message from the user
        if not request.messages:
            raise HTTPException(status_code=400, detail="No messages provided")
            
        last_message = request.messages[-1]
        if last_message.role != "user":
            raise HTTPException(status_code=400, detail="Last message must be from user")

        history_service = HistoryService(session, user_id)
        conversation = history_service.get_or_create_conversation(request.conversation_id)
        
        # Add User Message to DB
        history_service.add_message(
            conversation_id=conversation.id,
            role="user",
            content=last_message.content
        )
        
        # Fetch History (we could just use the passed messages, but DB is source of truth)
        db_messages = history_service.get_messages(conversation.id)
        openai_messages = []
        for msg in db_messages:
            m = {"role": msg.role, "content": msg.content or ""} # Ensure content is at least empty string if None
            if msg.tool_calls:
                m["tool_calls"] = msg.tool_calls
            if msg.tool_call_id:
                m["tool_call_id"] = msg.tool_call_id
            openai_messages.append(m)
            
        # Run Agent
        print(f"DEBUG: Calling run_agent with {len(openai_messages)} messages")
        agent_result = await run_agent(openai_messages, user_id)
        
        response_text = agent_result.get("response")
        tool_calls = agent_result.get("tool_calls")
        
        history_service.add_message(
            conversation_id=conversation.id,
            role="assistant",
            content=response_text,
            tool_calls=tool_calls
        )

        return ChatResponse(
            conversation_id=conversation.id,
            response=response_text,
            tool_calls=tool_calls
        )
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")