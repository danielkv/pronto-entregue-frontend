import React, {useState} from 'react';
import {Paper} from '@material-ui/core';

import Icon from '@mdi/react';
import {} from '@mdi/js';

import numeral from 'numeral';
import Layout from '../../layout';
import {Content, BlockHeader, BlockTitle, SidebarContainer, Sidebar, SidebarBlock} from '../../layout/components';

function Page () {
	return (
		<Layout>
			<Content>
				<BlockHeader>
					<BlockTitle>Nova empresa</BlockTitle>
				</BlockHeader>
				<Paper>
					
				</Paper>
			</Content>
			<SidebarContainer>
				<BlockHeader>
					<BlockTitle>Configuração</BlockTitle>
				</BlockHeader>
				<Sidebar>
					
				</Sidebar>
			</SidebarContainer>
		</Layout>
	)
}

export default Page;