
import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
	if (req.method && req.method !== "POST") {
	  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
	}
	const { name, email, password } = await req.json();
	const client = await clientPromise;
	const db = client.db();
	const existing = await db.collection("users").findOne({ email });
	if (existing) {
	  return NextResponse.json(
		{ error: "Email already exists" },
		{ status: 409 }
	  );
	}
	const hashedPassword = await hash(password, 12);
	const result = await db.collection("users").insertOne({
	  name,
	  email,
	  password: hashedPassword,
	  role: "user",
	  createdAt: new Date(),
	});
	return NextResponse.json({ success: true, userId: result.insertedId });
  } catch (error: any) {
	return NextResponse.json({ error: error?.message || "Internal server error" }, { status: 500 });
  }
}
