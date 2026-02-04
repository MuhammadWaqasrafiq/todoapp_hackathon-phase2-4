from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from .db_init import main as init_database
from .api import auth_test, tasks, auth
from .api.routes import categories, chat
from .api.better_auth_doubled import root_router as better_auth_router, prefixed_router as legacy_better_auth_router
from .core.exceptions import AgentError, ToolExecutionError, MCPError

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_database()
    yield

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:3001", "http://127.0.0.1:3001"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

app.include_router(auth_test.router, prefix="/api")
app.include_router(tasks.router, prefix="/api")
app.include_router(auth.router, prefix="/api")  # Legacy endpoints
app.include_router(better_auth_router)  # Better Auth compatible endpoints at root
app.include_router(legacy_better_auth_router, prefix="/api/auth")  # Better Auth endpoints at expected path under /api/auth
app.include_router(categories.router, prefix="/api/categories", tags=["categories"])
app.include_router(chat.router)

@app.get("/")
def read_root():
    return {"message": "Hello World"}

import traceback
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Global exception occurred: {exc}\nTraceback: {traceback.format_exc()}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error", "error": str(exc)},
    )

@app.exception_handler(AgentError)
async def agent_error_handler(request: Request, exc: AgentError):
    logger.error(f"AgentError: {exc}")
    return JSONResponse(
        status_code=exc.status_code,
        content={"message": exc.detail},
    )

@app.exception_handler(ToolExecutionError)
async def tool_execution_error_handler(request: Request, exc: ToolExecutionError):
    logger.error(f"ToolExecutionError: {exc}")
    return JSONResponse(
        status_code=exc.status_code,
        content={"message": exc.detail},
    )

@app.exception_handler(MCPError)
async def mcp_error_handler(request: Request, exc: MCPError):
    logger.error(f"MCPError: {exc}")
    return JSONResponse(
        status_code=exc.status_code,
        content={"message": exc.detail},
    )