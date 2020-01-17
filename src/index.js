import React from 'react';
import ReactDOM from 'react-dom';

import { ApolloProvider } from "@apollo/react-hooks";

import Router from './router';
import apolloCliente from './services/server';
import './styles/index.css';


ReactDOM.render(<ApolloProvider client={apolloCliente}><Router /></ApolloProvider>, document.getElementById('root'));