const maintenancesMethods = {};
const Maintenance = require("../models/Maintenance");
const Machine = require("../models/Machine");
const MaintenanceType = require("../models/MaintenanceType");
const ac = require("../middlewares/accessControl");
const { maintenanceStatus } = require("../config/config");

/**
 * Author: Juan Araque
 * Last modified: 30/01/2021
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
                await Maintenance.find()
                    .populate("machine")
                    .populate("maintenanceType")
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
 * Last modified: 30/01/2021
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
                const maintenance = await Maintenance.findById(maintenanceID)
                    .populate("machine")
                    .populate("maintenanceType");
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

/**
 * Author: Juan Araque
 * Last modified: 30/01/2021
 *
 * @param {*} req
 * @param {*} res
 *
 * @return Object
 */
maintenancesMethods.createMaintenance = async (req, res) => {
    const permission = ac.can(req.user.rol.name).createAny("maintenance");
    if (permission.granted) {
        const { maintenanceType, machine } = req.body;
        if (maintenanceType && machine) {
            try {
                const getMaintenanceType = await MaintenanceType.findById(
                    maintenanceType
                );
                if (getMaintenanceType) {
                    const getMachine = await Machine.findById(machine);
                    if (getMachine) {
                        if (
                            getMachine.status ==
                                Object.keys(maintenanceStatus).find(
                                    (key) =>
                                        maintenanceStatus[key] ===
                                        maintenanceStatus.active
                                ) ||
                            getMachine.status ==
                                Object.keys(maintenanceStatus).find(
                                    (key) =>
                                        maintenanceStatus[key] ===
                                        maintenanceStatus.needMaintenance
                                )
                        ) {
                            const maintenance = new Maintenance({
                                maintenanceType,
                                machine,
                            });

                            if (
                                await getMachine.updateOne({
                                    status: Object.keys(maintenanceStatus).find(
                                        (key) =>
                                            maintenanceStatus[key] ===
                                            maintenanceStatus.maintenance
                                    ),
                                    maintenances: [
                                        ...getMachine.maintenances,
                                        maintenance._id,
                                    ],
                                })
                            ) {
                                if (await maintenance.save()) {
                                    return res.status(201).json({
                                        status: true,
                                        maintenances: await Maintenance.findById(
                                            maintenance._id
                                        )
                                            .populate("machine")
                                            .populate("maintenanceType"),
                                        message:
                                            "El mantenimeinto se ha creado correctamente.",
                                    });
                                } else {
                                    await getMachine.updateOne({
                                        status: getMachine.status,
                                    });
                                    return res.status(400).json({
                                        status: false,
                                        message:
                                            "Ha ocurrido un error, por favor intentalo nuevamente.",
                                    });
                                }
                            } else {
                                return res.status(400).json({
                                    status: false,
                                    message:
                                        "Ha ocurrido un error, por favor intentalo nuevamente.",
                                });
                            }
                        } else {
                            return res.status(200).json({
                                status: false,
                                message: `Esta maquina no se puede poner en mantenimiento ya que se encuentra en estado: ${
                                    maintenanceStatus[getMachine.status]
                                }.`,
                            });
                        }
                    } else {
                        return res.status(200).json({
                            status: false,
                            message: "No se ha encontrado la maquina.",
                        });
                    }
                } else {
                    return res.status(200).json({
                        status: false,
                        message:
                            "No se ha encontrado el tipo de mantenimineto.",
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
 * Last modified: 30/01/2021
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
                        const getMachine = await Machine.findById(
                            getMaintenance.machine
                        );
                        if (getMachine) {
                            if (
                                getMachine.status ==
                                Object.keys(maintenanceStatus).find(
                                    (key) =>
                                        maintenanceStatus[key] ===
                                        maintenanceStatus.maintenance
                                )
                            ) {
                                if (
                                    await getMachine.updateOne({
                                        status: Object.keys(
                                            maintenanceStatus
                                        ).find(
                                            (key) =>
                                                maintenanceStatus[key] ===
                                                maintenanceStatus.active
                                        ),
                                        totalHoursWorking: 0,
                                    })
                                ) {
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
                                            )
                                                .populate("machine")
                                                .populate("maintenanceType"),
                                            message:
                                                "El mantenimiento se ha completado correctamente.",
                                        });
                                    } else {
                                        await getMachine.updateOne({
                                            status: Object.keys(
                                                maintenanceStatus
                                            ).find(
                                                (key) =>
                                                    maintenanceStatus[key] ===
                                                    maintenanceStatus.maintenance
                                            ),
                                        });
                                        return res.status(400).json({
                                            status: false,
                                            message:
                                                "Ha ocurrido un error, intentalo nuevamente.",
                                        });
                                    }
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
                                        "La maquina relacionada no se encuentra en mantenimineto.",
                                });
                            }
                        } else {
                            return res.status(200).json({
                                status: false,
                                message: "No se ha encontrado ma maquina.",
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
 * Last modified: 30/01/2021
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
                if (getMaintenance.complete) {
                    const getMachine = await Machine.findById(
                        getMaintenance.machine
                    );
                    if (getMachine) {
                        const newMachineMaitenances = getMachine.maintenances.filter(
                            (maitenance) => maitenance != maintenanceID
                        );
                        if (
                            await getMachine.updateOne({
                                maintenances: newMachineMaitenances,
                            })
                        ) {
                            if (getMaintenance.remove()) {
                                return res.status(201).json({
                                    status: true,
                                    message:
                                        "El mantenimiento fue eliminado correctamente.",
                                });
                            } else {
                                await getMachine.updateOne({
                                    maintenances: getMachine.maintenances,
                                });
                                return res.status(400).json({
                                    status: false,
                                    message:
                                        "Ha ocurrido un error, intentalo nuevamente.",
                                });
                            }
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
                            message: "No se ha encontrado la maquina.",
                        });
                    }
                } else {
                    return res.status(200).json({
                        status: false,
                        message:
                            "No puedes eliminar este mantenimineto hasta que se haya completado, esto lo hacemos para evitar errores y que las maquinas queden en un estado indefinido.",
                    });
                }
            } else {
                return res.status(404).json({
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
            message: "No tienes permisos para acceder a este recurso.",
        });
    }
};

module.exports = maintenancesMethods;
