require('dotenv').config();
require('./services/setup'); //Configura banco de dados e relações das tabelas
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const usersConstroller = require('./controller/users');

const companiesRoutes = require('./routes/companies');
const usersRoutes = require('./routes/users');

const app = express();
const port = process.env.PORT || 3000;

//Configuração inicial
app.use(cors());
app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.use(morgan('tiny'));

//Autenticação
app.use(usersConstroller.authenticate);

//Rotas
app.use(companiesRoutes);
app.use(usersRoutes);

app.listen(port, ()=> {
	console.log(`Listening port ${port}`);
});