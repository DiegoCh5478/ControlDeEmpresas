'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Company = Schema({
    companyName: {type: String, require: true},
    password: {type: String, require: true},
    typeOfCompany: {type: String, require: true},
    branchOffices:[{
        state: {type:String, require: false},//Para saber si la sucursal esta funcionamiento
        nameBranch: {type: String, require: false},
        municipality: {type: String, require: false}
    }]
});

module.exports = mongoose.model('companies', Company);