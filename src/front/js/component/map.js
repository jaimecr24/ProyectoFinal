import React, { useState, useEffect } from "react";
import GoogleMapReact from "google-map-react";
import PropTypes from "prop-types";

const Marker = () => (
	<div>
		<i className="fas fa-map-marker-alt" style={{ fontSize: "30px", color: "red" }} />
	</div>
);

const Label = props => (
	<div className="border border-dark rounded p-2 bg-white" style={props.styleLabel}>
		<p style={{ fontWeight: "bold" }}>{props.name}</p>
		<p>{props.direction}</p>
	</div>
);

const Map = props => {
	const style = {
		width: "fit-content",
		height: "fit-content",
		position: "absolute",
		left: -props.width / 2 + 10,
		top: -props.height / 2 + 10,
		textAlign: "left",
		color: "black"
	};
	console.log(style.left);
	return (
		<div style={{ width: props.width + "px", height: props.height + "px" }}>
			<GoogleMapReact
				bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_MAP_API_KEY }}
				center={{
					lat: props.lat ? parseFloat(props.lat) : null,
					lng: props.lng ? parseFloat(props.lng) : null
				}}
				defaultZoom={10}
				yesIWantToUseGoogleMapApiInternals>
				<Label name={props.name} direction={props.direction} styleLabel={style} />
				<Marker lat={props.lat} lng={props.lng} />
			</GoogleMapReact>
		</div>
	);
};
Map.propTypes = {
	lat: PropTypes.string,
	lng: PropTypes.string,
	width: PropTypes.string,
	height: PropTypes.string,
	name: PropTypes.string,
	direction: PropTypes.string
};
Label.propTypes = {
	name: PropTypes.string,
	direction: PropTypes.string,
	styleLabel: PropTypes.object
};

export default Map;
