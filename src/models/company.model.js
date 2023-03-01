'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Company = Schema({
    companyName: {type: String, require: true},
    password: {type: String, require: true},
    typeOfCompany: {type: String, require: true},
    branchOffices: [{
        //Para saber si la sucursal esta funcionamiento
        state: {type: Boolean, require: true},
        nameBranchOffices: {type: String, require: true},
        municipality: {type: String, require: true}
    }]
});

module.exports = mongoose.model('companies', Company);