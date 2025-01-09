import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});

	const [message, setMessage] = useState("");
	const [error, setError] = useState("");
	const navigate = useNavigate();

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setMessage("");
		setError("");

		try {
			const response = await axios.post(
				"http://localhost:5000/api/auth/login",
				formData
			);
			setMessage(response.data.message);

			// Store user data in localStorage
			localStorage.setItem("user", JSON.stringify(response.data.user));

			// Redirect to admin page if usertype is 'admin'
			if (response.data.user.usertype === "admin") {
				navigate("/admin");
			} else {
				// Otherwise, redirect to homepage
				navigate("/");
			}
		} catch (err) {
			setError(err.response?.data?.error || "Something went wrong!");
		}
	};

	return (
		<div>
			<h1>Login</h1>
			{message && <p style={{ color: "green" }}>{message}</p>}
			{error && <p style={{ color: "red" }}>{error}</p>}
			<form onSubmit={handleSubmit}>
				<input
					type="email"
					name="email"
					placeholder="Email"
					value={formData.email}
					onChange={handleChange}
					required
				/>
				<input
					type="password"
					name="password"
					placeholder="Password"
					value={formData.password}
					onChange={handleChange}
					required
				/>
				<button type="submit">Login</button>
			</form>
		</div>
	);
};

export default Login;
