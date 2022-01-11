import React, { useEffect, useRef, ReactElement, useState } from "react";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import PropTypes from "prop-types";
import { object } from "prop-types";

const render = status => {
	if (status === Status.LOADING)
		return (
			<div className="spinner-border text-danger" role="status">
				<span className="sr-only">Loading...</span>
			</div>
		);
	if (status === Status.FAILURE) return <h3>{status} ...</h3>;
	return null;
};

const Map = props => {
	let map;
	let mapStyle = { width: props.width + "px", height: props.height + "px" };

	useEffect(() => {
		map = new google.maps.Map(
			document.querySelector(".map"),
			{
				center: props.center,
				zoom: props.zoom
			},
			[]
		);

		const markers = props.markers.map(p => {
			const marker = new google.maps.Marker({
				position: p.position,
				content: p.content
			});
			marker.addListener("click", () => {
				infoWindow.setContent(marker.content);
				infoWindow.open(map, marker);
			});
			const infoWindow = new google.maps.InfoWindow({
				content: "",
				disableAutoPan: true,
				maxWidth: 300,
				maxHeight: 200
			});
			return marker;
		});

		new MarkerClusterer({ map, markers });
	});

	return (
		<div>
			<div className="map text-black rounded text-center" style={mapStyle} />
		</div>
	);
};

Map.propTypes = {
	width: PropTypes.string,
	height: PropTypes.string,
	center: PropTypes.object,

	zoom: PropTypes.number,

	markers: PropTypes.array,
	center: PropTypes.object
};

const MapComponent = props => {
	return (
		<Wrapper apiKey={process.env.REACT_APP_GOOGLE_MAP_API_KEY} render={render}>
			{props.markers ? (
				<Map
					zoom={props.zoom}
					width={props.width}
					height={props.height}
					markers={props.markers}
					center={props.center}
				/>
			) : null}
		</Wrapper>
	);
};
MapComponent.propTypes = {
	width: PropTypes.string,
	height: PropTypes.string,
	center: PropTypes.object,

	zoom: PropTypes.number,

	markers: PropTypes.array
};

export default MapComponent;
