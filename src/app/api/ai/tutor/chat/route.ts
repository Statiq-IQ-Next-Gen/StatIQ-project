import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { BACKEND_URL } from "@/lib/backend";
import { cookies } from "next/headers";
import { SESSION_COOKIE } from "@/lib/auth/token";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  const body = await request.json();

  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  try {
    const backendRes = await fetch(`${BACKEND_URL}/api/tutor/chat`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(15000), // generous timeout for Groq
    });

    const data = await backendRes.json();
    return NextResponse.json(data, { status: backendRes.status });
  } catch (error) {
    console.error("[frontend-tutor-chat] Proxy Error:", error);
    return NextResponse.json({ error: "The AI Tutor is temporarily unavailable. Please try again." }, { status: 502 });
  }
}
