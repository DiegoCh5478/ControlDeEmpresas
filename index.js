'use strcit';

const express = require('express');
const app = express();
require('dotenv').config();
const port = process.env.PORT;
const {connection} = require('./src/database/connection');
const {companyDefault} = require('./src/controllers/company.controller');
//Importar las rutas
const routes = require('./src/routes/company.routes');

//Instancia de la conexion
connection();


app.use(express.urlencoded({extended: false}));
app.use(express.json());

companyDefault();
app.use('/api', routes);

app.listen(port, ()=>{
    console.log(`El servidor esta corriendo en el puerto ${port}`);
})