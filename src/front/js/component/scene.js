import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import PropTypes from "prop-types";

export const Scene = props => {
	const { store, actions } = useContext(Context);
	//useEffect(() => {
	//actions.getInfoFilms(props.id);
	//}, []);

	return (
		<div className="card p-3  rounded  mb-5 mx-auto" style={{ width: "45%" }}>
			<h5 className="card-title text-success">{props.title}</h5>

			<img
				className="card-img-top bg-dark row m-1 mx-auto"
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
