import { useState } from "react";

const Contact = () => {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		subject: "",
		message: "",
	});

	const handleChange = (event) => {
		const { name, value } = event.target;
		setFormData((current) => ({ ...current, [name]: value }));
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		const subject = encodeURIComponent(formData.subject || "YatraPulse enquiry");
		const body = encodeURIComponent(
			`From: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`,
		);
		window.location.href = `mailto:pandyanishit25@gmail.com?subject=${subject}&body=${body}`;
	};

	return (
		<main className="admin-login-page contact-page">
			<aside className="admin-login-aside" aria-label="YatraPulse contact">
				<div className="admin-login-aside-top">
					<span className="admin-login-kicker">YATRAPULSE / CONTACT</span>
					<span className="admin-login-index">02 — 03</span>
				</div>
				<div className="admin-login-aside-content">
					<p className="admin-login-overline">YOUR NEXT JOURNEY</p>
					<h1>Let&apos;s make it a good one.</h1>
					<div className="admin-login-rule" aria-hidden="true">
						<span />
					</div>
					<p className="admin-login-aside-note">
						Tell us what you&apos;re dreaming of. We&apos;re here to help you plan
						the details.
					</p>
				</div>
				<span className="admin-login-aside-footer">WE&apos;RE HERE TO HELP</span>
			</aside>

			<section className="admin-login-main">
				<div className="admin-login-layout">
					<form className="admin-login-form contact-form" onSubmit={handleSubmit}>
						<a className="admin-login-brand" href="/" aria-label="YatraPulse home">
							<img src="/YatraPulse_logo_transparent.png" alt="" />
						</a>

						<div className="admin-login-heading">
							<p className="admin-login-overline">GET IN TOUCH</p>
							<h2>We&apos;d love to hear from you</h2>
							<p>Send us a note and we&apos;ll help you find your way.</p>
						</div>

						<div className="admin-login-field">
							<label htmlFor="contact-name">Your name</label>
							<input
								id="contact-name"
								name="name"
								autoComplete="name"
								placeholder="Enter your name"
								value={formData.name}
								required
								onChange={handleChange}
							/>
						</div>

						<div className="admin-login-field">
							<label htmlFor="contact-email">Email address</label>
							<input
								type="email"
								id="contact-email"
								name="email"
								autoComplete="email"
								placeholder="you@example.com"
								value={formData.email}
								required
								onChange={handleChange}
							/>
						</div>

						<div className="admin-login-field">
							<label htmlFor="contact-subject">Subject</label>
							<input
								id="contact-subject"
								name="subject"
								placeholder="How can we help?"
								value={formData.subject}
								required
								onChange={handleChange}
							/>
						</div>

						<div className="admin-login-field">
							<label htmlFor="contact-message">Your message</label>
							<textarea
								id="contact-message"
								name="message"
								placeholder="Tell us a little about what you need..."
								value={formData.message}
								required
								rows="4"
								onChange={handleChange}
							/>
						</div>

						<button className="admin-login-submit" type="submit">
							<span>Compose message</span>
							<span aria-hidden="true">&#8594;</span>
						</button>

						<p className="admin-login-footnote">WE LOOK FORWARD TO HEARING FROM YOU</p>
					</form>
				</div>
			</section>
		</main>
	);
};

export default Contact;
