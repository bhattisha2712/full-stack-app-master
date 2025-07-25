"use client";

import { useSession } from "next-auth/react";

export default function AdminPanel() {
    const { data: session } = useSession();
    const user = session && session.user ? (session.user as { role?: string }) : undefined;

    if (!user || user.role !== "admin") {
        return <p>Access Denied</p>;
    }

    return (
        <section>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p>Welcome, administrator.</p>
        </section>
    );
}
