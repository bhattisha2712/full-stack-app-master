"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

export default function LoginPage() {
	const [form, setForm] = useState({ email: "", password: "" });
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const router = useRouter();
	const params = useSearchParams();
	// Show registration success message if redirected from registration
	useEffect(() => {
		if (params.get("registered")) {
			setSuccess("Registration successful! Please log in.");
		}
	}, [params]);
	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError("");
		const res = await signIn("credentials", {
			redirect: false,
			email: form.email,
			password: form.password,
		});
		if (res?.error) {
			setError("Invalid email or password");
		} else {
			router.push("/dashboard"); // Redirect on success
		}
	}
	return (
		<main className='max-w-md mx-auto mt-10 p-6 bg-white shadow rounded'>
			<h1 className='text-2xl font-bold mb-4'>Login</h1>
			{success && <p className='text-green-600'>{success}</p>}
			<form
				onSubmit={handleSubmit}
				className='space-y-4'>
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
				{error && <p className='text-red-600'>{error}</p>}
				<button
					type='submit'
					className='bg-blue-600 text-white px-4 py-2'>
					Sign In
				</button>
				<button
					type='button'
					onClick={() =>
						signIn("google", { callbackUrl: "/dashboard" })
					}
					className='bg-red-600 text-white px-4 py-2 mt-4'>
					Sign in with Google
				</button>
			</form>
		</main>
	);
}
