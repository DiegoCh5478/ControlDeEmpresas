const jwt = require('jsonwebtoken');
require('dotenv').config();
const secretyKey = process.env.SECRET_KEY;

const generateJWT = async(id, companyName)=>{
    const payLoad = {id, companyName};
    try {
        const token = await jwt.sign(payLoad, secretyKey, {
            expiresIn: '1h'
        });
    } catch (error) {
        throw new Error(error);
    }
}

module.exports = {generateJWT};