import React from 'react';

import { GoogleMap, Marker } from '@react-google-maps/api';


export default function MapContainer({ center, onRepositionMarker, disabled=false, style={ width: '100%', height: 500 } }) {
	return (
		<GoogleMap
			mapContainerStyle={style}
			zoom={18}
			center={center}
		>
			<Marker draggable={!disabled} onDragEnd={onRepositionMarker} position={center} />
		</GoogleMap>
	)
}