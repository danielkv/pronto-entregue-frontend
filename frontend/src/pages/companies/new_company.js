import React from 'react';
import {Formik} from 'formik';

import PageForm from './form';
import {setPageTitle} from '../../utils';
import Layout from '../../layout';


function Page (props) {
	setPageTitle('Nova empresa');

	const company = {
		name:'',
		display_name:'',
		active:true,
		document:'',
		contact:'',
		address:{
			street:'',
			number:'',
			district:'',
			zipcode:'',
			city:'',
			state:'',
		},
		phones:[{id:0, meta_type:'phone', meta_value:'', action:'create'}],
		emails:[{id:0, meta_type:'phone', meta_value:'', action:'create'}],
	};

	function onSubmit(values) {
		console.log(values)
	}
	
	return (
		<Layout>
			<Formik
				initialValues={company}
				onSubmit={onSubmit}
				component={PageForm}
				/>
		</Layout>
	)
}

export default Page;