import _ from 'lodash';

export function serialize(metas, configs) {
	return metas.map(meta => {
		const { key } = meta
		const fn = serealizeFns[key];
		const configRawValue = configs[key];
		let value;
		
		
		if (fn) value = fn(configRawValue)
		else value = configRawValue;

		return { ...meta, value };
	})
}

export function deserealize(configs) {
	return _.transform(configs, deserializeFns, {})
}

const serealizeFns = {
	deliveryTime (value) {
		return value.map((text)=>{
			return convertInputTimeToMinutes(text)
		}).join('-');
	},
	allowBuyClosedTimeBefore(value) {
		return convertInputTimeToMinutes(value)
	}
}

export function convertInputTimeToMinutes(inputText) {
	const splitted = inputText.split(':');
	const minutesTotal = (_.toInteger(splitted[0]) * 60) + _.toInteger(splitted[1]);
	return minutesTotal;
}

export function convertMinutesToInputTime(minutesInt) {
	const parsedTime = _.toInteger(minutesInt);
	let hours = Math.floor(parsedTime / 60);
	let minutes = parsedTime - (hours * 60);
			
	if (hours < 10) hours = "0" + _.toString(hours);
	if (minutes < 10) minutes = "0" + _.toString(minutes);
	
	return `${hours}:${minutes}`;
}

function deserializeFns (result, value, key) {
	const fns = {
		deliveryTime (value) {
			return value.split('-').map(time => {
				if ((/^\d{2}:\d{2}$/).test(time)) return time;
	
				return convertMinutesToInputTime(time)
			})
		},
		allowBuyClosedTimeBefore (value) {
			return convertMinutesToInputTime(value);
		}
	}
	const fn = fns?.[key];
	if (fn) value = fn(value);
	result[key] = value;
}