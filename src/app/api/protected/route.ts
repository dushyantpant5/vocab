import { NextResponse } from "next/server";

export async function GET() {
  console.log("Hitting Protected Route");
  return NextResponse.json({ message: "Middleware is working!" });
}
