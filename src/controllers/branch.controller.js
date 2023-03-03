"use strict";
const Company = require("../models/company.model");


//********************************************************************************/
//******************************** CRUD SUCURSALES *******************************/
//********************************************************************************/

// >>>>> Create branch

const createBranch = async (req, res) => {
  try {
    const id = req.companyLogin._id;

    const { state, nameBranch, municipality } = { ...req.body };

    //Comprobar que el nombre de la nueva sucursal no este en uso todavia
    const nameFind = await findBranch(id,nameBranch);
    if(nameFind){
      console.log(`******Sucursal encontradas:`, nameFind);
      return res.status(400).send({message: 'El nombre de la sucursal ya esta en uso.'});
    }

    const newBranch = await Company.findByIdAndUpdate(
      id,
      {
        $push: {
          branchOffices: {
            state: state,
            nameBranch: nameBranch,
            municipality: municipality,
          },
        },
      },
      { new: true }
    );
    if (!newBranch) {
      return res.status(404).send({ message: "Empresa no encontrada" });
    }

    return res
      .status(200)
      .send({ message: `Sucursal agregada con exito.`, newBranch });
  } catch (err) {
    throw new Error(err);
  }
};

// >>>>> Read branchOffices

const readBranchOffices = async(req, res)=>{
    const id = req.companyLogin._id;
    const company = await Company.findById(id);
    if(!company){
        return res.state(404).send({message: `La empresa con el id ${id} no existe en la base de datos`});
    }
    const branchOffices = company.branchOffices;
    if(branchOffices.length == 0 ) return res.status(400).send({message: `La empresa ${company.companyName} no tiene sucursales`});
    return res.status(200).json({'Sucursales:' : branchOffices});
}

// >>>>>> Update de sucursales
const updateBranch = async(req, res)=>{
    try {
        const id = req.companyLogin._id;
        const {idBranchOffices, state, nameBranch, municipality} = req.body;
        //Obtener toda la info de la empresa logueada
        let company = await Company.findById(id);
        if(!company) return res.status(404).send({message: `La empresa con el ${id} no existe en la base de datos.`});
        //Obtener el arreglo de sucursales de la empresa
        let branchOffices = company.branchOffices;
        if(branchOffices.length == 0) return res.status(400).send({message: `La empresa ${company.companyName} no tiene sucursales registradas.`});
        //Editar la sucursal
        const updateBranch = await Company.updateOne(
            {_id: id, 'branchOffices._id': idBranchOffices},
            {
                $set: {
                    'branchOffices.$.state': state,
                    'branchOffices.$.nameBranch': nameBranch,
                    'branchOffices.$.municipality': municipality,
                }
            },
            {new: true}
        )
        if(!updateBranch) return res.status(400).send({message: `No se pudo actualizar la sucursal.`});
        company = await Company.findById(id);
        return res.status(200).send({message: `Sucursal actualizada correctamente.`, company});
    
    } catch (error) {
        throw new Error(error);
    }
}

// >>>>>> Delete de sucursales

const deleteBranch = async(req, res)=>{
  const id = req.companyLogin._id;
  const { idBranch } = req.body;
  try {
    let deleteBranch = await Company.updateOne(
      { _id: id },
      {
        $pull: { branchOffices: { _id: idBranch } },
      },
      { new: true, multi: false }
    );

    if (!deleteBranch) {
      return res.status(404).send({ message: "La sucursal no existe" });
    }
    const company = await Company.findById({_id: id});

    return res.status(200).send({ message: 'Estado de las sucursales', company });
  } catch (err) {
    throw new Error(err);
  }
}

//********************************************************************************/
//******************************** FUCNIONES EXTRA *******************************/
//********************************************************************************/
const findBranch = async(idCompany,nameBranch)=>{
  const branchFind = await Company.findOne({_id: idCompany, 'branchOffices.nameBranch': nameBranch}, {'branchOffices.$': 1});
  return branchFind;
}

// ==================================Exportaciones

module.exports = { createBranch , readBranchOffices, updateBranch , deleteBranch};
