import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
	try {
		const client = await clientPromise;
		const db = client.db();
		const collections = await db.listCollections().toArray();
		const database_name = db.databaseName;
		return NextResponse.json({ database_name, collections });
	} catch (error) {
		return NextResponse.json(
			{ error: "Database connection failed" },
			{ status: 500 }
		);
	}
}
