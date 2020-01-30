import { createClient } from '@google/maps';

export default createClient({
	key: process.env.REACT_APP_GMAPS_KEY,
	Promise: Promise
});