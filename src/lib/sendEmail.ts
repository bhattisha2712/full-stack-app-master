import nodemailer from "nodemailer";

export async function sendSecurityEmail(subject: string, text: string) {
	const transporter = nodemailer.createTransport({
		host: process.env.SMTP_SERVER,
		auth: {
			user: process.env.SMTP_USER,
			pass: process.env.SMTP_PASS,
		},
	});

	await transporter.sendMail({
		from: "Security Alerts <alerts@example.com>",
		to: process.env.ADMIN_ALERT_EMAIL,
		subject,
		text,
	});
}
