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

export const extractMetas = (metas) => {
	let address = {id:'', action:'create', meta_type:'address', meta_value: {
		street:'',
		number:'',
		district:'',
		zipcode:'',
		city:'',
		state:'',
	}},
	contact = {id:'', meta_type:'contact', meta_value:'', action:'create'},
	document = {id:'', meta_type:'document', meta_value:'', action:'create'},
	emails = [{id:'', meta_type:'email', meta_value:'', action:'create'}],
	phones = [{id:'', meta_type:'phone', meta_value:'', action:'create'}];

	//Retira __typename dos metadados
	metas = metas.map(meta => {delete meta.__typename; return meta});

	//ADDRESS
	const addressData = metas[metas.findIndex(meta=>meta.meta_type==='address')];
	if (addressData) address = {...addressData, meta_value: JSON.parse(addressData.meta_value)};

	//DOCUMENT
	const documentData = metas[metas.findIndex(meta=>meta.meta_type==='document')];
	if (documentData) document = documentData;

	//CONTACT
	const contactData = metas[metas.findIndex(meta=>meta.meta_type==='contact')];
	if (contactData) contact = contactData;

	//PHONES
	const phonesData = metas.filter(meta=>meta.meta_type==='phone');
	if(phonesData.length) phones = phonesData;

	//EMAILS
	const emailsData = metas.filter(meta=>meta.meta_type==='email');
	if(emailsData.length) emails = emailsData;

	return {
		address,
		contact,
		document,
		emails,
		phones,
	}
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