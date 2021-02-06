const machineMethods = {};
const Machine = require("../models/Machine");
const SparePart = require("../models/SparePart");
const MachineUse = require("../models/MachineUse");
const Environment = require("../models/Environment");
const Notification = require("../models/Notification");
const ac = require("../middlewares/accessControl");
const fs = require("fs");
const { maintenanceStatus } = require("../config/config");

/**
 * Author: Juan Araque
 * Last modified: 24/01/2021
 *
 * @param {*} req
 * @param {*} res
 *
 * @return Object
 */
machineMethods.getMachines = async (req, res) => {
    const permission = ac.can(req.user.rol.name).readAny("machine");
    if (permission.granted) {
        try {
            const machines = await (
                await Machine.find()
                    .populate({
                        path: "machineUses",
                        populate: {
                            path: "user",
                            model: "User",
                            select: "name",
                        },
                    })
                    .populate({
                        path: "maintenances",
                        populate: {
                            path: "maintenanceType",
                            model: "MaintenanceType",
                        },
                    })
            ).reverse();

            let newMachinesFind = [];
            for (let m = 0; m < machines.length; m++) {
                let actualMachine = machines[m];
                let actualMachineSpareParts = [];

                for (let i = 0; i < machines[m].spareParts.length; i++) {
                    const getSparePart = await SparePart.findById(
                        machines[m].spareParts[i]._id,
                        {
                            _id: true,
                            name: true,
                            price: true,
                            create_at: true
                        }
                    );

                    actualMachineSpareParts.push({
                        sparePart: getSparePart,
                        stockUsed: machines[m].spareParts[i].stockUsed,
                    });
                }

                actualMachine.spareParts = actualMachineSpareParts;
                newMachinesFind.push(actualMachine);
            }

            return res.status(200).json({
                status: true,
                machines: newMachinesFind,
                message: "Se han encontrado maquinaría",
            });
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

/**
 * Author: Juan Araque
 * Last modified: 24/01/2021
 *
 * @param {*} req
 * @param {*} res
 *
 * @return Object
 */
machineMethods.getMachineNoAuth = async (req, res) => {
    try {
        const machineID = req.params["id"];
        if (machineID) {
            const machine = await Machine.findById(machineID, {
                machineCode: true,
                name: true,
                status: true,
                _id: true,
                machinePhoto: true,
            });
            return res.status(200).json({
                state: true,
                machine,
                status: maintenanceStatus[machine.status],
                message: "Se han encontrado la maquina.",
            });
        } else {
            return res.status(200).json({
                status: false,
                message: "El ID de la maquina es requerido.",
            });
        }
    } catch (error) {
        return res.status(400).json({
            status: false,
            message: "Ha ocurrido un error, por favor intentalo nuevamente.",
        });
    }
};

/**
 * Author: Juan Araque
 * Last modified: 24/01/2021
 *
 * @param {*} req
 * @param {*} res
 *
 * @return Object
 */
machineMethods.createMachine = async (req, res) => {
    const permission = ac.can(req.user.rol.name).createAny("machine");
    if (permission.granted) {
        const {
            environmentID,
            machineCode,
            name,
            totalHoursToMaintenance,
            totalHoursRegisted,
        } = req.body;
        if (req.file) {
            if (
                environmentID &&
                machineCode &&
                name &&
                totalHoursToMaintenance
            ) {
                try {
                    const environmnet = await Environment.findById(
                        environmentID
                    );
                    if (!environmnet) {
                        if (req.file) {
                            fs.unlinkSync(req.file.path);
                        }
                        return res.status(200).json({
                            status: false,
                            message: "El código del ambiente es incorrecto.",
                        });
                    }

                    const verifyMachine = await Machine.findOne({
                        machineCode,
                    });
                    if (verifyMachine) {
                        if (req.file) {
                            fs.unlinkSync(req.file.path);
                        }
                        return res.status(200).json({
                            status: false,
                            message: "El código de la maquina ya esta en uso.",
                        });
                    }

                    const machineData = {
                        environmentID,
                        machineCode,
                        name,
                        totalHoursToMaintenance,
                        totalHoursWorking: totalHoursRegisted,
                        totalHoursRegisted,
                    };
                    if (req.file) {
                        machineData.machinePhoto = {
                            filename: req.file.filename,
                            folder: "img/machines/",
                        };
                    }

                    const machine = new Machine(machineData);

                    if (await machine.save()) {
                        req.io.emit("newMachineSaved", {
                            machines: machine,
                        });
                        return res.status(201).json({
                            status: true,
                            machines: machine,
                            message: "La maquina se ha creado correctamente.",
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
                        message: "Ha ocurrido un error, intentalo nuevamente.",
                    });
                }
            } else {
                if (req.file) {
                    fs.unlinkSync(req.file.path);
                }
                return res.status(200).json({
                    status: false,
                    message: "Debes llenar los campos requeridos.",
                });
            }
        } else {
            return res.status(403).json({
                status: false,
                message: "La foto de la maquina es requerida.",
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
 * Last modified: 24/01/2021
 *
 * @param {*} req
 * @param {*} res
 *
 * @return Object
 */
machineMethods.updateMachine = async (req, res) => {
    const permission = ac.can(req.user.rol.name).updateAny("machine");
    if (permission.granted) {
        const {
            machineID,
            environmentID,
            machineCode,
            name,
            totalHoursToMaintenance,
        } = req.body;
        if (machineID) {
            if (
                environmentID &&
                machineCode &&
                name &&
                totalHoursToMaintenance
            ) {
                const getMachine = await Machine.findById(machineID);
                if (getMachine) {
                    try {
                        const verifyMachineCode = await Machine.findOne({
                            machineCode,
                        });
                        if (
                            verifyMachineCode &&
                            machineCode !== getMachine.machineCode
                        ) {
                            if (req.file) {
                                fs.unlinkSync(req.file.path);
                            }
                            return res.status(200).json({
                                status: false,
                                message:
                                    "El código de la maquina ya esta en uso.",
                            });
                        }

                        const updatedMachine = {
                            environmentID,
                            machineCode,
                            name,
                            totalHoursToMaintenance,
                        };

                        if (req.file) {
                            if (getMachine.machinePhoto.filename) {
                                fs.unlinkSync(
                                    __dirname +
                                        "/../../public" +
                                        getMachine.machinePhoto.folder +
                                        getMachine.machinePhoto.filename
                                );
                            }

                            updatedMachine.machinePhoto = {
                                filename: req.file.filename,
                                folder: "/img/machines/",
                            };
                        }

                        await getMachine.updateOne(updatedMachine);

                        return res.status(200).json({
                            status: true,
                            updatedMachine: await Machine.findById(
                                machineID
                            ).populate("machineUses"),
                            message:
                                "La maquina se ha actualizado correctamente.",
                        });
                    } catch (error) {
                        if (req.file) {
                            fs.unlinkSync(req.file.path);
                        }
                        return res.status(400).json({
                            status: false,
                            message:
                                "Ha ocurrido un error, intentalo nuevamente.",
                        });
                    }
                } else {
                    if (req.file) {
                        fs.unlinkSync(req.file.path);
                    }
                    return res.status(404).json({
                        status: false,
                        message: "No se ha encontrado el recurso solicitado.",
                    });
                }
            } else {
                if (req.file) {
                    fs.unlinkSync(req.file.path);
                }
                return res.status(200).json({
                    status: false,
                    message: "Debes llenar los campos requeridos.",
                });
            }
        } else {
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            return res.status(200).json({
                status: false,
                message: "El ID de la maquina es requerido.",
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
 * Last modified: 24/01/2021
 *
 * @param {*} req
 * @param {*} res
 *
 * @return Object
 */
machineMethods.deleteMachine = async (req, res) => {
    const permission = ac.can(req.user.rol.name).deleteAny("machine");
    if (permission.granted) {
        const { machineID } = req.body;
        try {
            const getMachine = await Machine.findById(machineID);
            console.log(getMachine);
            if (getMachine) {
                if (getMachine.machinePhoto.filename) {
                    fs.unlinkSync(
                        __dirname +
                            "/../../public/" +
                            getMachine.machinePhoto.folder +
                            getMachine.machinePhoto.filename
                    );
                }
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
    } else {
        return res.status(403).json({
            status: false,
            message: "No tienes permisos para acceder a este recurso",
        });
    }
};

/**
 * Author: Juan Araque
 * Last modified: 24/01/2021
 *
 * @param {*} req
 * @param {*} res
 *
 * @return Object
 */
machineMethods.registerMachineUse = async (req, res) => {
    const permission = ac.can(req.user.rol.name).createAny("machineUse")
        .granted;
    if (permission) {
        const { machineID, hours, note } = req.body;
        if (machineID) {
            try {
                const machine = await Machine.findById(machineID);
                if (machine) {
                    if (machine.status === "active") {
                        if (hours && note) {
                            const machineUse = new MachineUse({
                                user: req.user._id,
                                hours,
                                note,
                            });

                            const newHoursTotalWorking =
                                machine.totalHoursRegisted + hours;
                            const newHoursWorking =
                                machine.totalHoursWorking + hours;

                            const dataToUpdate = {
                                totalHoursRegisted: newHoursTotalWorking,
                                totalHoursWorking: newHoursWorking,
                                machineUses: [
                                    ...machine.machineUses,
                                    machineUse._id,
                                ],
                            };

                            if (
                                newHoursWorking >=
                                machine.totalHoursToMaintenance
                            ) {
                                dataToUpdate.status = Object.keys(
                                    maintenanceStatus
                                ).find(
                                    (key) =>
                                        maintenanceStatus[key] ===
                                        maintenanceStatus.needMaintenance
                                );
                            }

                            if (await machineUse.save()) {
                                if (await machine.updateOne(dataToUpdate)) {
                                    if (dataToUpdate.status) {
                                        const notification = new Notification({
                                            message: `La maquina ${machine.machineCode}, ha sobrepasado las ${machine.totalHoursToMaintenance} horas para su mantenimiento.`,
                                        });
                                        if (await notification.save()) {
                                            req.io.emit(
                                                "notificationRecived",
                                                notification
                                            );
                                        }
                                    }
                                    const machineRefresh = await Machine.findById(
                                        machineID,
                                        {
                                            machineCode: true,
                                            name: true,
                                            status: true,
                                            _id: true,
                                            machinePhoto: true,
                                        }
                                    ).populate("machineUses");
                                    return res.status(201).json({
                                        state: true,
                                        machine: machineRefresh,
                                        status:
                                            maintenanceStatus[
                                                machineRefresh.status
                                            ],
                                        message:
                                            "Se ha registrado correctamente el uso de la maquina.",
                                    });
                                } else {
                                    await machineUse.remove();
                                    return res.status(400).json({
                                        status: false,
                                        message:
                                            "Ha ocurrido un error, por favor intentalo nuevemante.",
                                    });
                                }
                            } else {
                                return res.status(400).json({
                                    status: false,
                                    message:
                                        "Ha ocurrido un error, por favor intentalo nuevemante.",
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
                            message: `Esta maquina se encuentra en estado ${
                                maintenanceStatus[machine.status]
                            } y por ende no esta disponible, si es un fallo reportalo con el administrador.`,
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
                    message:
                        "Ha ocurrido un error, por favor intentalo nuevamente.",
                });
            }
        } else {
            return res.status(200).json({
                status: false,
                message: "El ID de la maquina es requerido.",
            });
        }
    } else {
        return res.status(403).json({
            status: false,
            message: "No tienes permisos para acceder a este recurso.",
        });
    }
};

module.exports = machineMethods;
