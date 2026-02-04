# Data Model: Agentic MCP System

## Entities

### User
*Managed externally by Better Auth, but referenced here.*
- **id**: String (Primary Key)
- **email**: String
- **name**: String

### Task
*Represents a unit of work to be tracked.*
- **id**: Integer (Primary Key, Auto-increment)
- **user_id**: String (Foreign Key -> User.id, Index)
- **title**: String (Required)
- **description**: String (Optional)
- **completed**: Boolean (Default: False)
- **created_at**: DateTime (Default: Now)
- **updated_at**: DateTime (Default: Now, OnUpdate: Now)

### Conversation
*Represents a chat session context.*
- **id**: Integer (Primary Key, Auto-increment)
- **user_id**: String (Foreign Key -> User.id, Index)
- **title**: String (Optional, e.g., "Grocery List Chat")
- **created_at**: DateTime (Default: Now)
- **updated_at**: DateTime (Default: Now)

### Message
*Represents a single turn in the conversation.*
- **id**: Integer (Primary Key, Auto-increment)
- **conversation_id**: Integer (Foreign Key -> Conversation.id, Index, Cascade Delete)
- **role**: String (Enum: "user", "assistant", "system", "tool")
- **content**: Text (Nullable, for text responses)
- **tool_calls**: JSON/Text (Nullable, stores tool invocation details)
- **tool_call_id**: String (Nullable, links tool output to tool call)
- **created_at**: DateTime (Default: Now)

## Relationships
- **User** has many **Tasks**.
- **User** has many **Conversations**.
- **Conversation** has many **Messages**.

## Validation Rules
- `title` cannot be empty.
- `user_id` is mandatory for all creations (Tenant Isolation).
- `role` must be valid OpenAI role.
