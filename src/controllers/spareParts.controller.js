const sparePartsMethods = {};
const SparePart = require("../models/SparePart");

/**
 * Author: Juan Araque
 * Last modified: 12/11/2020
 *
 * @param {*} req
 * @param {*} res
 *
 * @return Object
 */
sparePartsMethods.getSpareParts = async (req, res) => {
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
sparePartsMethods.getSparePart = async (req, res) => {
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
sparePartsMethods.createSparePart = async (req, res) => {
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
sparePartsMethods.updateSparePart = async (req, res) => {
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
sparePartsMethods.deleteSparePart = async (req, res) => {
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
};

module.exports = sparePartsMethods;
