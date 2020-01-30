import React from 'react';
import { GoogleMap, Marker, withScriptjs, withGoogleMap } from "react-google-maps"


function MapContainer({ center, onRepositionMarker }) {
	return (
		
		<GoogleMap
			defaultZoom={14}
			defaultCenter={center}
		>
			<Marker draggable onDragEnd={onRepositionMarker} position={center} />
		</GoogleMap>
			

	)
}

export default withScriptjs(withGoogleMap((props)=><MapContainer {...props} />));