import axios from "axios";
import React, { useEffect, useState } from "react";
import Filter from "./Filter"; // Import the Filter component
import "./PostsList.css";

const PostsList = ({ userId }) => {
	const [posts, setPosts] = useState([]);
	const [filter, setFilter] = useState(false);
	const [comments, setComments] = useState({});
	const [newComment, setNewComment] = useState({}); // Tracks new comment inputs for each post
	const [shareDescription, setShareDescription] = useState({}); // Tracks share descriptions for each post
	const [sortOrder, setSortOrder] = useState("asc"); // Default to ascending order

	// const fetchPosts = async () => {
	// 	try {
	// 		// Decide API endpoint based on the filter state
	// 		const endpoint = filter
	// 			? `http://localhost:5000/api/posts/${userId}`
	// 			: "http://localhost:5000/api/posts";

	// 		// Fetch posts
	// 		const response = await axios.get(endpoint);
	// 		setPosts(response.data);
	// 	} catch (error) {
	// 		console.error(
	// 			"Failed to fetch posts:",
	// 			error.response?.data || error.message
	// 		);
	// 	}
	// };
	const fetchFilteredPosts = async (sort) => {
		try {
			console.log(`Requesting: http://localhost:5000/api/posts?sort=${sort}`);
			const response = await axios.get(
				`http://localhost:5000/api/posts?sort=${sort}`
			);
			console.log("Fetched posts:", response.data);
			return response.data;
		} catch (error) {
			console.error(
				"Failed to fetch posts:",
				error.response?.data || error.message
			);
		}
	};

	const fetchComments = async (postId) => {
		try {
			const response = await axios.get(
				`http://localhost:5000/api/comments/${postId}`
			);
			setComments((prev) => ({ ...prev, [postId]: response.data }));
		} catch (error) {
			console.error(
				`Failed to fetch comments for post ${postId}:`,
				error.response?.data || error.message
			);
		}
	};

	const handleAddComment = async (postId) => {
		try {
			const user = JSON.parse(localStorage.getItem("user"));
			if (!user) {
				alert("You must be logged in to comment.");
				return;
			}

			await axios.post(`http://localhost:5000/api/comments/${postId}`, {
				comment: newComment[postId],
				userId: user.userId,
			});

			// Update the comments list for the post
			fetchComments(postId);
			setNewComment((prev) => ({ ...prev, [postId]: "" })); // Clear input field
		} catch (error) {
			console.error(
				`Failed to add comment to post ${postId}:`,
				error.response?.data || error.message
			);
		}
	};

	const handleSharePost = async (postId) => {
		try {
			const user = JSON.parse(localStorage.getItem("user"));
			if (!user) {
				alert("You must be logged in to share a post.");
				return;
			}

			await axios.post("http://localhost:5000/api/shares", {
				postID: postId,
				description: shareDescription[postId],
				userId: user.userId,
			});

			alert("Post shared successfully!");
			setShareDescription((prev) => ({ ...prev, [postId]: "" })); // Clear input field
		} catch (error) {
			console.error(
				`Failed to share post ${postId}:`,
				error.response?.data || error.message
			);
		}
	};
	useEffect(() => {
		fetchFilteredPosts(sortOrder); // Default fetch with ascending order
	}, []); // Empty dependency array means only on mount

	useEffect(() => {
		fetchFilteredPosts(sortOrder).then((data) => {
			console.log("Setting posts:", data); // Log fetched data
			setPosts(data); // Update state
		});
	}, [sortOrder]);

	// useEffect(() => {
	// 	fetchPosts();
	// }, [filter, userId]);
	return (
		<div className="posts-list">
			<h3>Posts</h3>
			{/* Add the Filter component */}
			<Filter onSortChange={setSortOrder} />
			{posts.map((post) => (
				<div key={post.postID} className="post">
					<h4>{post.title}</h4>
					<p>{post.description}</p>
					{post.picture && <img src={post.picture} alt={post.title} />}
					{/* Add other actions like comments, share, etc. */}

					<div className="comments-section">
						<h5>Comments:</h5>
						<button onClick={() => fetchComments(post.postID)}>
							Load Comments
						</button>
						<ul>
							{comments[post.postID]?.map((comment) => (
								<li key={comment.comment_id}>
									<strong>{comment.user_id}:</strong> {comment.comment_text}
								</li>
							)) || <p>No comments yet.</p>}
						</ul>
						<div className="add-comment">
							<input
								type="text"
								placeholder="Add a comment"
								value={newComment[post.postID] || ""}
								onChange={(e) =>
									setNewComment((prev) => ({
										...prev,
										[post.postID]: e.target.value,
									}))
								}
							/>
							<button onClick={() => handleAddComment(post.postID)}>
								Submit
							</button>
						</div>
					</div>
					<div className="share-section">
						<h5>Share This Post:</h5>
						<input
							type="text"
							placeholder="Add a description for sharing"
							value={shareDescription[post.postID] || ""}
							onChange={(e) =>
								setShareDescription((prev) => ({
									...prev,
									[post.postID]: e.target.value,
								}))
							}
						/>
						<button onClick={() => handleSharePost(post.postID)}>Share</button>
					</div>
				</div>
			))}
		</div>
	);
};

export default PostsList;
