import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Profile.css";
import Navbar from "../components/Navbar";

const Profile = () => {
	const [userData, setUserData] = useState(null);
	const [userPosts, setUserPosts] = useState([]);
	const [sharedPosts, setSharedPosts] = useState([]); // Shared posts
	const [following, setFollowing] = useState([]);
	const [editingPost, setEditingPost] = useState(null);
	const [updatedPost, setUpdatedPost] = useState({
		title: "",
		description: "",
		picture: "",
	});

	const navigate = useNavigate();

	const handleUpdatePost = async (postID) => {
		try {
			await axios.put(`http://localhost:5000/api/posts/${postID}`, updatedPost);
			const response = await axios.get(
				`http://localhost:5000/api/posts/${userData.userId}`
			);
			setUserPosts(response.data);
			alert("Post updated successfully!");
			setEditingPost(null);
			setUpdatedPost({ title: "", description: "", picture: "" });
		} catch (err) {
			console.error("Error updating post:", err.response?.data || err.message);
			alert("Failed to update post.");
		}
	};

	const handleDeletePost = async (postID) => {
		if (!window.confirm("Are you sure you want to delete this post?")) return;

		try {
			await axios.delete(`http://localhost:5000/api/posts/${postID}`);
			const response = await axios.get(
				`http://localhost:5000/api/posts/${userData.userId}`
			);
			setUserPosts(response.data);
			alert("Post deleted successfully!");
		} catch (err) {
			console.error("Error deleting post:", err.response?.data || err.message);
			alert("Failed to delete post.");
		}
	};

	useEffect(() => {
		const fetchUserData = async () => {
			const user = JSON.parse(localStorage.getItem("user"));
			if (!user) {
				navigate("/login");
				return;
			}

			const userId = user.userId;

			try {
				// Fetch user info (name, id)
				const userInfoResponse = await axios.get(
					`http://localhost:5000/api/users/${userId}`
				);
				setUserData(userInfoResponse.data);

				// Fetch user posts
				const postsResponse = await axios.get(
					`http://localhost:5000/api/posts/${userId}`
				);
				setUserPosts(postsResponse.data);

				// Fetch shared posts
				const sharedPostsResponse = await axios.get(
					`http://localhost:5000/api/shares/${userId}`
				);
				console.log("Shared posts response:", sharedPostsResponse);
				setSharedPosts(sharedPostsResponse.data.sharedPosts || []); // Ensure sharedPosts is an empty array if not found

				// Fetch users the current user is following
				const followingResponse = await axios.get(
					`http://localhost:5000/api/following/${userId}`
				);
				setFollowing(followingResponse.data.followings || []);
			} catch (err) {
				console.error(
					"Error fetching profile data: ",
					err.response?.data || err.message
				);
			}
		};

		fetchUserData();
	}, [navigate]);

	if (!userData) return <div>Loading...</div>;

	return (
		<div className="profile-container">
			<Navbar />
			<h1>Profile</h1>
			<div className="user-info">
				<h2>{userData.name}</h2>
				<p>ID: {userData.userId}</p>
			</div>
			<div className="posts-section">
				<h3>My Posts:</h3>
				{userPosts.length === 0 ? (
					<p>No posts available.</p>
				) : (
					<>
						{userPosts.map((post) => (
							<div key={post.postID} className="post">
								{editingPost === post.postID ? (
									<>
										<input
											type="text"
											placeholder="Title"
											value={updatedPost.title}
											onChange={(e) =>
												setUpdatedPost((prev) => ({
													...prev,
													title: e.target.value,
												}))
											}
										/>
										<textarea
											placeholder="Description"
											value={updatedPost.description}
											onChange={(e) =>
												setUpdatedPost((prev) => ({
													...prev,
													description: e.target.value,
												}))
											}
										></textarea>
										<input
											type="text"
											placeholder="Picture URL"
											value={updatedPost.picture}
											onChange={(e) =>
												setUpdatedPost((prev) => ({
													...prev,
													picture: e.target.value,
												}))
											}
										/>
										<button onClick={() => handleUpdatePost(post.postID)}>
											Save
										</button>
										<button onClick={() => setEditingPost(null)}>Cancel</button>
									</>
								) : (
									<>
										<h4>{post.title}</h4>
										<p>{post.description}</p>
										{post.picture && (
											<img src={post.picture} alt={post.title} />
										)}
										<button
											onClick={() => {
												setEditingPost(post.postID);
												setUpdatedPost({
													title: post.title,
													description: post.description,
													picture: post.picture || "",
												});
											}}
										>
											Edit
										</button>
										<button onClick={() => handleDeletePost(post.postID)}>
											Delete
										</button>
									</>
								)}
							</div>
						))}
					</>
				)}
			</div>

			<div className="shared-posts-section">
				<h3>Shared Posts:</h3>
				{sharedPosts.length === 0 ? (
					<p>No shared posts available.</p>
				) : (
					<div>
						{sharedPosts.map((post) => (
							<div key={post.postID} className="post">
								<h4>{post.title}</h4>
								<p>{post.description}</p>
								{post.picture && <img src={post.picture} alt={post.title} />}
							</div>
						))}
					</div>
				)}
			</div>

			<div className="follow-section">
				<h3>Following:</h3>
				{following.length === 0 ? (
					<p>Not following anyone yet.</p>
				) : (
					<ul>
						{following.map((user) => (
							<li key={user.user_id}>{user.username}</li>
						))}
					</ul>
				)}
			</div>
		</div>
	);
};

export default Profile;
