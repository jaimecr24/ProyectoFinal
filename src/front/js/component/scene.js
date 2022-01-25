import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

export const Scene = props => {
	const [spoiler, setSpoiler] = useState(props.spoiler);
	const seeSpoiler = () => {
		setSpoiler(false);
	};

	return (
		<div className="infocards-scene design-card border border bg-dark p-3  mb-5 mx-auto" style={{ width: "45%" }}>
			<Link to={"/infofilms/" + props.id} style={{ textDecoration: "none" }}>
				<h5 className="title card-title" style={{ color: "#fa9f42" }}>
					{props.title}
				</h5>
			</Link>
			{spoiler ? (
				<div className="btn" onClick={seeSpoiler}>
					<div className="container-spoiler">
						<img
							className="card-img-top row m-1 mx-auto spoiler-img"
							src={props.urlPhoto}
							alt={props.description}
							style={{ height: "270px", width: "90%", objectFit: "cover" }}
						/>
						<div className="centered-spoiler">Ver Spoiler</div>
					</div>

					<div className="card-body mx-auto text-white">
						<div style={{ fontSize: "16px" }}>
							<div className="spoiler-text">{props.description}</div>
						</div>
					</div>
				</div>
			) : (
				<div>
					<img
						className={"card-img-top row m-1 mx-auto"}
						src={props.urlPhoto}
						alt={props.description}
						style={{ height: "270px", width: "90%", objectFit: "cover" }}
					/>

					<div className="card-body mx-auto text-white">
						<div style={{ fontSize: "16px" }}>
							<div>{props.description}</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};
Scene.propTypes = {
	id: PropTypes.number,
	description: PropTypes.string,
	title: PropTypes.string,
	urlPhoto: PropTypes.string,
	spoiler: PropTypes.bool
};
