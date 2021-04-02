const machineMethods = {};
const Machine = require("../models/Machine");
const Maintenance = require("../models/Maintenance");
const SparePart = require("../models/SparePart");
const MachineUse = require("../models/MachineUse");
const Environment = require("../models/Environment");
const MachineType = require("../models/MachineType");
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
                    .populate("enableSpareParts")
            ).reverse();

            return res.status(200).json({
                status: true,
                machines,
                message: "Se han encontrado maquinaría",
            });
        } catch (error) {
            console.error(error);
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
 * Last modified: 22/03/2021
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
            machineType,
            name,
            totalHoursRegisted,
            model,
            adquisiton_year,
            brand,
            stream,
            watts,
            voltage,
        } = req.body;
        if (req.file) {
            if (
                environmentID &&
                machineCode &&
                name &&
                model &&
                adquisiton_year &&
                brand &&
                stream &&
                watts &&
                voltage &&
                machineType
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

                    const machineTypeVerify = await MachineType.findById(
                        machineType
                    );
                    if (!machineTypeVerify) {
                        if (req.file) {
                            fs.unlinkSync(req.file.path);
                        }
                        return res.status(200).json({
                            status: false,
                            message: "El tipo de maquina es incorrecto.",
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
                        machineType,
                        machineCode,
                        name,
                        totalHoursWorking: totalHoursRegisted,
                        totalHoursRegisted,
                        model,
                        adquisiton_year,
                        brand,
                        stream,
                        watts,
                        voltage,
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
                    console.log(error);
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
 * Last modified: 22/03/2021
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
            machineType,
            environmentID,
            machineCode,
            name,
            model,
            adquisiton_year,
            brand,
            stream,
            watts,
            voltage,
        } = req.body;
        if (machineID) {
            if (
                environmentID &&
                machineCode &&
                name &&
                model &&
                adquisiton_year &&
                brand &&
                stream &&
                watts &&
                voltage &&
                machineType
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

                        const machineTypeVerify = await MachineType.findById(
                            machineType
                        );
                        if (!machineTypeVerify) {
                            if (req.file) {
                                fs.unlinkSync(req.file.path);
                            }
                            return res.status(200).json({
                                status: false,
                                message: "El tipo de maquina es incorrecto.",
                            });
                        }

                        const updatedMachine = {
                            environmentID,
                            machineType,
                            machineCode,
                            name,
                            model,
                            adquisiton_year,
                            brand,
                            stream,
                            watts,
                            voltage,
                        };

                        if (req.file) {
                            if (getMachine.machinePhoto.filename) {
                                const route =
                                    __dirname +
                                    "/../../public/" +
                                    getMachine.machinePhoto.folder +
                                    getMachine.machinePhoto.filename;
                                if (await fs.existsSync(route)) {
                                    fs.unlinkSync(route);
                                }
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
                        console.log(error);
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

                            if (machine.preconfiguredMaitenances) {
                                let newMaitenances = [];
                                for (let preconfiguredMaitenance of machine.preconfiguredMaitenances) {
                                    if (
                                        newHoursWorking >=
                                            preconfiguredMaitenance.hours &&
                                        machine.totalHoursWorking <=
                                            preconfiguredMaitenance.hours
                                    ) {
                                        const getMaitenance = await Maintenance.findById(
                                            preconfiguredMaitenance.maintenance
                                        ).populate("maintenanceType");
                                        if (getMaitenance) {
                                            newMaitenances.push({
                                                name:
                                                    getMaitenance
                                                        .maintenanceType.name +
                                                    " - " +
                                                    getMaitenance.name,
                                                check_list:
                                                    getMaitenance.check_list,
                                                maintenanceType:
                                                    getMaitenance
                                                        .maintenanceType._id,
                                            });
                                            dataToUpdate.status = Object.keys(
                                                maintenanceStatus
                                            ).find(
                                                (key) =>
                                                    maintenanceStatus[key] ===
                                                    maintenanceStatus.needMaintenance
                                            );
                                        } else {
                                            return res.status(400).json({
                                                status: false,
                                                message:
                                                    "No se ha encontrado el mantenimiento preconfigurado.",
                                            });
                                        }
                                    }
                                }

                                dataToUpdate.maintenances = [
                                    ...machine.maintenances,
                                    ...newMaitenances,
                                ];
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

/**
 * Author: Juan Araque
 * Last modified: 24/01/2021
 *
 * @param {*} req
 * @param {*} res
 *
 * @return Object
 */
machineMethods.registerMachineIssue = async (req, res) => {
    const permission = ac.can(req.user.rol.name).createAny("machineIssue")
        .granted;
    if (permission) {
        const { machineID, issue } = req.body;
        if (machineID) {
            try {
                const machine = await Machine.findById(machineID);
                if (machine) {
                    const machineIssues = [
                        ...machine.machineIssues,
                        {
                            name: req.user.name,
                            note: issue,
                            date: new Date(),
                        },
                    ];
                    if (issue) {
                        if (
                            await machine.updateOne({
                                machineIssues,
                            })
                        ) {
                            return res.status(201).json({
                                status: true,
                                message:
                                    "Se ha registrado correctamente el reporte de la maquina.",
                            });
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

/**
 * Author: Juan Araque
 * Last modified: 24/03/2021
 *
 * @param {*} req
 * @param {*} res
 *
 * @return Object
 */
machineMethods.updatePreconfiguredMaitenances = async (req, res) => {
    const permission = ac.can(req.user.rol.name).updateAny("machine");
    if (permission.granted) {
        const { machineID, preconfiguredMaitenances } = req.body;
        if (machineID) {
            if (preconfiguredMaitenances) {
                try {
                    const machine = await Machine.findById(machineID);
                    if (machine) {
                        preconfiguredMaitenances.forEach(
                            async (maintenance) => {
                                const findMaitenance = await Maintenance.findById(
                                    maintenance.maintenance
                                );
                                if (!findMaitenance) {
                                    return res.status(200).json({
                                        status: false,
                                        message:
                                            "No se ha encontrado el mantenimiento seleccionado.",
                                    });
                                }
                            }
                        );
                        if (
                            await machine.updateOne({
                                preconfiguredMaitenances,
                            })
                        ) {
                            return res.status(200).json({
                                status: true,
                                updatedMachine: await Machine.findById(
                                    machineID
                                ),
                                message: "Mantenimientos actualizados",
                            });
                        } else {
                            return res.status(200).json({
                                status: false,
                                message:
                                    "Ha ocurrido un error, intentalo nuevamente.",
                            });
                        }
                    } else {
                        return res.status(200).json({
                            status: false,
                            message:
                                "No se ha encontrado el recurso solicitado.",
                        });
                    }
                } catch (error) {
                    return res.status(200).json({
                        status: false,
                        message: "Ha ocurrido un error, intentalo nuevamente.",
                    });
                }
            } else {
                return res.status(200).json({
                    status: false,
                    message: "Debes llenar los campos requeridos.",
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

/**
 * Author: Juan Araque
 * Last modified: 30/03/2021
 *
 * @param {*} req
 * @param {*} res
 *
 * @return Object
 */
machineMethods.completeCheckListTask = async (req, res) => {
    const permission = ac.can(req.user.rol.name).updateAny("machine");
    if (permission.granted) {
        const { completed, machineID, maintenanceID, taskID } = req.body;
        if (machineID) {
            try {
                const getMachine = await Machine.findById(machineID);
                if (getMachine) {
                    if (taskID) {
                        const getMachineMaintenance = getMachine.maintenances.find(
                            (maintenance) => {
                                return (
                                    maintenance._id.toString() ===
                                    maintenanceID.toString()
                                );
                            }
                        );
                        if (getMachineMaintenance) {
                            const completeMaintenanceTask = getMachine.maintenances.map(
                                (maintenance) => {
                                    if (
                                        maintenance._id.toString() ===
                                        maintenanceID.toString()
                                    ) {
                                        maintenance.check_list = maintenance.check_list.map(
                                            (task) => {
                                                if (
                                                    task.id.toString() ===
                                                    taskID.toString()
                                                ) {
                                                    task.complete = completed;
                                                    task.complete_at = new Date();
                                                }
                                                return task;
                                            }
                                        );

                                        const checkIfMaintenanceComplete = maintenance.check_list.every(
                                            (maintenance) => {
                                                return (
                                                    maintenance.complete ===
                                                    true
                                                );
                                            }
                                        );

                                        if (checkIfMaintenanceComplete) {
                                            maintenance.complete = true;
                                            maintenance.complete_at = new Date();
                                        }
                                    }
                                    return maintenance;
                                }
                            );

                            const completeAll = completeMaintenanceTask.every(
                                (maintenance) => {
                                    return maintenance.complete === true;
                                }
                            );

                            const dataToUpdate = {
                                maintenances: completeMaintenanceTask,
                            };

                            let message =
                                "La tarea ha sido completado correctamente";

                            if (completeAll) {
                                dataToUpdate.status = Object.keys(
                                    maintenanceStatus
                                ).find(
                                    (key) =>
                                        maintenanceStatus[key] ===
                                        maintenanceStatus.active
                                );
                                message =
                                    "Todos los mantenimientos han sido completado, se ha cambiado el estado de la maquina a activa.";
                            }

                            await getMachine.updateOne(dataToUpdate);

                            return res.status(200).json({
                                status: true,
                                updatedMachine: await Machine.findById(
                                    machineID
                                ).populate("machineUses"),
                                message,
                            });
                        } else {
                            return res.status(200).json({
                                status: false,
                                message:
                                    "No se ha encontrado el mantenimiento solicitado.",
                            });
                        }
                    } else {
                        return res.status(200).json({
                            status: false,
                            message: "El ID de la tarea es requerido.",
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

/**
 * Author: Juan Araque
 * Last modified: 30/03/2021
 *
 * @param {*} req
 * @param {*} res
 *
 * @return Object
 */

machineMethods.resetMachineHours = async (req, res) => {
    const permission = ac.can(req.user.rol.name).updateAny("machine");
    if (permission.granted) {
        try {
            const { machineID } = req.body;
            if (machineID) {
                const getMachine = await Machine.findById(machineID);
                if (getMachine) {
                    await getMachine.updateOne({
                        totalHoursWorking: 0,
                    });
                    return res.status(200).json({
                        status: true,
                        updatedMachine: await Machine.findById(machineID)
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
                            .populate("enableSpareParts"),
                        message: "Las horas de trabajo han sido reinciadas a 0",
                    });
                } else {
                    return res.status(404).json({
                        status: false,
                        message: "No se ha encontrado el recurso solicitado.",
                    });
                }
            } else {
                return res.status(200).json({
                    status: false,
                    message: "El ID de la maquina es requerido.",
                });
            }
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: "Ha ocurrido un error, intentalo nuevamente.",
            });
        }
    }
};

module.exports = machineMethods;
