import React from 'react';

import { GoogleMap, Marker, LoadScript } from '@react-google-maps/api';


export default function MapContainer({ center, onRepositionMarker, disabled=false, marker, style={ width: '100%', height: 500 } }) {
	return (
		<LoadScript
			googleMapsApiKey={process.env.REACT_APP_GMAPS_KEY}
		>
			<GoogleMap
				mapContainerStyle={style}
				zoom={18}
				center={center}
			>
				<Marker draggable={!disabled} onDragEnd={onRepositionMarker} position={center} />
			</GoogleMap>
		</LoadScript>
	)
}