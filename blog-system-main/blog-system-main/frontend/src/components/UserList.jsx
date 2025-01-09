import React, { useState, useEffect } from "react";
import axios from "axios";
import "./UserList.css";

const UserList = ({ users }) => {
	const [followStatus, setFollowStatus] = useState({}); // Tracks follow status of users
	const [loadingStatus, setLoadingStatus] = useState({}); // Tracks loading state of buttons
	const currentUser = JSON.parse(localStorage.getItem("user")) || null;

	// Fetch the list of users the current user is following
	useEffect(() => {
		if (!currentUser || !currentUser.userId) return;

		const fetchFollowings = async () => {
			try {
				const response = await axios.get(
					`http://localhost:5000/api/following/${currentUser.userId}`
				);
				const followings = response.data.followings.reduce((acc, user) => {
					acc[user.user_id] = true;
					return acc;
				}, {});
				setFollowStatus(followings);
			} catch (error) {
				console.error("Failed to fetch followings:", error.message);
			}
		};

		fetchFollowings();
	}, [currentUser?.userId]); // Depend only on userId

	// Handle follow/unfollow requests
	const handleFollowToggle = async (userId, isFollowing) => {
		if (!currentUser) {
			console.error("User not logged in.");
			return;
		}

		// Prevent multiple clicks by setting the loading state
		setLoadingStatus((prev) => ({
			...prev,
			[userId]: true,
		}));

		try {
			if (isFollowing) {
				// Unfollow the user
				await axios.post(
					`http://localhost:5000/api/following/unfollow/${userId}`,
					{ userId: currentUser.userId }
				);
				setFollowStatus((prev) => ({
					...prev,
					[userId]: false,
				}));
			} else {
				// Follow the user
				await axios.post(
					`http://localhost:5000/api/following/follow/${userId}`,
					{ userId: currentUser.userId }
				);
				setFollowStatus((prev) => ({
					...prev,
					[userId]: true,
				}));
			}
		} catch (error) {
			console.error(
				`Failed to ${isFollowing ? "unfollow" : "follow"} user:`,
				error.response?.data || error.message
			);
		} finally {
			// Reset the loading state after the request completes
			setLoadingStatus((prev) => ({
				...prev,
				[userId]: false,
			}));
		}
	};

	// Helper to check if the current user is following another user
	const isFollowing = (userId) => followStatus[userId] || false;

	return (
		<div className="user-list">
			<h3>Users</h3>
			<ul>
				{users.map((user) => (
					<li key={user.user_id}>
						<span>{user.username}</span>
						<button
							className={`follow-button ${
								isFollowing(user.user_id) ? "unfollow" : ""
							}`}
							onClick={() =>
								!loadingStatus[user.user_id] && // Prevent multiple clicks
								handleFollowToggle(user.user_id, isFollowing(user.user_id))
							}
							disabled={loadingStatus[user.user_id]} // Disable button while processing
						>
							{loadingStatus[user.user_id]
								? "Processing..."
								: isFollowing(user.user_id)
								? "Unfollow"
								: "Follow"}
						</button>
					</li>
				))}
			</ul>
		</div>
	);
};

export default UserList;
