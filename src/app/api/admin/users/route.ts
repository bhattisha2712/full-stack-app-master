import { getServerSession } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
	const session = await getServerSession(authOptions);
	if (!session || session.user.role !== "admin") {
		return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
	}

	// Pagination
	const url = new URL(req.url);
	const page = parseInt(url.searchParams.get("page") || "1", 10);
	const limit = parseInt(url.searchParams.get("limit") || "10", 10);
	const skip = (page - 1) * limit;

	const client = await clientPromise;
	const db = client.db();
	const users = await db
		.collection("users")
		.find({}, { projection: { password: 0 } })
		.skip(skip)
		.limit(limit)
		.toArray();
	const total = await db.collection("users").countDocuments();

	return NextResponse.json({ users, total });
}
