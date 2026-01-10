import { betterAuth } from 'better-auth';
import { jwt } from 'better-auth/plugins';
import { Pool } from 'pg';

export const auth = betterAuth({
  // 'adapter' aur 'pgAdapter' ki jagah sirf 'database' likhen
  database: new Pool({
    connectionString: process.env.DATABASE_URL,
  }),
  plugins: [
    jwt({
      jwt: {
        issuer: 'better-auth',
        expiresIn: '7d',
      },
    }),
  ],
  secret: process.env.BETTER_AUTH_SECRET,
});