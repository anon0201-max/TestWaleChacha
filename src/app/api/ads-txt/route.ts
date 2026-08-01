import { NextResponse } from "next/server";

export async function GET() {
  return new NextResponse(
    `google.com, pub-1061914422695539, DIRECT, f08c47fec0942fa0\n`,
    {
      headers: {
        "Content-Type": "text/plain",
      },
    }
  );
}
