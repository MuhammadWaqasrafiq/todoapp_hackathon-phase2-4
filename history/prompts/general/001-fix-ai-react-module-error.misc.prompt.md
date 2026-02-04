---
id: "001"
title: "fix-ai-react-module-error"
stage: "misc"
date: "2026-01-01"
surface: "agent"
model: "gemini-2.0-flash-exp"
feature: "frontend-chat"
branch: "main"
user: "DevAbdullah90"
command: "fix"
labels: ["bugfix", "typescript", "ai-sdk"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - "c:\\Users\\hp\\OneDrive\\Desktop\\ai-driven-development\\Hackathon-II\\Phase-II\\frontend\\package.json"
  - "c:\\Users\\hp\\OneDrive\\Desktop\\ai-driven-development\\Hackathon-II\\Phase-II\\frontend\\src\\hooks\\use-agent-chat.ts"
tests: []
prompt_text: |
  Explain what this problem is and help me fix it: Cannot find module 'ai/react' or its corresponding type declarations. @[c:\Users\hp\OneDrive\Desktop\ai-driven-development\Hackathon-II\Phase-II\frontend\src\hooks\use-agent-chat.ts:L1]
response_text: |
  Fixed the `Cannot find module 'ai/react'` error.
  
  The issue was caused by using the Vercel AI SDK v4, where `useChat` has been moved to a separate package.
  
  **Actions taken:**
  1.  Installed `@ai-sdk/react`.
  2.  Updated `import { useChat } from 'ai/react'` to `import { useChat } from '@ai-sdk/react'` in `use-agent-chat.ts`.
---

Fixed the `Cannot find module 'ai/react'` error.

The issue was caused by using the Vercel AI SDK v4, where `useChat` has been moved to a separate package.

**Actions taken:**
1.  Installed `@ai-sdk/react`.
2.  Updated `import { useChat } from 'ai/react'` to `import { useChat } from '@ai-sdk/react'` in `use-agent-chat.ts`.
