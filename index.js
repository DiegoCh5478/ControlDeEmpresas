'use strcit';

const express = require('express');
const app = express();
require('dotenv').config();
const port = process.env.PORT;
const {connection} = require('./src/database/connection');

//Instancia de la conexion
connection();

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.listen(port, ()=>{
    console.log(`El servidor esta corriendo en el puerto ${port}`);
})