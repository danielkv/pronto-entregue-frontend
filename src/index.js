//require('dotenv').config();
import React from 'react';
import ReactDOM from 'react-dom';

import { ApolloProvider } from "@apollo/react-hooks";

import NotificationsController from './controller/notifications';
import Router from './router';
import apolloCliente from './services/apolloClient';
import './styles/index.css';

ReactDOM.render(<ApolloProvider client={apolloCliente}><Router /></ApolloProvider>, document.getElementById('root'));

NotificationsController.register();