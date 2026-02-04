import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { NextRequest } from "next/server";

const { GET: authGET, POST: authPOST } = toNextJsHandler(auth);

export const GET = async (req: NextRequest) => {
    return authGET(req);
}

export const POST = async (req: NextRequest) => {
    console.log("DEBUG: Auth Request URL:", req.url);
    console.log("DEBUG: Auth Request Origin:", req.headers.get("origin"));
    console.log("DEBUG: Better Auth Base URL:", process.env.BETTER_AUTH_URL);
    return authPOST(req);
}
