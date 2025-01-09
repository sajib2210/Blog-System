import db from "../db/connectMysqlDB.js";
import { generatePostID } from "../utils/generatePostId.js";
//import { generateTokenAndSetCookie } from "../utils/generateToken.js";

// Signup Controller
export const signup = (req, res) => {
	const { phone_no, username, email, password } = req.body;
	const user_id = generatePostID();

	const checkQuery = "SELECT email FROM users WHERE email = ?";

	db.query(checkQuery, [email], (err, result) => {
		if (err) {
			console.error("Error checking email:", err.message);
			return res.status(500).json({ error: "Internal server error" });
		}

		if (result.length > 0) {
			// Email already exists
			return res.status(400).json({ error: "Email already exists" });
		}

		const insertQuery = `INSERT INTO users (phone_no, user_id, username, email, password) VALUES (?, ?, ?, ?, ?)`;

		db.query(
			insertQuery,
			[phone_no, user_id, username, email, password],
			(err, result) => {
				if (err) {
					console.error("Error inserting user:", err.message);
					return res.status(500).json({ error: "Failed to sign up user" });
				}

				// Generate token and set it in a cookie
				//generateTokenAndSetCookie(user_id, res);

				// Successful insertion
				res.status(201).json({
					message: "User signed up successfully",
					userId: user_id, // Return the generated user_id
				});
			}
		);
	});
};

// Login Controller
export const login = (req, res) => {
	const { email, password } = req.body;

	// Check if the email exists in the database
	const query = "SELECT * FROM users WHERE email = ?";
	db.query(query, [email], (err, results) => {
		if (err) {
			console.error("Error checking user:", err.message);
			return res.status(500).json({ error: "Internal server error" });
		}

		if (results.length === 0) {
			// Email not found
			return res.status(404).json({ error: "User not found" });
		}

		const user = results[0];

		// Check if the provided password matches the stored password
		if (user.password !== password) {
			return res.status(401).json({ error: "Invalid password" });
		}

		// If email and password are correct
		res.status(200).json({
			message: "Login successful",
			user: {
				userId: user.user_id,
				username: user.username,
				email: user.email,
				usertype: user.usertype,
			},
		});
	});
};

// Logout Controller
export const logout = (req, res) => {
	res.status(200).json({
		message: "User logged out successfully",
	});
};

// Get All Users
export const getAllUsers = (req, res) => {
	const selectQuery = "SELECT user_id, username, email FROM users";

	db.query(selectQuery, (err, results) => {
		if (err) {
			console.error("Error fetching users:", err.message);
			return res.status(500).json({ error: "Failed to fetch users" });
		}

		res.status(200).json(results);
	});
};
