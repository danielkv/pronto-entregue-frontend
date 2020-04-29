import React, { useRef, useState, useEffect } from 'react'

import { Dialog, DialogTitle, DialogContent, DialogActions, Button, ButtonGroup } from '@material-ui/core';
import { GoogleMap, Marker, Circle } from '@react-google-maps/api';
import { useFormikContext } from 'formik';

const initialRadius = 2000;

export default function AreaMap({ center, handleCloseMap, handleApply, mapOpen, selectedAreaIndex=null }) {
	const circleRef = useRef(null);
	const mapRef = useRef(null);

	const [area, setArea] = useState(()=>({ center, radius: initialRadius }))
	const [mapCenter, setMapCenter] = useState(()=>center)

	const { values: { deliveryAreas = [] } } = useFormikContext();

	useEffect(()=>{
		if (mapOpen && selectedAreaIndex !== null) {
			const copy = Object.assign({}, deliveryAreas[selectedAreaIndex])
			setArea({ ...copy, center: copy.center || center, radius: copy.radius || initialRadius })
			if (copy.center) setMapCenter(copy.center);
			else setMapCenter(center);
		}
	}, [center, selectedAreaIndex, mapOpen, deliveryAreas])

	function handleRecenterMap() {
		if (mapRef.current) {
			const { lat, lng } = mapRef.current.state.map.center;
			setMapCenter([lat(), lng()])
		}
	}

	function resetMap () {
		selectedAreaIndex = null;
		setArea({ center, radius: initialRadius });
		setMapCenter(center);
	}

	function handleDragEnd () {
		if (circleRef.current) {
			const { lat, lng } = circleRef.current.state.circle.center;
			const center = [lat(), lng()];
			if (area.center[0] !== center[0] || area.center[1] !== center[1]) {
				handleRecenterMap();
				setArea({ ...area, center });
			}
		}
	}
	
	function handleRadiusChange () {
		if (circleRef.current) {
			const radius = circleRef.current.state.circle.radius;
			handleRecenterMap();
			setArea({ ...area, radius });
		}
	}

	function handleClickApply() {
		handleApply(area);
		handleCloseMap();
		resetMap();
	}
	
	function handleClickCancel() {
		handleCloseMap();
		resetMap();
	}

	return (
		<Dialog onClose={handleCloseMap} maxWidth='lg' fullWidth open={mapOpen} >
			<DialogTitle id="alert-dialog-title">Selecione a área no mapa</DialogTitle>
			<DialogContent>
				<GoogleMap
					ref={mapRef}
					mapContainerStyle={{ width: "100%", height: '100%', minHeight: 600 }}
					zoom={14}
					center={{ lat: mapCenter[0], lng: mapCenter[1] }}
				>
					{deliveryAreas
						.filter((r, index) => index !== selectedAreaIndex && r.radius && r.center)
						.map((circle, index)=>
							<Circle key={index} center={{ lat: circle.center[0], lng: circle.center[1] }} radius={circle.radius} options={{ strokeColor: '#ccc', fillColor: '#ccc' }} />
						)}
					<Circle ref={circleRef} onCenterChanged={handleDragEnd} onRadiusChanged={handleRadiusChange} center={{ lat: area.center[0], lng: area.center[1] }} radius={area.radius} editable options={{ strokeColor: '#ac0', fillColor: '#ac0' }} />
					<Marker draggable={false} position={{ lat: center[0], lng: center[1] }} />
				</GoogleMap>
			</DialogContent>
			<DialogActions>
				<ButtonGroup>
					<Button color='default' variant='contained' onClick={handleClickCancel}>Cancelar</Button>
					<Button color='primary' variant='contained' onClick={handleClickApply}>Aplicar</Button>
				</ButtonGroup>
			</DialogActions>
		</Dialog>
	)
}
