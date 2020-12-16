const environmentMethods = {};
const Environment = require("../models/Environment");
const ac = require("../middlewares/accessControl");

/**
 * Author: Juan Araque
 * Last modified: 12/13/2020
 *
 * @param {*} req
 * @param {*} res
 *
 * @return Object
 */
environmentMethods.getEnvironments = async (req, res) => {
    const permission = ac.can(req.user.rol.name).readAny("environment");
    if (permission.granted) {
        try {
            const environments = await Environment.find();
            return res.status(200).json({
                status: true,
                environments,
                message: "Se han encontrado ambientes",
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
 * Last modified: 12/13/2020
 *
 * @param {*} req
 * @param {*} res
 *
 * @return Object
 */
environmentMethods.getEnvironment = async (req, res) => {
    const permission = ac.can(req.user.rol.name).readAny("environment");
    if (permission.granted) {
        try {
            const environmentID = req.params.id;
            const environment = await Environment.findById(environmentID);
            if (environment) {
                return res.status(200).json({
                    status: true,
                    environment,
                    message: "Se han encontrado el ambiente",
                });
            } else {
                return res.status(400).json({
                    status: false,
                    message: "No se encontro el ambiente.",
                });
            }
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: "El ID suministrado es incorrecto",
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
 * Last modified: 12/13/2020
 *
 * @param {*} req
 * @param {*} res
 *
 * @return Object
 */
environmentMethods.createEnvironment = async (req, res) => {
    const permission = ac.can(req.user.rol.name).createAny("environment");
    if (permission.granted) {
        const { environmentCode, name } = req.body;
        if (environmentCode && name) {
            try {
                const compare = await Environment.findOne({ environmentCode });
                if (compare) {
                    return res.status(400).json({
                        status: false,
                        message: "El código del ambiente ya se encuentra en uso.",
                    });
                }

                const environment = new Environment({
                    environmentCode,
                    name,
                });

                if (await environment.save()) {
                    return res.status(201).json({
                        status: true,
                        message: "El ambiente ha sido creado correctamente.",
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
                    message: "Ha ocurrido un error intentalo nuevamente",
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
 * Last modified: 12/13/2020
 *
 * @param {*} req
 * @param {*} res
 *
 * @return Object
 */
environmentMethods.updateEnvironment = async (req, res) => {
    const permission = ac.can(req.user.rol.name).updateAny("environment");
    if (permission.granted) {
        const { environmentID, environmentCode, name } = req.body;
        if ((environmentCode, name)) {
            const compare = await Environment.findById(environmentID);
            if (compare) {
                if (compare.environmentCode !== environmentCode) {
                    const compareCode = await Environment.findOne({ environmentCode });
                    if (compareCode) {
                        return res.status(400).json({
                            status: false,
                            message: "El código del ambiente ya se encuentra en uso.",
                        });
                    }
                }

                try {
                    await compare.update({
                        environmentCode,
                        name,
                    });

                    return res.status(400).json({
                        status: true,
                        message: "Se ha actualizado el ambiente.",
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
 * Last modified: 12/13/2020
 *
 * @param {*} req
 * @param {*} res
 *
 * @return Object
 */
environmentMethods.deleteEnvironment = async (req, res) => {
    const permission = ac.can(req.user.rol.name).deleteAny("environment");
    if (permission.granted) {
        const { environmentID } = req.body;
        try {
            const getEnvironment = await Environment.findById(environmentID);
            if (getEnvironment) {
                getEnvironment.remove();
                return res.status(201).json({
                    status: true,
                    message: "El ambiente ha sido eliminado correctamente.",
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

module.exports = environmentMethods;
