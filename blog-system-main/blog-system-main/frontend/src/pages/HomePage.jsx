import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import CreatePostForm from "../components/CreatePostForm";
import PostsList from "../components/PostsList";
import UserList from "../components/UserList";
import axios from "axios";
import "./HomePage.css";

const HomePage = () => {
	const [currentUser, setCurrentUser] = useState(null);
	const [users, setUsers] = useState([]);
	const [posts, setPosts] = useState([]);

	// Fetch the current user and users list
	useEffect(() => {
		// Get current user from localStorage
		const user = JSON.parse(localStorage.getItem("user"));
		if (user) {
			setCurrentUser(user);
		}

		// Fetch all users
		const fetchUsers = async () => {
			try {
				const response = await axios.get(
					"http://localhost:5000/api/auth/users"
				);
				setUsers(response.data);
			} catch (error) {
				console.error(
					"Failed to fetch users:",
					error.response?.data || error.message
				);
			}
		};

		fetchUsers();
	}, []);

	// Fetch boosted and regular posts
	useEffect(() => {
		const fetchPosts = async () => {
			try {
				// Fetch boosted posts
				const boostedResponse = await axios.get(
					"http://localhost:5000/api/boosted"
				);
				const boostedPosts = boostedResponse.data;

				// Fetch regular posts
				const postsResponse = await axios.get(
					"http://localhost:5000/api/posts"
				);
				const regularPosts = postsResponse.data;

				// Merge boosted posts and regular posts
				const allPosts = [...boostedPosts, ...regularPosts];

				// Set the posts state
				setPosts(allPosts);
			} catch (error) {
				console.error("Failed to fetch posts:", error);
			}
		};

		fetchPosts();
	}, []); // Empty dependency array means it runs only on mount

	return (
		<div className="homepage">
			<Navbar />
			<div className="content">
				<div className="left">
					<CreatePostForm
						onPostCreated={(newPost) => console.log("New Post:", newPost)}
					/>
					{/* Render PostsList with the posts passed down as props */}
					<PostsList userId={currentUser?.userId} posts={posts} />
				</div>
				<div className="right">
					<UserList users={users} />
				</div>
			</div>
		</div>
	);
};

export default HomePage;
