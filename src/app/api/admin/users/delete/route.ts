import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { userId } = await req.json();
    const client = await clientPromise;
    const db = client.db();

    const adminCount = await db.collection("users").countDocuments({ role: "admin" });
    const targetUser = await db.collection("users").findOne({ _id: new ObjectId(userId) });
    if (targetUser?.role === "admin" && adminCount === 1) {
        return NextResponse.json(
            { error: "Cannot delete the only admin account" },
            { status: 400 }
        );
    }

    await db.collection("users").deleteOne({ _id: new ObjectId(userId) });
    return NextResponse.json({ success: true });
}
