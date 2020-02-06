import React from 'react';
import { Droppable } from 'react-beautiful-dnd';

import { FieldArray, useFormikContext } from 'formik';

import GroupItem from './groupItem';

export default function OptionsGroupsList () {
	const { values: { optionsGroups } } = useFormikContext();
	
	return (
		<Droppable droppableId={`optionsGroups`} type='group'>
			{(droppableProvided)=>(
				<FieldArray name='optionsGroups'>
					{(helpers) => (
						<div {...droppableProvided.droppableProps} ref={droppableProvided.innerRef}>
							{optionsGroups.map((group, index) => (
								<GroupItem key={index} group={group} index={index} groupsHelpers={helpers} />
							))}
							{droppableProvided.placeholder}
						</div>
					)}
				</FieldArray>
			)}
		</Droppable>
		
	);
}