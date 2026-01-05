from sqlalchemy import Column, String, DateTime
from sqlalchemy.sql import func
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True) # Corresponds to 'sub' claim from JWT
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # We will not store full user data here, primarily just what's needed to link tasks
    # and potentially for internal password verification if a local signup is also allowed.
