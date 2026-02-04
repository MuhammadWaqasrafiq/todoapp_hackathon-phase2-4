from fastapi import Depends, HTTPException, status, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
import os
from dotenv import load_dotenv
from sqlmodel import Session as DBSession, select
from ..core.database import get_session
from ..models.auth_session import Session as AuthSession
from datetime import datetime, timezone

load_dotenv()

BETTER_AUTH_SECRET = os.getenv("BETTER_AUTH_SECRET")
ALGORITHM = "HS256"

security = HTTPBearer(auto_error=False)

def verify_token(
    request: Request = None, 
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: DBSession = Depends(get_session)
) -> str:
    """
    Verifies the token (JWT or Opaque) and returns the user_id.
    """
    candidate_tokens = []
    
    if credentials:
        print(f"DEBUG: Found credentials in header")
        candidate_tokens.append(("header", credentials.credentials))
    
    if request:
        print(f"DEBUG: Cookies received: {request.cookies.keys()}")
        print(f"DEBUG: Headers: {request.headers}")
        # Check taskoo-v2 first as it is the current prefix
        c2 = request.cookies.get("taskoo-v2.session_token")
        if c2: candidate_tokens.append(("taskoo-v2", c2))
        
        c1 = request.cookies.get("better-auth.session_token")
        if c1: candidate_tokens.append(("better-auth", c1))

    if not candidate_tokens:
          print("DEBUG: No token found")
          raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials: no token found",
                headers={"WWW-Authenticate": "Bearer"},
            )
    
    # Try multiple variations of the token to handle signing/encoding
    # 1. Raw token
    # 2. URL Decoded token
    # 3. Token part before '.' (removing signature)
    # 4. Decoded token part before '.'

    from urllib.parse import unquote

    for source, raw_token in candidate_tokens:
        print(f"DEBUG: Testing token from {source}")
        
        variations = [raw_token]
        decoded = unquote(raw_token)
        if decoded != raw_token:
            variations.append(decoded)
        
        if "." in raw_token:
            variations.append(raw_token.split(".")[0])
        if "." in decoded:
            variations.append(decoded.split(".")[0])
            
        # Deduplicate while preserving order
        unique_variations = []
        seen = set()
        for v in variations:
            if v not in seen:
                unique_variations.append(v)
                seen.add(v)

        for token in unique_variations:
            print(f"DEBUG: Checking variation: {token[:15]}...")

            # 1. Try JWT
            if BETTER_AUTH_SECRET and token.startswith("ey"):
                try:
                    # Only attempt if it looks like a JWT to avoid log spam
                    # print(f"DEBUG: Attempting to decode JWT...")
                    payload = jwt.decode(token, BETTER_AUTH_SECRET, algorithms=[ALGORITHM])
                    user_id = payload.get("sub") or payload.get("id") or payload.get("user_id")
                    if user_id:
                        print(f"DEBUG: JWT valid from {source}")
                        return user_id
                except jwt.PyJWTError as e:
                    pass # print(f"DEBUG: JWT Decode Error: {str(e)}")

            # 2. Fallback to Opaque/DB Token
            statement = select(AuthSession).where(AuthSession.token == token)
            session_record = db.exec(statement).first()

            if session_record:
                now = datetime.now(timezone.utc)
                
                # Ensure session_record.expiresAt is aware
                expires_at = session_record.expiresAt
                if expires_at.tzinfo is None:
                    expires_at = expires_at.replace(tzinfo=timezone.utc)
                    
                if expires_at > now:
                    print(f"DEBUG: Valid opaque session found via {source} (variation) for user {session_record.userId}")
                    return session_record.userId
                else:
                    print(f"DEBUG: Session expired for {source}")
            # else:
            #     print(f"DEBUG: No session record found for variation")

    # If loop completes without return
    print("DEBUG: All token candidates failed")
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

get_current_user = verify_token
