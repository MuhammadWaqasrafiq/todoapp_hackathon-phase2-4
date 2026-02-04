import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins";

export const auth = betterAuth({
    /*
    database: new Pool({
        connectionString: process.env.DATABASE_URL,
    }),
    */
    emailAndPassword: {
        enabled: true,
    },
    plugins: [
        jwt()
    ],
    session: {
    },
    advanced: {
        cookiePrefix: "taskoo-v2", // Invalidate old opaque cookies
    },
    trustedOrigins: [
        ...(process.env.BETTER_AUTH_TRUSTED_ORIGINS ? process.env.BETTER_AUTH_TRUSTED_ORIGINS.split(",") : []),
        process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "",
        process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : ""
    ].filter(Boolean),
    baseURL: process.env.BETTER_AUTH_URL || "http://localhost:8000",
});
