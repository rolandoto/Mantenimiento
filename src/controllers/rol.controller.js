const rolMethods = {};
const Rol = require("../models/Rol");
const ac = require("../middlewares/accessControl");

/**
 * Author: Juan Araque
 * Last modified: 12/12/2020
 *
 * @param {*} req
 * @param {*} res
 *
 * @return Object
 */
rolMethods.getRols = async (req, res) => {
    const permission = ac.can(req.user.rol.name).readAny("rol");
    if (permission.granted) {
        try {
            const rols = await Rol.find();
            return res.status(200).json({
                status: true,
                rols,
                message: "Se han encontrado roles.",
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
 * Last modified: 12/12/2020
 *
 * @param {*} req
 * @param {*} res
 *
 * @return Object
 */
rolMethods.getRol = async (req, res) => {
    const permission = ac.can(req.user.rol.name).readAny("rol");
    if (permission.granted) {
        try {
            const rolID = req.params.id;
            const rol = await Rol.findById(rolID);
            return res.status(200).json({
                status: true,
                rol,
                message: "Se ha encontrado el rol.",
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
 * Last modified: 12/12/2020
 *
 * @param {*} req
 * @param {*} res
 *
 * @return Object
 */
rolMethods.createRol = async (req, res) => {
    const permission = ac.can(req.user.rol.name).createAny("rol");
    if (permission.granted) {
        const { name } = req.body;
        if (name) {
            const rol = new Rol({
                name,
            });

            if (await rol.save()) {
                return res.status(201).json({
                    status: true,
                    message: "El rol se ha creado correctamente.",
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
            message: "No tienes permisos para ejecutar esta acción",
        });
    }
};

/**
 * Author: Juan Araque
 * Last modified: 12/12/2020
 *
 * @param {*} req
 * @param {*} res
 *
 * @return Object
 */
rolMethods.updateRol = async (req, res) => {
    const permission = ac.can(req.user.rol.name).updateAny("rol");
    if (permission.granted) {
        const { rolID, name } = req.body;
        if (rolID) {
            if (name) {
                const getRol = await Rol.findById(rolID);
                if (getRol) {
                    try {
                        await getRol.updateOne({
                            name,
                        });

                        return res.status(200).json({
                            status: true,
                            message: "El rol se ha actualizado correctamente.",
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
            return res.status(400).json({
                status: false,
                message: "El ID es requerido.",
            });
        }
    } else {
        return res.status(403).json({
            status: false,
            message: "No tienes permisos para ejecutar esta acción",
        });
    }
};

/**
 * Author: Juan Araque
 * Last modified: 12/12/2020
 *
 * @param {*} req
 * @param {*} res
 *
 * @return Object
 */
rolMethods.deleteRol = async (req, res) => {
    const permission = ac.can(req.user.rol.name).deleteAny("rol");
    if (permission.granted) {
        const { rolID } = req.body;
        if (rolID) {
            try {
                const getRol = await Rol.findById(rolID);
                if (getRol) {
                    getRol.remove();
                    return res.status(200).json({
                        status: true,
                        message: "El rol fue eliminado correctamente.",
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
            return res.status(400).json({
                status: false,
                message: "El ID es requerido.",
            });
        }
    } else {
        return res.status(403).json({
            status: false,
            message: "No tienes permisos para ejecutar esta acción",
        });
    }
};

module.exports = rolMethods;
