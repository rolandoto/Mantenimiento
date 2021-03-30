const maintenancesMethods = {};
const { Types } = require("mongoose");
const Maintenance = require("../models/Maintenance");
const Machine = require("../models/Machine");
const MaintenanceType = require("../models/MaintenanceType");
const ac = require("../middlewares/accessControl");
const { maintenanceStatus } = require("../config/config");

/**
 * Author: Juan Araque
 * Last modified: 28/03/2021
 *
 * @param {*} req
 * @param {*} res
 *
 * @return Object
 */
maintenancesMethods.getMaintenances = async (req, res) => {
    const permission = ac.can(req.user.rol.name).readAny("maintenance");
    if (permission.granted) {
        try {
            const maintenances = await (
                await Maintenance.find().populate("maintenanceType")
            ).reverse();
            return res.status(200).json({
                status: true,
                maintenances,
                message: "Se han encontrado mantenimientos.",
            });
        } catch (error) {
            return res.status(400).json({
                status: false,
                message:
                    "Ha ocurrido un error, por favor intentalo nuevamente.",
            });
        }
    } else {
        return res.status(403).json({
            status: false,
            message: "No tienes permisos para acceder a este recurso.",
        });
    }
};

/**
 * Author: Juan Araque
 * Last modified: 28/03/2021
 *
 * @param {*} req
 * @param {*} res
 *
 * @return Object
 */
maintenancesMethods.getMaintenance = async (req, res) => {
    const permission = ac.can(req.user.rol.name).readOwn("maintenance");
    if (permission.granted) {
        try {
            const maintenanceID = req.params["id"];
            if (maintenanceID) {
                const maintenance = await Maintenance.findById(
                    maintenanceID
                ).populate("maintenanceType");
                if (maintenance) {
                    return res.status(200).json({
                        status: true,
                        maintenance,
                        message: "Se ha encontrado el mantenimiento.",
                    });
                } else {
                    return res.status(404).json({
                        status: false,
                        message: "No se ha encontrado el recurso solicitado.",
                    });
                }
            } else {
                return res.status(403).json({
                    status: false,
                    message: "El id del mantenimiento es requerido.",
                });
            }
        } catch (error) {
            return res.status(400).json({
                status: false,
                message:
                    "Ha ocurrido un error, por favor intentalo nuevamente.",
            });
        }
    } else {
        return res.status(403).json({
            status: false,
            message: "No tienes permisos para acceder a este recurso.",
        });
    }
};

function createTask(name) {
    return {
        id: Types.ObjectId(),
        name,
        complete: false,
        complete_at: null,
    };
}

/**
 * Author: Juan Araque
 * Last modified: 22/03/2021
 *
 * @param {*} req
 * @param {*} res
 *
 * @return Object
 */
