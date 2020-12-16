const maintenacesMethods = {};
const Maintenance = require("../models/Maintenace");

/**
 * Author: Juan Araque
 * Last modified: 12/11/2020
 *
 * @param {*} req
 * @param {*} res
 *
 * @return Object
 */
maintenacesMethods.getMaintenances = async (req, res) => {
    const permission = ac.can(req.user.rol.name).readAny("maintenance");
    if (permission.granted) {
        try {
            const maintenances = await Maintenance.find();
            return res.status(200).json({
                status: true,
                maintenances,
                message: "Se han encontrado mantenimientos.",
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
 * Last modified: 12/11/2020
 *
 * @param {*} req
 * @param {*} res
 *
 * @return Object
 */
maintenacesMethods.getMaintenance = async (req, res) => {
    const permission = ac.can(req.user.rol.name).readOwn("maintenance");
    if (permission.granted) {
        try {
            const maintenancesID = req.params("id");
            const maintenance = await Maintenance.findById(maintenancesID);
            return res.status(200).json({
                status: true,
                maintenance,
                message: "Se ha encontrado el mantenimiento..",
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
 * Last modified: 12/11/2020
 *
 * @param {*} req
 * @param {*} res
 *
 * @return Object
 */
maintenacesMethods.createMaintenance = async (req, res) => {
    const permission = ac.can(req.user.rol.name).createAny("maintenance");
    if (permission.granted) {
        const { maintenaceType, name } = req.body;
        if ((maintenaceType, name)) {
            const maintenance = new Maintenance({
                maintenaceType,
                name,
            });

            if (await maintenance.save()) {
                return res.status(201).json({
                    status: true,
                    message: "El mantenimeinto se ha creado correctamente.",
                });
            } else {
                return res.status(400).json({
                    status: false,
                    message: "Ha ocurrido un error, intentalo nuevamente.",
                });
            }
        } else {
            return res.status(400).json({
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
 * Last modified: 12/11/2020
 *
 * @param {*} req
 * @param {*} res
 *
 * @return Object
 */
maintenacesMethods.updateMaintenance = async (req, res) => {
    const permission = ac.can(req.user.rol.name).updateAny("maintenance");
    if (permission.granted) {
        const { maintenanceID, maintenaceType, name } = req.body;
        if ((maintenaceType, name)) {
            const getMaintenance = await Maintenance.findById(maintenanceID);
            if (getMaintenance) {
                try {
                    await getMaintenance.update({
                        maintenaceType,
                        name,
                    });

                    return res.status(400).json({
                        status: true,
                        message: "El mantenimiento se ha actualizado correctamente.",
                    });
                } catch (error) {
                    return res.status(400).json({
                        status: false,
                        message: "Ha ocurrido un error, intentalo nuevamente.",
                    });
                }
            } else {
                return res.status(400).json({
                    status: false,
                    message: "No se ha encontrado el recurso solicitado.",
                });
            }
        } else {
            return res.status(400).json({
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
 * Last modified: 12/11/2020
 *
 * @param {*} req
 * @param {*} res
 *
 * @return Object
 */
maintenacesMethods.deleteMaintenance = async (req, res) => {
    const permission = ac.can(req.user.rol.name).deleteAny("maintenance");
    if (permission.granted) {
        const { maintenanceID } = req.body;
        try {
            const getMaintenance = await Maintenance.findById(maintenanceID);
            if (getMaintenance) {
                getMaintenance.remove();
                return res.status(201).json({
                    status: true,
                    message: "El mantenimiento fue eliminado correctamente.",
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

module.exports = maintenacesMethods;
