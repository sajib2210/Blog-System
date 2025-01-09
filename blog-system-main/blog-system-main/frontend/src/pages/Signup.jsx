import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
	const [formData, setFormData] = useState({
		phone_no: "",
		username: "",
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
				"http://localhost:5000/api/auth/signup",
				formData
			);
			setMessage(response.data.message);

			// Navigate to the login page after successful signup
			setTimeout(() => {
				navigate("/login");
			}, 2000);
		} catch (err) {
			setError(err.response?.data?.error || "Something went wrong!");
		}
	};

	return (
		<div>
			<h1>Signup</h1>
			{message && <p style={{ color: "green" }}>{message}</p>}
			{error && <p style={{ color: "red" }}>{error}</p>}
			<form onSubmit={handleSubmit}>
				<input
					type="text"
					name="phone_no"
					placeholder="Phone Number"
					value={formData.phone_no}
					onChange={handleChange}
					required
				/>
				<input
					type="text"
					name="username"
					placeholder="Username"
					value={formData.username}
					onChange={handleChange}
					required
				/>
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
				<button type="submit">Signup</button>
			</form>
		</div>
	);
};

export default Signup;
