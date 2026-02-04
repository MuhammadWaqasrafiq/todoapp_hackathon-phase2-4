from sqlmodel import Session, select
from src.models.conversation import Conversation
from src.models.message import Message
from typing import List, Optional

class HistoryService:
    def __init__(self, session: Session, user_id: str):
        self.session = session
        self.user_id = user_id

    def get_or_create_conversation(self, conversation_id: Optional[int] = None) -> Conversation:
        if conversation_id:
            statement = select(Conversation).where(
                Conversation.id == conversation_id, 
                Conversation.user_id == self.user_id
            )
            conversation = self.session.exec(statement).first()
            if conversation:
                return conversation
        
        # Create new if not found or not provided
        conversation = Conversation(user_id=self.user_id)
        self.session.add(conversation)
        self.session.commit()
        self.session.refresh(conversation)
        return conversation

    def add_message(self, conversation_id: int, role: str, content: str, tool_calls: Optional[any] = None, tool_call_id: Optional[str] = None):
        message = Message(
            conversation_id=conversation_id,
            role=role,
            content=content,
            tool_calls=tool_calls,
            tool_call_id=tool_call_id
        )
        self.session.add(message)
        self.session.commit()
        self.session.refresh(message)
        return message

    def get_messages(self, conversation_id: int) -> List[Message]:
        statement = select(Message).where(Message.conversation_id == conversation_id).order_by(Message.created_at)
        return self.session.exec(statement).all()
