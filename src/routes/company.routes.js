const { Router } = require("express");

const {
  createCompany,
  readCompanies,
  updateCompany,
  deleteCompany,
  login,
} = require("../controllers/company.controller");
const { check } = require("express-validator");
const { validateParams } = require("../middlewares/validate-params");
const { validateJWT } = require("../middlewares/validate-jwt");

const api = Router();

//********************************************************************************/
//****************************** RUTAS DE EMPRESAS *******************************/
//********************************************************************************/

// >>>> Agregar empresa
api.post(
  "/create-company",
  [
    check("companyName", "El companyName es obligatorio para crear la empresa.")
      .not()
      .isEmpty(),
    check(
      "password",
      "El password es obligatorio para crear la empresa."
    ).isLength({ min: 6 }),
    check(
      "typeOfCompany",
      "El typeOfCompany es obligatorio para crear la empresa."
    )
      .not()
      .isEmpty(),
    validateParams,
  ],
  createCompany
);

// >>>> Ver empresas
api.get("/read-copanies", readCompanies);

// >>>> Editar empresa
//Si es un admnistrador el que esta logueado, necesita enviar el idCompnay de la empresa que quiere editar, no puede editar su propia empresa.
api.put(
    "/update-company",
    [
        validateJWT,
        check("companyName", "El companyName es un campo obligatorio"),
        check("typeOfCompany", "El typeOfCompany es un campo obligatorio"),
        validateParams,
    ],
    updateCompany
    );
    
// >>>> Eliminar empresa
// Si una empresa de tipo admin quiere eliminar una empresa normal, debe mandar el id con el nombre de parametro idCompany
api.delete('/delete-company', [
    validateJWT,
    check('idCompany', 'El campo idCompany es obligatorio.')
], deleteCompany)


//********************************************************************************/
//******************************** LOGIN EMPRESA *********************************/
//********************************************************************************/
api.post(
  "/login",
  [
    check("companyName", "El companyName es obligatorio.").not().isEmpty(),
    check("password", "El password es obligatorio.").not().isEmpty(),
    validateParams,
  ],
  login
);

// ==================================Exportaciones

module.exports = api;
