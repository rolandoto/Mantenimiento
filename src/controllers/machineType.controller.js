const machineMethods = {};
const MachineType = require("../models/MachineType");
const Machine = require("../models/Machine");
const ac = require("../middlewares/accessControl");
const fs = require("fs");

/**
 * Author: Juan Araque
 * Last modified: 22/03/2021
 *
 * @param {*} req
 * @param {*} res
 *
 * @return Object
 */
machineMethods.getMachineTypes = async (req, res) => {
    const permission = ac.can(req.user.rol.name).readAny("machineType");
    if (permission.granted) {
        try {
            const machineTypes = await (await MachineType.find()).reverse();

            return res.status(200).json({
                status: true,
                machineTypes,
                message: "Se han encontrado tipos de maquina.",
            });
        } catch (error) {
            console.error(error);
            return res.status(400).json({
                status: false,
                message: "Ha ocurrido un error, intentalo nuevamente.",
            });
        }
    } else {
        return res.status(403).json({
            status: false,
            message: "No tienes permisos para acceder a este recurso",
        });
    }
};

/**
 * Author: Juan Araque
 * Last modified: 22/03/2021
 *
 * @param {*} req
 * @param {*} res
 *
 * @return Object
 */
machineMethods.createMachineType = async (req, res) => {
    const permission = ac.can(req.user.rol.name).createAny("machine");
    if (permission.granted) {
        const { machine_type_name } = req.body;
        if (machine_type_name) {
            try {
                const machineType = new MachineType({ machine_type_name });

                if (await machineType.save()) {
                    return res.status(201).json({
                        status: true,
                        machineTypes: machineType,
                        message:
                            "El tipo de maquina se ha creado correctamente.",
                    });
                } else {
                    return res.status(400).json({
                        status: false,
                        message: "Ha ocurrido un error, intentalo nuevamente.",
                    });
                }
            } catch (error) {
                return res.status(400).json({
                    status: false,
                    message: "Ha ocurrido un error, intentalo nuevamente.",
                });
            }
        } else {
            return res.status(200).json({
                status: false,
                message: "Debes llenar los campos requeridos.",
            });
        }
    } else {
        return res.status(403).json({
            status: false,
            message: "No tienes permisos para acceder a este recurso",
        });
    }
};

/**
 * Author: Juan Araque
 * Last modified: 22/03/2021
 *
 * @param {*} req
 * @param {*} res
 *
 * @return Object
 */
machineMethods.updateMachineType = async (req, res) => {
    const permission = ac.can(req.user.rol.name).updateAny("machine");
    if (permission.granted) {
        const { machineTypeID, machine_type_name } = req.body;
        if (machineTypeID) {
            if (machine_type_name) {
                const getMachineType = await MachineType.findById(
                    machineTypeID
                );
                if (getMachineType) {
                    try {
                        await getMachineType.updateOne({ machine_type_name });

                        return res.status(200).json({
                            status: true,
                            updatedMachineType: await MachineType.findById(
                                machineTypeID
                            ),
                            message:
                                "El tipo de maquina se ha actualizado correctamente.",
                        });
                    } catch (error) {
                        return res.status(400).json({
                            status: false,
                            message:
                                "Ha ocurrido un error, intentalo nuevamente.",
                        });
                    }
                } else {
                    return res.status(404).json({
                        status: false,
                        message: "No se ha encontrado el recurso solicitado.",
                    });
                }
            } else {
                return res.status(200).json({
                    status: false,
                    message: "Debes llenar los campos requeridos.",
                });
            }
        } else {
            return res.status(200).json({
                status: false,
                message: "El ID del tipo de maquina es requerido.",
            });
        }
    } else {
        return res.status(403).json({
            status: false,
            message: "No tienes permisos para acceder a este recurso",
        });
    }
};

/**
 * Author: Juan Araque
 * Last modified: 22/03/2021
 *
 * @param {*} req
 * @param {*} res
 *
 * @return Object
 */
machineMethods.deleteMachineType = async (req, res) => {
    const permission = ac.can(req.user.rol.name).deleteAny("machine");
    if (permission.granted) {
        const { machineTypeID } = req.body;
        try {
            const getMachineType = await MachineType.findById(machineTypeID);
            if (getMachineType) {
                const checkMachines = await Machine.find({
                    machineType: machineTypeID,
                });
                if (checkMachines.length === 0) {
                    getMachineType.remove();
                    return res.status(200).json({
                        status: true,
                        message:
                            "El tipo de maquina fue eliminado correctamente.",
                    });
                } else {
                    return res.status(400).json({
                        status: false,
                        message:
                            "Lo sentimos pero no se puede eliminar el tipo debido a que hay maquinas relacionadas.",
                    });
                }
            } else {
                return res.status(400).json({
                    status: false,
                    message: "No se ha encontrado el recurso solicitado.",
                });
            }
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: "Ha ocurrido un error, intentalo nuevamente.",
            });
        }
    } else {
        return res.status(403).json({
            status: false,
            message: "No tienes permisos para acceder a este recurso",
        });
    }
};

module.exports = machineMethods;
