const sparePartsMethods = {};
const SparePart = require("../models/SparePart");

/**
 * Author: Juan Araque
 * Last modified: 12/26/2020
 *
 * @param {*} req
 * @param {*} res
 *
 * @return Object
 */
sparePartsMethods.getSpareParts = async (req, res) => {
    const permission = ac.can(req.user.rol.name).readAny("sparePart");
    if (permission.granted) {
        try {
            const spareParts = await SparePart.find();
            return res.status(200).json({
                status: true,
                spareParts,
                message: "Se han encontrado partes de repuesto",
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
 * Last modified: 12/26/2020
 *
 * @param {*} req
 * @param {*} res
 *
 * @return Object
 */
sparePartsMethods.getSparePart = async (req, res) => {
    const permission = ac.can(req.user.rol.name).readOwn("sparePart");
    if (permission.granted) {
        try {
            const sparePartID = req.params("id");
            const sparePart = await SparePart.findById(sparePartID);
            return res.status(200).json({
                status: true,
                sparePart,
                message: "Se han encontrado la pieza de repuesto.",
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
 * Last modified: 12/26/2020
 *
 * @param {*} req
 * @param {*} res
 *
 * @return Object
 */
sparePartsMethods.createSparePart = async (req, res) => {
    const permission = ac.can(req.user.rol.name).createAny("sparePart");
    if (permission.granted) {
        const { name } = req.body;
        if (name) {
            const sparePart = new SparePart({
                name,
            });

            if (await sparePart.save()) {
                return res.status(201).json({
                    status: true,
                    message: "La pieza de repuesto se ha creado correctamente.",
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
 * Last modified: 12/26/2020
 *
 * @param {*} req
 * @param {*} res
 *
 * @return Object
 */
sparePartsMethods.updateSparePart = async (req, res) => {
    const permission = ac.can(req.user.rol.name).updateAny("sparePart");
    if (permission.granted) {
        const { sparePartID, name } = req.body;
        if (name) {
            const getsparePart = await SparePart.findById(sparePartID);
            if (getsparePart) {
                try {
                    await getsparePart.update({
                        name,
                    });

                    return res.status(400).json({
                        status: true,
                        message: "La pieza de repuesto se ha actualizado correctamente.",
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
 * Last modified: 12/26/2020
 *
 * @param {*} req
 * @param {*} res
 *
 * @return Object
 */
sparePartsMethods.deleteSparePart = async (req, res) => {
    const permission = ac.can(req.user.rol.name).deleteAny("sparePart");
    if (permission.granted) {
        const { sparePartID } = req.body;
        try {
            const getsparePart = await SparePart.findById(sparePartID);
            if (getsparePart) {
                getsparePart.remove();
                return res.status(201).json({
                    status: true,
                    message: "La pieza de repuesto fue eliminada correctamente.",
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

module.exports = sparePartsMethods;
