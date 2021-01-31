const maintenanceTypesMethods = {};
const MaintenanceType = require("../models/MaintenanceType");
const ac = require("../middlewares/accessControl");
const Maintenance = require("../models/Maintenance");

/**
 * Author: Juan Araque
 * Last modified: 30/01/2021
 *
 * @param {*} req
 * @param {*} res
 *
 * @return Object
 */
maintenanceTypesMethods.getMaintenanceTypes = async (req, res) => {
    const permission = ac.can(req.user.rol.name).readAny("maintenanceType");
    if (permission.granted) {
        try {
            const maintenanceTypes = await MaintenanceType.find();
            return res.status(200).json({
                status: true,
                maintenanceTypes,
                message: "Se han encontrado tipos de mantenimiento.",
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
maintenanceTypesMethods.getMaintenanceType = async (req, res) => {
    const permission = ac.can(req.user.rol.name).readOwn("maintenanceType");
    if (permission.granted) {
        try {
            const maintenanceTypeID = req.params["id"];
            if (maintenanceTypeID) {
                const maintenanceType = await MaintenanceType.findById(
                    maintenanceTypeID
                );
                return res.status(200).json({
                    status: true,
                    maintenanceType,
                    message: "Se ha encontrado el tipo de mantenimiento.",
                });
            } else {
                return res.status(200).json({
                    status: false,
                    message: "El ID del tipo de mantenimiento es requerido.",
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
maintenanceTypesMethods.createMaintenanceType = async (req, res) => {
    const permission = ac.can(req.user.rol.name).createAny("maintenanceType");
    if (permission.granted) {
        const { name } = req.body;
        if (name) {
            try {
                const maintenanceTypeCreated = new MaintenanceType({
                    name,
                });
                if (await maintenanceTypeCreated.save()) {
                    return res.status(201).json({
                        status: true,
                        maintenanceTypes: maintenanceTypeCreated,
                        message:
                            "El tipo de mantenimeinto se ha creado correctamente.",
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
maintenanceTypesMethods.updateMaintenanceType = async (req, res) => {
    const permission = ac.can(req.user.rol.name).updateAny("maintenanceType");
    if (permission.granted) {
        const { maintenanceTypeID, name } = req.body;
        if (maintenanceTypeID) {
            if (name) {
                const getMaintenanceType = await MaintenanceType.findById(
                    maintenanceTypeID
                );
                if (getMaintenanceType) {
                    try {
                        await getMaintenanceType.updateOne({
                            name,
                        });

                        return res.status(200).json({
                            status: true,
                            maintenanceTypes: await MaintenanceType.findById(
                                maintenanceTypeID
                            ),
                            message:
                                "El tipo de mantenimiento se ha actualizado correctamente.",
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
                    message: "Todos los campos son requeridos.",
                });
            }
        } else {
            return res.status(200).json({
                status: false,
                message: "El ID del tipo de mantenimineto es requerido.",
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
maintenanceTypesMethods.deleteMaintenanceType = async (req, res) => {
    const permission = ac.can(req.user.rol.name).deleteAny("maintenanceType");
    if (permission.granted) {
        const { maintenanceTypeID } = req.body;
        if (maintenanceTypeID) {
            try {
                const getMaintenanceType = await MaintenanceType.findById(
                    maintenanceTypeID
                );
                if (getMaintenanceType) {
                    const checkIfMaitenanceTypeIsNotAssing = await Maintenance.find(
                        { maintenanceType: maintenanceTypeID },
                        { _id: true }
                    );
                    if (checkIfMaitenanceTypeIsNotAssing.length === 0) {
                        getMaintenanceType.remove();
                        return res.status(201).json({
                            status: true,
                            message:
                                "El tipo de mantenimiento fue eliminado correctamente.",
                        });
                    } else {
                        return res.status(200).json({
                            status: false,
                            message:
                                "Lo sentimos pero hay mantenimineto asignados a este tipo de mantenimeinto.",
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
            return res.status(200).json({
                status: false,
                message: "El ID del tipo de mantenimiento es requerido.",
            });
        }
    } else {
        return res.status(403).json({
            status: false,
            message: "No tienes permisos para acceder a este recurso.",
        });
    }
};

module.exports = maintenanceTypesMethods;
