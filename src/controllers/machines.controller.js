const machineMethods = {};
const Machine = require("../models/Machine");
const Environment = require("../models/Environment");
const ac = require("../middlewares/accessControl");
const fs = require("fs");

/**
 * Author: Juan Araque
 * Last modified: 22/01/2021
 *
 * @param {*} req
 * @param {*} res
 *
 * @return Object
 */
machineMethods.getMachines = async (req, res) => {
    const permission = ac.can(req.user.rol.name).readAny("machine");
    if (permission.granted) {
        try {
            const machines = await (await Machine.find()).reverse();
            return res.status(200).json({
                status: true,
                machines,
                message: "Se han encontrado maquinaría",
            });
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: "Ha ocurrido un error",
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
 * Last modified: 23/01/2021
 *
 * @param {*} req
 * @param {*} res
 *
 * @return Object
 */
machineMethods.getMachine = async (req, res) => {
    const permission = ac.can(req.user.rol.name).readOwn("machine");
    if (permission.granted) {
        try {
            const machineID = req.params("id");
            if (machineID) {
                const machine = await Machine.findById(machineID);
                return res.status(200).json({
                    status: true,
                    machine,
                    message: "Se han encontrado la maquina.",
                });
            } else {
                return res.status(400).json({
                    status: false,
                    message: "El ID de la maquina es requerido.",
                });
            }
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: "Ha ocurrido un error, por favor intentalo nuevamente",
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
 * Last modified: 22/01/2021
 *
 * @param {*} req
 * @param {*} res
 *
 * @return Object
 */
machineMethods.createMachine = async (req, res) => {
    const permission = ac.can(req.user.rol.name).createAny("machine");
    if (permission.granted) {
        const {
            environmentID,
            machineCode,
            name,
            totalHoursToMaintenance,
            totalHoursWorking,
        } = req.body;
        if (req.file) {
            if (
                environmentID &&
                machineCode &&
                name &&
                totalHoursToMaintenance
            ) {
                try {
                    const environmnet = await Environment.findById(
                        environmentID
                    );
                    if (!environmnet) {
                        if (req.file) {
                            fs.unlinkSync(req.file.path);
                        }
                        return res.status(400).json({
                            status: false,
                            message: "El código del ambiente es incorrecto.",
                        });
                    }

                    const verifyMachine = await Machine.findOne({
                        machineCode,
                    });
                    if (verifyMachine) {
                        if (req.file) {
                            fs.unlinkSync(req.file.path);
                        }
                        return res.status(400).json({
                            status: false,
                            message: "El código de la maquina ya esta en uso.",
                        });
                    }

                    const machineData = {
                        environmentID,
                        machineCode,
                        name,
                        totalHoursToMaintenance,
                        totalHoursWorking,
                    };
                    if (req.file) {
                        machineData.machinePhoto = {
                            filename: req.file.filename,
                            folder: "/img/machines/",
                        };
                    }

                    const machine = new Machine(machineData);

                    if (await machine.save()) {
                        return res.status(201).json({
                            status: true,
                            machines: machine,
                            message: "La maquina se ha creado correctamente.",
                        });
                    } else {
                        if (req.file) {
                            fs.unlinkSync(req.file.path);
                        }
                        return res.status(400).json({
                            status: false,
                            message:
                                "Ha ocurrido un error, intentalo nuevamente.",
                        });
                    }
                } catch (error) {
                    if (req.file) {
                        fs.unlinkSync(req.file.path);
                    }
                    return res.status(400).json({
                        status: false,
                        message: "Ha ocurrido un error, intentalo nuevamente.",
                    });
                }
            } else {
                if (req.file) {
                    fs.unlinkSync(req.file.path);
                }
                return res.status(400).json({
                    status: false,
                    message: "Debes llenar los campos requeridos.",
                });
            }
        } else {
            return res.status(403).json({
                status: false,
                message: "La foto de la maquina es requerida.",
            });
        }
    } else {
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        return res.status(403).json({
            status: false,
            message: "No tienes permisos para acceder a este recurso",
        });
    }
};

/**
 * Author: Juan Araque
 * Last modified: 22/01/2021
 *
 * @param {*} req
 * @param {*} res
 *
 * @return Object
 */
machineMethods.updateMachine = async (req, res) => {
    const permission = ac.can(req.user.rol.name).updateAny("machine");
    if (permission.granted) {
        const { machineID, environmentID, machineCode, name } = req.body;
        if (machineID) {
            if (environmentID && machineCode && name) {
                const getMachine = await Machine.findById(machineID);
                if (getMachine) {
                    try {
                        const verifyMachineCode = await Machine.findOne({
                            machineCode,
                        });
                        if (
                            verifyMachineCode &&
                            machineCode !== getMachine.machineCode
                        ) {
                            if (req.file) {
                                fs.unlinkSync(req.file.path);
                            }
                            return res.status(400).json({
                                status: false,
                                message:
                                    "El código de la maquina ya esta en uso.",
                            });
                        }

                        const updatedMachine = {
                            environmentID,
                            machineCode,
                            name,
                        };

                        if (req.file) {
                            if (getMachine.machinePhoto.filename) {
                                fs.unlinkSync(
                                    __dirname +
                                        "/../../public" +
                                        getMachine.machinePhoto.folder +
                                        getMachine.machinePhoto.filename
                                );
                            }

                            updatedMachine.machinePhoto = {
                                filename: req.file.filename,
                                folder: "/img/machines/",
                            };
                        }

                        await getMachine.update(updatedMachine);

                        return res.status(200).json({
                            status: true,
                            updatedMachine: await Machine.findById(machineID),
                            message:
                                "La maquina se ha actualizado correctamente.",
                        });
                    } catch (error) {
                        if (req.file) {
                            fs.unlinkSync(req.file.path);
                        }
                        return res.status(400).json({
                            status: false,
                            message:
                                "Ha ocurrido un error, intentalo nuevamente.",
                        });
                    }
                } else {
                    if (req.file) {
                        fs.unlinkSync(req.file.path);
                    }
                    return res.status(400).json({
                        status: false,
                        message: "No se ha encontrado el recurso solicitado.",
                    });
                }
            } else {
                if (req.file) {
                    fs.unlinkSync(req.file.path);
                }
                return res.status(400).json({
                    status: false,
                    message: "Debes llenar los campos requeridos.",
                });
            }
        } else {
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            return res.status(400).json({
                status: false,
                message: "El ID de la maquina es requerido.",
            });
        }
    } else {
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        return res.status(403).json({
            status: false,
            message: "No tienes permisos para acceder a este recurso",
        });
    }
};

/**
 * Author: Juan Araque
 * Last modified: 22/01/2021
 *
 * @param {*} req
 * @param {*} res
 *
 * @return Object
 */
machineMethods.deleteMachine = async (req, res) => {
    const permission = ac.can(req.user.rol.name).deleteAny("machine");
    if (permission.granted) {
        const { machineID } = req.body;
        try {
            const getMachine = await Machine.findById(machineID);
            if (getMachine) {
                if (getMachine.machinePhoto.filename) {
                    fs.unlinkSync(
                        __dirname +
                            "/../../public" +
                            getMachine.machinePhoto.folder +
                            getMachine.machinePhoto.filename
                    );
                }
                getMachine.remove();
                return res.status(201).json({
                    status: true,
                    message: "La maquina fue eliminada correctamente.",
                });
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
