import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Admin.css";

const Admin = () => {
	const [users, setUsers] = useState([]);
	const [posts, setPosts] = useState([]);
	const navigate = useNavigate();

	// Fetch all users and posts for the admin
	useEffect(() => {
		const fetchAdminData = async () => {
			try {
				// Fetch users list
				const usersResponse = await axios.get(
					"http://localhost:5000/api/auth/users"
				);
				setUsers(usersResponse.data);

				// Fetch all posts
				const postsResponse = await axios.get(
					"http://localhost:5000/api/posts"
				);
				setPosts(postsResponse.data);
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};

		fetchAdminData();
	}, []);

	// Handle delete post
	const handleDeletePost = async (postId) => {
		if (window.confirm("Are you sure you want to delete this post?")) {
			try {
				await axios.delete(`http://localhost:5000/api/posts/${postId}`);
				// Refresh posts after deletion
				setPosts(posts.filter((post) => post.postID !== postId));
				alert("Post deleted successfully!");
			} catch (error) {
				console.error("Failed to delete post:", error);
				alert("Failed to delete post.");
			}
		}
	};

	// Handle boost post
	const handleBoostPost = async (postId) => {
		// Prompt to input boost duration in hours (e.g., 24 for 1 day)
		const duration = prompt("Enter the boost duration in hours:");

		if (!duration || isNaN(duration) || duration <= 0) {
			alert("Invalid duration!");
			return;
		}

		try {
			// Send request to backend to boost the post
			await axios.post("http://localhost:5000/api/boosted", {
				postID: postId,
				duration: parseInt(duration),
			});
			alert("Post boosted successfully!");
		} catch (error) {
			console.error("Error boosting post:", error);
			alert("Failed to boost post.");
		}
	};

	// Handle logout
	const handleLogout = () => {
		// Remove user data from localStorage
		localStorage.removeItem("user");
		// Redirect to login page
		navigate("/login");
	};

	return (
		<div className="admin-page">
			<h1>Admin Dashboard</h1>

			{/* Logout Button */}
			<button onClick={handleLogout} className="logout-button">
				Logout
			</button>

			<div className="users-section">
				<h2>All Users</h2>
				<ul>
					{users.map((user) => (
						<li key={user.user_id}>
							{user.username} - {user.email} - {user.usertype}
						</li>
					))}
				</ul>
			</div>

			<div className="posts-section">
				<h2>All Posts</h2>
				<ul>
					{posts.map((post) => (
						<li key={post.postID}>
							<h4>{post.title}</h4>
							<p>{post.description}</p>
							{post.picture && <img src={post.picture} alt={post.title} />}
							<button onClick={() => handleDeletePost(post.postID)}>
								Delete
							</button>
							<button onClick={() => handleBoostPost(post.postID)}>
								Boost
							</button>{" "}
							{/* Boost Button */}
						</li>
					))}
				</ul>
			</div>
		</div>
	);
};

export default Admin;
