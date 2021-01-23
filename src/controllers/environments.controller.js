const environmentMethods = {};
const Environment = require("../models/Environment");
const ac = require("../middlewares/accessControl");
const fs = require("fs");

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
            const environments = await (await Environment.find()).reverse();
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
        if (req.file) {
            const { environmentCode, name } = req.body;
            if (environmentCode && name) {
                try {
                    const compare = await Environment.findOne({
                        environmentCode,
                    });
                    if (compare) {
                        if (req.file) {
                            fs.unlinkSync(req.file.path);
                        }
                        return res.status(400).json({
                            status: false,
                            message:
                                "El código del ambiente ya se encuentra en uso.",
                        });
                    }

                    const environment = new Environment({
                        environmentPhoto: {
                            filename: req.file.filename,
                            folder: "/img/environments/",
                        },
                        environmentCode,
                        name,
                    });

                    if (await environment.save()) {
                        return res.status(201).json({
                            status: true,
                            environments: environment,
                            message:
                                "El ambiente ha sido creado correctamente.",
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
                        message: "Ha ocurrido un error intentalo nuevamente",
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
            return res.status(400).json({
                status: false,
                message: "La foto del ambiente es requerida",
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
                    const compareCode = await Environment.findOne({
                        environmentCode,
                    });
                    if (compareCode) {
                        if (req.file) {
                            fs.unlinkSync(req.file.path);
                        }
                        return res.status(400).json({
                            status: false,
                            message:
                                "El código del ambiente ya se encuentra en uso.",
                        });
                    }
                }

                try {
                    const updatedEnvironment = {
                        environmentCode,
                        name,
                    };

                    if (req.file) {
                        if (compare.environmentPhoto.filename) {
                            fs.unlinkSync(
                                __dirname +
                                    "/../../public" +
                                    compare.environmentPhoto.folder +
                                    compare.environmentPhoto.filename
                            );
                        }

                        updatedEnvironment.environmentPhoto = {
                            filename: req.file.filename,
                            folder: "/img/environments/",
                        };
                    }

                    await compare.updateOne(updatedEnvironment);

                    return res.status(200).json({
                        status: true,
                        updatedEnvironment: await Environment.findById(
                            environmentID
                        ),
                        message: "Se ha actualizado el ambiente.",
                    });
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
                if (getEnvironment.environmentPhoto.filename) {
                    fs.unlinkSync(
                        __dirname +
                            "/../../public" +
                            getEnvironment.environmentPhoto.folder +
                            getEnvironment.environmentPhoto.filename
                    );
                }
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
