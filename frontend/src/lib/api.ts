// src/lib/api.ts

import { authClient } from './auth-client';

const API_URL = 'http://localhost:8000'; // The URL of the FastAPI backend

// A function to get the session from wherever it's stored
async function getSession() {
  const session = await authClient.getSession();
  if (!session) {
    return { jwt: null };
  }
  return session;
}

// A helper function to make authenticated API requests
async function fetchFromApi(path: string, options: RequestInit = {}) {
  const session = await getSession();

  if (!session?.jwt) {
    // Or handle not-logged-in state appropriately
    throw new Error('No JWT token found. Please log in.');
  }

  const headers = {
    ...options.headers,
    'Content-Type': 'application/json',
    Authorization: `Bearer ${session.jwt}`,
  };

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  return response.json();
}

// API functions for tasks
export const getTasks = () => fetchFromApi('/tasks');
export const createTask = (title: string, description: string) =>
  fetchFromApi('/tasks', {
    method: 'POST',
    body: JSON.stringify({ title, description, status: 'pending' }),
  });
