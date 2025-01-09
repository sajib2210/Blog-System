import React from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";
import axios from "axios";

const Navbar = () => {
	const navigate = useNavigate();

	const handleLogout = async () => {
		try {
			await axios.post("http://localhost:5000/api/auth/logout");

			// Clear user data from localStorage
			localStorage.removeItem("user");

			// Redirect to login page
			navigate("/login");
		} catch (err) {
			console.error("Logout failed: ", err.response?.data || err.message);
		}
	};

	return (
		<nav className="navbar">
			<div className="navbar-container">
				<button onClick={() => navigate("/")}>Home</button>
				<button onClick={() => navigate("/profile")}>Profile</button>
				<button onClick={handleLogout}>Logout</button>
			</div>
		</nav>
	);
};

export default Navbar;
