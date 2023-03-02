"use strcit";

const Company = require("../models/company.model");
const bcrypt = require("bcrypt");
const { generateJWT } = require("../helpers/create-jwt");

//********************************************************************************/
//******************************** CRUD EMPRESAS *********************************/
//********************************************************************************/

// >>>>>>> Crear empresa

const createCompany = async (req, res) => {
  const { companyName, password } = req.body;
  try {
    //Comprobar que el nombre de la empresa no este en uso
    let company = await Company.findOne({ companyName });
    if (company) {
      return res.status(400).send({
        ok: false,
        message: "El nombre de la empresa ya esta en uso.",
      });
    }
    company = new Company(req.body);
    company.password = bcrypt.hashSync(password, bcrypt.genSaltSync());
    company = await company.save();
    return res.status(200).send({
      message: `La empresa ${companyName} se creo correctamente.`,
      company,
    });
  } catch (error) {
    throw new Error(error);
  }
};

// >>>>>>> Ver empresas

const readCompanies = async (req, res) => {
  try {
    const companies = await Company.find();
    if (companies.length == 0) {
      return res.status(500).send({
        ok: false,
        message: `No hay empresas registradas en la base de datos`,
      });
    }
    return res.status(200).json({ "Empresas encontradas: ": companies });
  } catch (error) {
    throw new Error(error);
  }
};

// >>>>>>> Ver empresas
//Una empresa de tipo admnistrador puede editar al igual que una empresa normal
const updateCompany = async (req, res) => {
  try {
    let id;
    if (
      req.companyLogin.typeOfCompany == "ADMIN" ||
      req.companyLogin.typeOfCompany == "admin"
    ) {
      //Se necesita el id de la empresa que se quiera editar, el parametro se debe llamar idCompany
      id = req.body.idCompany;
      if (id == null || id == undefined || id == "") {
        return res.status(400).send({
          message: `Su empresa es de tipo admnistrador, debe proporcionar el id de la empresa que se quiere editar, "idCompany".`,
        });
      }
      const companyFindToEdit = await Company.findById(id);
      if (!companyFindToEdit) {
        return res
          .status(404)
          .send({ message: `La empresa con el id ${id} no existe.` });
      }
      // LA EMPRESA QUE VAMOS A EDITAR NO PUEDE SER UNA EMPRESA QUE TAMBIEN SEA DE TIPO ADMIN
      if (
        companyFindToEdit.typeOfCompany == "ADMIN" ||
        companyFindToEdit.typeOfCompany == "admin"
      ) {
        return res.status(400).send({
          message: `La empresa que se trata de editar es de tipo admnistrador`,
        });
      }
    } else {
      //Si no tiene un rol de administrador se editara su propia empresa
      console.log(`Se actualizar su propia empresa.`);
      id = req.companyLogin._id;
    }

    const companyEdit = req.body;
    let companyName = companyEdit.companyName;
    //Ver si la contrasena se envia, si es el caso se encripta
    if (companyEdit.password) {
      companyEdit.password = bcrypt.hashSync(
        companyEdit.password,
        bcrypt.genSaltSync()
      );
    } else {
      companyEdit.password = companyEdit.password;
    }

    //Ver si el nombre de la empresa es el mismo o es nuevo y evitar que se repita
    let companyOld = await Company.findById(id);
    if (!companyOld) {
      return res
        .status(400)
        .send({ message: `No se encontro la empresa con el id: ${id}` });
    }
    if (!(companyOld.companyName == companyEdit.companyName)) {
      let companyExists = await Company.findOne({ companyName });
      if (companyExists) {
        return res.status(400).send({
          ok: false,
          message: `El nombre ${companyName} ya fue usado una empresa`
        });
      }
    }

    //Se busca y luego se actualiza la empresa
    const companyComplete = await Company.findByIdAndUpdate(id, companyEdit, {
      new: true,
    });
    if (companyComplete) {
      //Si se encontro la empresa y se actualizo
      const token = await generateJWT(
        companyComplete.id,
        companyComplete.companyName
      );
      return res.status(200).send({
        message: `La empresa ${companyComplete.companyName} fue actaulizada correctamente.`,
        companyComplete,
        "Nuevo token:": token,
      });
    } else {
      //Si no se pudo encontrar y actualizar
      return res.status(404).send({
        ok: falase,
        message: `La empresa que se quiere editar no fue encontrada en la base de datos`,
      });
    }
  } catch (error) {
    throw new Error(error);
  }
};

