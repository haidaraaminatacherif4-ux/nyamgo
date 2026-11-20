import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  (await cookies()).set("nyamgo_session", "", { expires: new Date(0), path: "/" });
  return NextResponse.json({ ok: true });
}
