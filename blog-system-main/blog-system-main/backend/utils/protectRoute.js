// import jwt from "jsonwebtoken";

// export const protectRoute = (req, res, next) => {
// 	// Get the token from cookies
// 	const token = req.cookies.jwt;

// 	// If no token is found, deny access
// 	if (!token) {
// 		return res.status(401).json({ error: "Access denied, please log in" });
// 	}

// 	try {
// 		// Verify the token
// 		const decoded = jwt.verify(token, process.env.JWT_SECRET);

// 		// Attach the user's information (from token payload) to the request
// 		req.user = decoded;

// 		// Proceed to the next middleware or route handler
// 		next();
// 	} catch (err) {
// 		console.error("Token verification failed:", err.message);
// 		return res.status(403).json({ error: "Invalid or expired token" });
// 	}
// };
