"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
	const router = useRouter();
	const [form, setForm] = useState({ name: "", email: "", password: "" });
	const [error, setError] = useState("");

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError("");

		const res = await fetch("/api/register", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(form),
		});

		const data = await res.json();
		if (!res.ok) {
			setError(data.error || "Registration failed");
		} else {
			router.push("/login?registered=1");
		}
	}

	return (
		<main className='max-w-md mx-auto mt-10 p-6 bg-white shadow rounded'>
			<h1 className='text-2xl font-bold mb-4'>Register</h1>

			<form
				onSubmit={handleSubmit}
				className='space-y-4'>
				<input
					type='text'
					placeholder='Name'
					value={form.name}
					onChange={(e) =>
						setForm({ ...form, name: e.target.value })
					}
					required
					className='w-full border px-3 py-2'
				/>

				<input
					type='email'
					placeholder='Email'
					value={form.email}
					onChange={(e) =>
						setForm({ ...form, email: e.target.value })
					}
					required
					className='w-full border px-3 py-2'
				/>

				<input
					type='password'
					placeholder='Password'
					value={form.password}
					onChange={(e) =>
						setForm({ ...form, password: e.target.value })
					}
					required
					className='w-full border px-3 py-2'
				/>

				{error && <p className='text-red-500'>{error}</p>}

				<button
					type='submit'
					className='bg-blue-600 text-white px-4 py-2'>
					Register
				</button>
			</form>
		</main>
	);
}
