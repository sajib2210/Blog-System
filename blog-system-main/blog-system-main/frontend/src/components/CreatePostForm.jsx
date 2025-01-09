import React, { useState } from "react";
import axios from "axios";
import "./CreatePostForm.css";

const CreatePostForm = ({ onPostCreated }) => {
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [picture, setPicture] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			// Current user info from localStorage
			const currentUser = JSON.parse(localStorage.getItem("user"));
			if (!currentUser) {
				throw new Error("User not logged in");
			}

			// Send post creation request
			const response = await axios.post("http://localhost:5000/api/posts", {
				title,
				description,
				picture,
				userId: currentUser.userId, // Pass the userId in the request
			});

			// Notify parent component and reset form
			onPostCreated(response.data);
			setTitle("");
			setDescription("");
			setPicture("");
		} catch (error) {
			console.error(
				"Failed to create post:",
				error.response?.data || error.message
			);
		}
	};

	return (
		<div className="create-post-form">
			<form onSubmit={handleSubmit}>
				<h3>Create Post</h3>
				<input
					type="text"
					placeholder="Title"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					required
				/>
				<textarea
					placeholder="Description"
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					required
				></textarea>
				<input
					type="text"
					placeholder="Picture URL (optional)"
					value={picture}
					onChange={(e) => setPicture(e.target.value)}
				/>
				<button type="submit">Post</button>
			</form>
		</div>
	);
};

export default CreatePostForm;
