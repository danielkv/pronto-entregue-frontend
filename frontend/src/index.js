//import 'react-hot-loader/patch';
import React from 'react';
import ReactDOM from 'react-dom';
//import ReactDOM from '@hot-loader/react-dom';
import { ApolloProvider } from "@apollo/react-hooks";

import apolloCliente from './services/server';
import Router from './router';
import './styles/index.css';


ReactDOM.render(<ApolloProvider client={apolloCliente}><Router /></ApolloProvider>, document.getElementById('root'));