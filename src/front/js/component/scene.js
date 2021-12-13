import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

export const Scene = props => {
	return (
		<div className="card p-3  rounded  mb-5 mx-auto" style={{ width: "45%" }}>
			<Link to={"/infofilms/" + props.id} style={{ textDecoration: "none" }}>
				<h5 className="card-title text-success">{props.title}</h5>
			</Link>

			<img
				className="card-img-top row m-1 mx-auto"
				src={props.urlPhoto}
				alt={props.description}
				style={{ height: "200px", width: "90%", objectFit: "cover" }}
			/>

			<div className="card-body mx-auto">
				<div style={{ fontSize: "10px" }}>
					<div className="text-dark">{props.description}</div>
				</div>
			</div>
		</div>
	);
};
Scene.propTypes = {
	id: PropTypes.string,
	description: PropTypes.string,
	title: PropTypes.string,
	urlPhoto: PropTypes.string
};
