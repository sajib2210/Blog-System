import React from "react";
import "./Filter.css";

const Filter = ({ onSortChange }) => {
	return (
		<div className="filter">
			<h4>Filter Posts</h4>
			<div className="time-filter">
				<button onClick={() => onSortChange("asc")}>Ascending</button>
				<button onClick={() => onSortChange("desc")}>Descending</button>
			</div>
		</div>
	);
};

export default Filter;
