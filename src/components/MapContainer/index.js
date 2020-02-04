import React from 'react';
import { GoogleMap, Marker, withScriptjs, withGoogleMap } from "react-google-maps"


function MapContainer({ center, onRepositionMarker, disabled=false, marker }) {
	return (
		
		<GoogleMap
			defaultZoom={18}
			center={center}
		>
			<Marker draggable={!disabled} icon={marker} onDragEnd={onRepositionMarker} position={center} />
		</GoogleMap>
			

	)
}

export default withScriptjs(withGoogleMap((props)=><MapContainer {...props} />));