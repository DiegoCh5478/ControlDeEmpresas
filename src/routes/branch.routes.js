const { Router } = require("express");
const {
  createBranch,
  readBranchOffices,
  updateBranch,
  deleteBranch
} = require("../controllers/branch.controller");

const { validateJWT } = require("../middlewares/validate-jwt");
const { check } = require("express-validator");
const { validateParams } = require("../middlewares/validate-params");

const api = Router();

//********************************************************************************/
//**************************** RUTAS DE SUCURSALES *******************************/
//********************************************************************************/

// >>>>>>>> Crear sucursal
api.post(
  "/create-branch",
  [
    validateJWT,
    check("state", "El state es oblitorio para crear una sucursal.")
      .not()
      .isEmpty(),
    check("nameBranch", "El nameBranch es oblitorio para crear una sucursal.")
      .not()
      .isEmpty(),
    check(
      "municipality",
      "El municipality es oblitorio para crear una sucursal."
    )
      .not()
      .isEmpty(),
    validateParams,
  ],
  createBranch
);

// >>>>>> Ver sucursal de cada empresa logueada
api.get("/read-branchOffices", [validateJWT], readBranchOffices);

// >>>>>> Actualizar sucursal
api.put(
  "/update-branch",
  [
    validateJWT,
    check("idBranchOffices", "El campo idBranchOffices es obligatorio.")
      .not()
      .isEmpty(),
    validateParams,
  ],
  updateBranch
);

// >>>>> Elimnar sucursal
api.delete('/delete-branch', [
    validateJWT,
    check('idBranch', 'El parametro idBranch es necesario para la eliminar una sucursal.'),
    validateParams
], deleteBranch);


// ==================================Exportaciones
module.exports = api;