maintenancesMethods.createMaintenance = async (req, res) => {
    const permission = ac.can(req.user.rol.name).createAny("maintenance");
    if (permission.granted) {
        const { maintenanceType, name, check_list = [] } = req.body;
        if (maintenanceType && name && check_list) {
            try {
                const getMaintenanceType = await MaintenanceType.findById(
                    maintenanceType
                );
                if (getMaintenanceType) {
                    const maitenance = new Maintenance({
                        maintenanceType,
                        name,
                        check_list,
                    });

                    maitenance.check_list = check_list.map((task) => {
                        return createTask(task.name);
                    });
                    if (await maitenance.save()) {
                        return res.status(201).json({
                            status: true,
                            maintenances: await Maintenance.findById(
                                maitenance._id
                            ).populate("maintenanceType"),
                            message:
                                "El mantenimineto se ha creado correctamente.",
                        });
                    } else {
                        return res.status(200).json({
                            status: false,
                            message:
                                "Ha ocurrido un error, intentalo nuevamente.",
                        });
                    }
                } else {
                    return res.status(200).json({
                        status: false,
                        message:
                            "No se ha encontrado el tipo de mantenimiento.",
                    });
                }
            } catch (error) {
                return res.status(200).json({
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
            message: "No tienes permisos para acceder a este recurso.",
        });
    }
};

/**
 * Author: Juan Araque
 * Last modified: 28/03/2021
 *
 * @param {*} req
 * @param {*} res
 *
 * @return Object
 */
maintenancesMethods.completeMaintenance = async (req, res) => {
    const permission = ac.can(req.user.rol.name).updateAny("maintenance");
    if (permission.granted) {
        const { maintenanceID } = req.body;
        if (maintenanceID) {
            const getMaintenance = await Maintenance.findById(maintenanceID);
            if (getMaintenance) {
                try {
                    if (!getMaintenance.complete) {
                        if (
                            await getMaintenance.updateOne({
                                complete: true,
                                complete_at: new Date(),
                            })
                        ) {
                            return res.status(200).json({
                                status: true,
                                maintenance: await Maintenance.findById(
                                    maintenanceID
                                ).populate("maintenanceType"),
                                message:
                                    "El mantenimiento se ha completado correctamente.",
                            });
                        } else {
                            return res.status(400).json({
                                status: false,
                                message:
                                    "Ha ocurrido un error, intentalo nuevamente.",
                            });
                        }
                    } else {
                        return res.status(200).json({
                            status: false,
                            message:
                                "Este mantenimineto ya ha sido completado.",
                        });
                    }
                } catch (error) {
                    return res.status(400).json({
                        status: false,
                        message: "Ha ocurrido un error, intentalo nuevamente.",
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
                message: "El ID del mantenimiento es requerido.",
            });
        }
    } else {
        return res.status(403).json({
            status: false,
            message: "No tienes permisos para acceder a este recurso.",
        });
    }
};

/**
 * Author: Juan Araque
 * Last modified: 28/03/2021
 *
 * @param {*} req
 * @param {*} res
 *
 * @return Object
 */
maintenancesMethods.updateMaintenance = async (req, res) => {
    const permission = ac.can(req.user.rol.name).updateAny("maintenance");
    if (permission.granted) {
        const {
            maintenanceID,
            maintenanceType,
            name,
            check_list = [],
        } = req.body;

        if (maintenanceID) {
            if (maintenanceType && name && check_list) {
                try {
                    const getMaitenance = await Maintenance.findById(
                        maintenanceID
                    );
                    if (getMaitenance) {
                        const getMaintenanceType = await MaintenanceType.findById(
                            maintenanceType
                        );
                        if (getMaintenanceType) {
                            const maitenance = {
                                maintenanceType,
                                name,
                                check_list,
                            };

                            maitenance.check_list = check_list.map((task) => {
                                return createTask(task.name);
                            });

                            if (await getMaitenance.updateOne(maitenance)) {
                                return res.status(201).json({
                                    status: true,
                                    maintenances: await Maintenance.findById(
                                        maintenanceID
                                    ).populate("maintenanceType"),
                                    message:
                                        "El mantenimineto se ha actualizado correctamente.",
                                });
                            } else {
                                return res.status(200).json({
                                    status: false,
                                    message:
                                        "Ha ocurrido un error, intentalo nuevamente.",
                                });
                            }
                        } else {
                            return res.status(200).json({
                                status: false,
                                message:
                                    "No se ha encontrado el tipo de mantenimiento.",
                            });
                        }
                    } else {
                        return res.status(200).json({
                            status: false,
                            message: "No se ha encontrado el  mantenimiento.",
                        });
                    }
                } catch (error) {
                    return res.status(200).json({
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
            return res.status(200).json({
                status: false,
                message: "El ID del mantenimiento es requerido.",
            });
        }
    } else {
        return res.status(403).json({
            status: false,
            message: "No tienes permisos para acceder a este recurso.",
        });
    }
};

function evaluateMaitenances(machine, maitenanceID) {
    let isUsed = false;

    machine.preconfiguredMaitenances.forEach((maitenance) => {
        if (maitenance.maintenance.toString() === maitenanceID) {
            isUsed = true;
            return false;
        }
    });

    return isUsed;
}

/**
 * Author: Juan Araque
 * Last modified: 28/03/2021
 *
 * @param {*} req
 * @param {*} res
 *
 * @return Object
 */
maintenancesMethods.deleteMaintenance = async (req, res) => {
    const permission = ac.can(req.user.rol.name).deleteAny("maintenance");
    if (permission.granted) {
        const { maintenanceID } = req.body;
        try {
            const getMaintenance = await Maintenance.findById(maintenanceID);
            if (getMaintenance) {
                const checkIfMachinesNotHasThisMaitenance = await Machine.find({
                    preconfiguredMaitenances: { $exists: true, $ne: [] },
                });

                if (checkIfMachinesNotHasThisMaitenance) {
                    for (let machine of checkIfMachinesNotHasThisMaitenance) {
                        if (
                            evaluateMaitenances(
                                machine,
                                getMaintenance._id.toString()
                            )
                        ) {
                            return res.status(400).json({
                                status: false,
                                message:
                                    "No puede eliminar el mantenimiento, hay maquinas usando este mantenimiento.",
                            });
                        }
                    }
                }

                if (getMaintenance.remove()) {
                    return res.status(201).json({
                        status: true,
                        message:
                            "El mantenimiento fue eliminado correctamente.",
                    });
                } else {
                    return res.status(400).json({
                        status: false,
                        message: "Ha ocurrido un error, intentalo nuevamente.",
                    });
                }
            } else {
                return res.status(404).json({
                    status: false,
                    message: "No se ha encontrado el recurso solicitado.",
                });
            }
        } catch (error) {
            console.log(error);
            return res.status(400).json({
                status: false,
                message: "Ha ocurrido un error, intentalo nuevamente.",
            });
        }
    } else {
        return res.status(403).json({
            status: false,
            message: "No tienes permisos para acceder a este recurso.",
        });
    }
};

module.exports = maintenancesMethods;