// >>>>>>> Eliminar empresas

const deleteCompany = async (req, res) => {
  try {
    let id;
    if (
      req.companyLogin.typeOfCompany == "ADMIN" ||
      req.companyLogin.typeOfCompany == "admin"
    ) {
      id = req.body.idCompany;
      //Verificar que se haya mandado el id de la empresa que se quiere borrar
      if (id == null || id == undefined || id == "") {
        return res.status(400).send({
          message: `Su empresa es de tipo admnistrador, debe proporcionar el id de la empresa que se quiere eliminar, "idCompany".`,
        });
      }
      const companyFindToDelete = await Company.findById(id);
      if (!companyFindToDelete) {
        return res
          .status(404)
          .send({ message: `La empresa con el id ${id} no existe.` });
      }
      // LA EMPRESA QUE VAMOS A ELIMINAR NO PUEDE SER UNA EMPRESA QUE TAMBIEN SEA DE TIPO ADMIN
      if (
        companyFindToDelete.typeOfCompany == "ADMIN" ||
        companyFindToDelete.companyFindToEdit == "admin"
      ) {
        return res.status(400).send({
          message: `La empresa que se trata de eliminar es de tipo admnistrador`,
        });
      }
    } else {
      console.log(`Se eliminara su propia empresa`);
      id = req.companyLogin._id;
    }
    const companyToDelete = await Company.findByIdAndDelete(id);
    if (companyToDelete) {
      //Si se encontro la empresa y se elimino
      return res
        .status(200)
        .send({
          message: `Datos de la empresa que se borro: `,
          companyToDelete,
        });
    } else {
      return res
        .status(404)
        .send({ message: `No se encontro y no se pudo eliminar la empresa.` });
    }
  } catch (error) {}
};

//********************************************************************************/
//***************************** EMPRESA POR DEFECTO ******************************/
//********************************************************************************/

const companyDefault = async () => {
  let company = await Company.find();
  if (company.length == 0) {
    console.log(`Comenzando la creacion de la empresa ADMIN por defecto`);
    company = new Company();
    company.companyName = "ADMIN";
    company.password = "ADMIN";
    company.password = bcrypt.hashSync(company.password, bcrypt.genSaltSync());
    company.typeOfCompany = "ADMIN";
    let companyName = company.companyName;
    const companyNameFind = await Company.findOne({ companyName });
    if (!companyNameFind) {
      company = await company.save();
      return console.log(
        `Se creo el usuario por defecto correctaemnte ${company}`
      );
    }
  }
};

//********************************************************************************/
//******************************** LOGIN EMPRESA *********************************/
//********************************************************************************/

const login = async (req, res) => {
  const { companyName, password } = req.body;
  try {
    //Bucar si existe una empresa con el nombre dado
    let company = await Company.findOne({ companyName });
    if (!company) {
      return res.status(400).send({
        message: `No existe una empresa registrada con el nombre ${companyName}`,
      });
    }
    //Comprobar la contrasena
    const correctParams = bcrypt.compareSync(password, company.password);
    if (!correctParams) {
      return res.status(400).send({ message: "Contraseña incorrecta." });
    }
    const token = await generateJWT(company.id, company.companyName);
    return res.status(200).json({
      message: "Sesion iniciada correctamente",
      ok: true,
      id: company.id,
      name: companyName,
      type: company.typeOfCompany,
      token,
    });
  } catch (error) {
    throw new Error(error);
  }
};

// ==================================Exportaciones
module.exports = {
  createCompany,
  login,
  companyDefault,
  readCompanies,
  updateCompany,
  deleteCompany
};
