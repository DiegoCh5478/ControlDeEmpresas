const {response, request} = require('express');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const Company = require('../models/company.model');

const validateJWT = async(req = request, res = response, next)=>{
    const token = req.header('x-token');
    if(!token){
        res.status(401).send({message: 'No hay un token en la peticion'});
    }
    try {
        const payLoad = jwt.decode(token, process.env.SECRET_KEY);
        const companyFind = await Company.findById(payLoad.id);
        
        if(payLoad.exp <= moment().unix()){
            return res.status(500).send({message:"El token ha expirado"});
        }
        if(!companyFind){
            return res.status(400).send({message: 'El usuario dueño del token no existe en la base de datos.'})
        }

        req.companyLogin = companyFind;
        next();
    } catch (error) {
        throw new Error(error);
    }
}

module.exports = {validateJWT};