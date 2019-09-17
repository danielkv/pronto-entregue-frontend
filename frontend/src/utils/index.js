import React from 'react';
import Icon from '@mdi/react';
import { mdiClock, mdiSilverwareSpoon, mdiMoped, mdiCheckCircle, mdiCloseCircle } from '@mdi/js';

import numeral from 'numeral';

export const getStatusIcon = (status) => {
	switch(status) {
		case 'waiting':
			return <Icon path={mdiClock} size='18' color='#363E5E' alt='Aguardando' title='Aguardando' />
		case 'preparing':
			return <Icon path={mdiSilverwareSpoon} size='18' color='#363E5E' alt='Preparando' title='Preparando' />
		case 'delivering':
			return <Icon path={mdiMoped} size='18' color='#363E5E' alt='Na entrega' title='Na entrega' />
		case 'delivered':
			return <Icon path={mdiCheckCircle} size='18' color='#058F0A' alt='Entregues' title='Entregues' />
		case 'canceled':
			return <Icon path={mdiCloseCircle} size='18' color='#E63A3A' alt='Cancelado' title='Cancelado' />
		default: return '';
	}
}

export const joinMetas = ({address, emails, phones, contact, document}) => {
	let metas = [];

	//ADDRESS
	if (address) metas.push({...address, meta_value:JSON.stringify(address.meta_value)});

	//DOCUMENT
	if (document) metas.push(document);

	//CONTACT
	if (contact) metas.push(contact);

	//PHONES
	if (phones && phones.length) metas = [...metas, ...phones];
	
	//EMAILS
	if (emails && emails.length) metas = [...metas, ...emails];

	return metas;
}

export const meta_model = (type, value='', action='create') => {
	return {action, meta_type:type, meta_value:value};
}

export const initialMetas = (needed) => {
	if (!needed) throw new Error('Metas necessárias não definidas');
	const metas = {};

	if (needed.includes('address')) metas.address = meta_model('address', {
		street:'',
		number:'',
		district:'',
		zipcode:'',
		city:'',
		state:'',
	});

	if (needed.includes('contact')) metas.contact = meta_model('contact');
	if (needed.includes('document')) metas.document = meta_model('document');
	if (needed.includes('email')) metas.emails = [meta_model('email')];
	if (needed.includes('phone')) metas.phones = [meta_model('phone')];

	return metas;
}

export const extractMetas = (metas, needed) => {
	const return_metas = initialMetas(needed);

	//Retira __typename dos metadados
	metas = metas.map(meta => {delete meta.__typename; return meta});

	//ADDRESS
	if (return_metas.address) {
		const addressData = metas[metas.findIndex(meta=>meta.meta_type==='address')];
		if (addressData) return_metas.address = {...addressData, meta_value: JSON.parse(addressData.meta_value)};
	}

	//DOCUMENT
	if (return_metas.document) {
		const documentData = metas[metas.findIndex(meta=>meta.meta_type==='document')];
		if (documentData) return_metas.document = documentData;
	}

	//CONTACT
	if (return_metas.contact) {
		const contactData = metas[metas.findIndex(meta=>meta.meta_type==='contact')];
		if (contactData) return_metas.contact = contactData;
	}

	//PHONES
	if (return_metas.phones) {
		const phonesData = metas.filter(meta=>meta.meta_type==='phone');
		if(phonesData.length) return_metas.phones = phonesData;
	}

	//EMAILS
	if (return_metas.emails) {
		const emailsData = metas.filter(meta=>meta.meta_type==='email');
		if(emailsData.length) return_metas.emails = emailsData;
	}

	return return_metas;
}

export const setPageTitle = (new_title) => {
	if (new_title)
		return document.title = `Flakery - ${new_title}`;
	
	return document.title = `Flakery`;
}

numeral.register('locale', 'br', {
    delimiters: {
        thousands: '.',
        decimal: ','
    },
    abbreviations: {
        thousand: 'k',
        million: 'm',
        billion: 'b',
        trillion: 't'
    },
    currency: {
        symbol: 'R$ '
    }
});

numeral.locale('br');