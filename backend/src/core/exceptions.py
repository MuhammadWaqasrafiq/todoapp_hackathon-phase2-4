from fastapi import HTTPException, status

class AgentError(HTTPException):
    def __init__(self, detail: str, status_code: int = status.HTTP_500_INTERNAL_SERVER_ERROR):
        super().__init__(status_code=status_code, detail=detail)

class ToolExecutionError(AgentError):
    def __init__(self, tool_name: str, detail: str, status_code: int = status.HTTP_500_INTERNAL_SERVER_ERROR):
        super().__init__(status_code=status_code, detail=f"Tool '{tool_name}' failed: {detail}")

class MCPError(AgentError):
    def __init__(self, detail: str, status_code: int = status.HTTP_500_INTERNAL_SERVER_ERROR):
        super().__init__(status_code=status_code, detail=f"MCP Server error: {detail}")
