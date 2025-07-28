import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";

export async function POST(req: NextRequest): Promise<Response> {
  const { stock_symbol } = await req.json();

  return await new Promise((resolve) => {
    const python = spawn("python", ["./stock_predict/predict.py", stock_symbol]);
    let result = "";

    python.stdout.on("data", (data) => {
      result += data.toString();
    });

    python.on("close", () => {
      resolve(NextResponse.json({ prediction: result.trim() }));
    });
  });
}
