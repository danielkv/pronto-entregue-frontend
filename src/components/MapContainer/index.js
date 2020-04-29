import React from 'react';

import { GoogleMap, Marker } from '@react-google-maps/api';


export default function MapContainer({ center, onRepositionMarker, disabled=false, children, style={ width: '100%', height: 500 }, zoom=18 }) {
	return (
		<GoogleMap
			mapContainerStyle={style}
			zoom={zoom}
			center={center}
		>
			{children}
			<Marker draggable={!disabled} onDragEnd={onRepositionMarker} position={center} />
		</GoogleMap>
	)
}