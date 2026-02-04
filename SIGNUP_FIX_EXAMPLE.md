# Fixed SignUp Function for Better Auth

## Correct Implementation for page.tsx

Here's how your signup function should be implemented in your page.tsx file to work with the updated Better Auth configuration:

```typescript
"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";  // This now uses the proper Better Auth client
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Correct Better Auth syntax - signUp.email({...})
      const response = await authClient.signUp.email({
        email,
        password,
        name,  // Optional - depending on your needs
      });

      if (response.error) {
        setError(response.error.message || "Sign up failed");
      } else {
        // Successful signup - redirect to dashboard or wherever needed
        console.log("Signup successful:", response.data);
        router.push("/dashboard"); // or wherever you want to redirect
      }
    } catch (err: any) {
      console.error("Signup error:", err);
      setError(err.message || "An error occurred during signup");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              {error}
            </div>
          )}

          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Sign up"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
```

## Key Points:

1. **Correct Syntax**: `authClient.signUp.email({ email, password, name })` - this is the proper Better Auth client-side syntax
2. **Proper Import**: The authClient is now properly configured to work with Better Auth
3. **Backend Compatibility**: The backend now has Better Auth-compatible endpoints at `/sign-up/email`, `/sign-in/email`, and `/sign-out`
4. **Error Handling**: Proper error handling for both client and server responses

## Backend Endpoints Available:
- `POST /sign-up/email` - Better Auth compatible signup
- `POST /sign-in/email` - Better Auth compatible signin
- `POST /sign-out` - Better Auth compatible signout
- `POST /api/auth/register` - Legacy endpoint (still available)
- `POST /api/auth/login` - Legacy endpoint (still available)

Your signup form should now work properly with the `authClient.signUp.email()` method!