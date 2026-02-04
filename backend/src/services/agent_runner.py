from openai import OpenAI
from src.mcp.server import mcp
import os
import json
import logging
from src.core.exceptions import ToolExecutionError

logger = logging.getLogger(__name__)

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def convert_mcp_to_openai(tool):
    """
    Converts an MCP tool definition to OpenAI tool format.
    """
    return {
        "type": "function",
        "function": {
            "name": tool.name,
            "description": tool.description,
            "parameters": tool.inputSchema
        }
    }

async def run_agent(messages: list, user_id: str) -> dict:
    """
    Stateless run of the agent.
    1. Converts MCP tools to OpenAI format.
    2. Calls OpenAI API.
    3. Executes tools if requested.
    4. Recursively calls OpenAI until final answer.
    """
    
    # Dynamically get tool definitions from MCP server
    # FastMCP exposes tools directly
    mcp_tools = await mcp.list_tools()
    openai_tools = [convert_mcp_to_openai(tool) for tool in mcp_tools]
    
    # Prepend System Prompt
    system_prompt = {
        "role": "system",
        "content": (
            f"You are a helpful task management assistant called Taskoo. "
            f"The current user's ID is '{user_id}'. "
            f"You do NOT need to ask the user for their ID. "
            f"When calling tools like 'add_task' or 'list_tasks', use this ID automatically."
        )
    }
    
    current_messages = [system_prompt] + messages.copy()
    
    # Limit recursion
    max_turns = 5
    
    for _ in range(max_turns):
        response = client.chat.completions.create(
            model="gpt-4o", # or gpt-3.5-turbo
            messages=current_messages,
            tools=openai_tools if openai_tools else None,
            tool_choice="auto" if openai_tools else None
        )
        
        message = response.choices[0].message
        current_messages.append(message)
        
        if message.tool_calls:
            for tool_call in message.tool_calls:
                function_name = tool_call.function.name
                arguments = json.loads(tool_call.function.arguments)
                
                # Security: Force user_id to be the authenticated one for tool execution
                arguments["user_id"] = user_id
                
                # Execute tool using MCP server
                try:
                    # FastMCP call_tool expects arguments as a dictionary, not unpacked kwargs
                    tool_result = await mcp.call_tool(function_name, arguments)
                except Exception as e:
                    logger.error(f"Error executing tool '{function_name}': {e}")
                    raise ToolExecutionError(tool_name=function_name, detail=str(e))
                
                current_messages.append({
                    "role": "tool",
                    "tool_call_id": tool_call.id,
                    "content": str(tool_result) # Tool results are often strings or stringifyable
                })
        else:
            # No tool calls, return final response
            return {
                "response": message.content,
                "tool_calls": [tc.model_dump() for tc in (message.tool_calls or [])],
                "final_messages": current_messages # Optional: return full history update
            }
            
    return {"response": "Agent step limit reached.", "tool_calls": []}