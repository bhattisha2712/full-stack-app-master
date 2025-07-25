"use client";

import { useEffect, useState } from "react";
import RoleControl from "@/components/RoleControl";
import DeleteUserButton from "@/components/DeleteUserButton";

interface User {

_id: string; email: string; name: string; role: string;

}

export default function AdminUserPage() {
	const [users, setUsers] = useState<User[]>([]);
	const [error, setError] = useState("");
	const [page, setPage] = useState(1);
	const [limit] = useState(10);
	const [total, setTotal] = useState(0);

	const fetchUsers = async (pageNum = page) => {
		try {
			const res = await fetch(`/api/admin/users?page=${pageNum}&limit=${limit}`);
			if (!res.ok) throw new Error("Unauthorized");
			const data = await res.json();
			setUsers(data.users);
			setTotal(data.total);
		} catch {
			setError("Access denied or failed to load users.");
		}
	};
	useEffect(() => { fetchUsers(page); }, [page]);

	const totalPages = Math.ceil(total / limit);

	return (
		<main className='max-w-5xl mx-auto mt-10 p-6 bg-white shadow rounded'>
			<h1 className='text-2xl font-semibold mb-4'>User Management</h1>
			{error && <p className='text-red-600'>{error}</p>}
			<table className='w-full border-collapse text-sm'>
				<thead>
					<tr className='border-b'>
						<th className='text-left py-2 px-3'>Email</th>
						<th className='text-left py-2 px-3'>Name</th>
						<th className='text-left py-2 px-3'>Role</th>
						<th className='text-left py-2 px-3'>Actions</th>
					</tr>
				</thead>
				<tbody>
					{users.map((user) => (
						<tr key={user._id} className='border-b'>
							<td className='py-2 px-3'>{user.email}</td>
							<td className='py-2 px-3'>{user.name}</td>
							<td className='py-2 px-3 capitalize'>
								<RoleControl user={user} onRoleChanged={() => fetchUsers(page)} />
							</td>
							<td className='py-2 px-3'>
								<DeleteUserButton userId={user._id} onDeleted={() => fetchUsers(page)} />
							</td>
						</tr>
					))}
				</tbody>
			</table>
			{/* Pagination Controls */}
			<div className='flex justify-between items-center mt-4'>
				<button
					className='px-3 py-1 border rounded disabled:opacity-50'
					onClick={() => setPage((p) => Math.max(1, p - 1))}
					disabled={page === 1}
				>
					Previous
				</button>
				<span>
					Page {page} of {totalPages || 1}
				</span>
				<button
					className='px-3 py-1 border rounded disabled:opacity-50'
					onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
					disabled={page === totalPages || totalPages === 0}
				>
					Next
				</button>
			</div>
		</main>
	);
}