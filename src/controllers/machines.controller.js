const machineMethods = {};
const Machine = require("../models/Machine");

/**
 * Author: Juan Araque
 * Last modified: 11/30/2020
 *
 * @param {*} req
 * @param {*} res
 *
 * @return Object
 */
machineMethods.getMachines = async (req, res) => {
    try {
        const machines = await Machine.find();
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
};

/**
 * Author: Juan Araque
 * Last modified: 11/30/2020
 *
 * @param {*} req
 * @param {*} res
 *
 * @return Object
 */
machineMethods.getMachine = async (req, res) => {
    try {
        const machineID = req.params("id");
        const machine = await Machine.findById(machineID);
        return res.status(200).json({
            status: true,
            machine,
            message: "Se han encontrado la maquina.",
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
 * Last modified: 11/30/2020
 *
 * @param {*} req
 * @param {*} res
 *
 * @return Object
 */
machineMethods.createMachine = async (req, res) => {
    const { environment, name } = req.body;
    if ((environment, name)) {
        const machine = new Machine({
            environment,
            name,
        });

        if (await machine.save()) {
            return res.status(201).json({
                status: true,
                message: "La maquina se ha creado correctamente.",
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
 * Last modified: 11/30/2020
 *
 * @param {*} req
 * @param {*} res
 *
 * @return Object
 */
machineMethods.updateMachine = async (req, res) => {
    const { machineID, environment, name } = req.body;
    if ((environment, name)) {
        const getMachine = await Machine.findById(machineID);
        if (getMachine) {
            try {
                await getMachine.update({
                    environment,
                    name,
                });

                return res.status(400).json({
                    status: true,
                    message: "La maquina se ha actualizado correctamente.",
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
 * Last modified: 11/30/2020
 *
 * @param {*} req
 * @param {*} res
 *
 * @return Object
 */
machineMethods.deleteMachine = async (req, res) => {
    const { machineID } = req.body;
    try {
        const getMachine = await Machine.findById(machineID);
        if (getMachine) {
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
};

module.exports = machineMethods;
