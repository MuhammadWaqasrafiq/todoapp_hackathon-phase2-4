# Data Model: Full-Stack Todo Application

## Entities

### 1. User
*Managed external to the core business logic (via Better Auth), but referenced in Tasks.*
- **id**: String (Primary Key, from Better Auth)
- **email**: String
- **created_at**: DateTime

### 2. Task
*The primary unit of work.*
- **id**: Integer (Primary Key, Auto-increment) - *Alternatively UUID if distributed, but Int is simpler for this scale.*
- **user_id**: String (Foreign Key to User.id, Indexed) - *Critical for isolation queries.*
- **title**: String (Required, Max Length 255)
- **description**: Text (Optional)
- **is_completed**: Boolean (Default: False)
- **created_at**: DateTime (Default: Now)
- **updated_at**: DateTime (Default: Now, On Update: Now)

## Relationships
- **User** (1) -> (N) **Task**
  - A user can have many tasks.
  - A task belongs to exactly one user.
  - *Cascade Delete*: If a user is deleted (conceptually), their tasks should be deleted.

## Validation Rules
- `title`: Must not be empty.
- `user_id`: Must match the authenticated user's ID from the JWT.
