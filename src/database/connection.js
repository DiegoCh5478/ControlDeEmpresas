'use strict';
require('dotenv').config
const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
const database = process.env.DATA_BASE;

const connection = async()=>{
    try {
        await mongoose.connect(database);
        console.log(`Conectado a la base de datos.`);
    } catch (error) {
        throw new Error(error);
    }
}

module.exports = {connection}