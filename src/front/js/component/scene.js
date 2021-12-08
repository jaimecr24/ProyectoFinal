import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import PropTypes from "prop-types";

export const Scene = props => {
	const { store, actions } = useContext(Context);
	//useEffect(() => {
	//actions.getInfoFilms(props.id);
	//}, []);

	return (
		<div className="card p-3 mx-5 rounded  mb-5 w-100 mx-auto">
			<div className="row">
				<div className="col-4">
					{<h5 className="card-title text-success">{props.title}</h5>}
					<img className="card-img-top bg-dark row m-3" src="..." alt="..." style={{ height: "200px" }} />
				</div>
				<div className="card-body col-6 ms-5">
					<div style={{ fontSize: "10px" }}>
						<div className="text-dark">{props.description}</div>
					</div>
				</div>
			</div>
		</div>
	);
};
Scene.propTypes = {
	id: PropTypes.string,
	description: PropTypes.string,
	title: PropTypes.string
};
