const sparePartsMethods = {};
const { Types } = require("mongoose");
const SparePart = require("../models/SparePart");
const Machine = require("../models/Machine");
const ac = require("../middlewares/accessControl");
const fs = require("fs");

/**
 * Author: Juan Araque
 * Last modified: 31/01/2021
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
 * Last modified: 31/01/2021
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
            const sparePartID = req.params["id"];
            if (sparePartID) {
                const sparePart = await SparePart.findById(
                    sparePartID
                ).populate("machines");
                return res.status(200).json({
                    status: true,
                    sparePart,
                    message: "Se han encontrado la pieza de repuesto.",
                });
            } else {
                return res.status(200).json({
                    status: false,
                    message: "El ID de la pieza de repuesto es requerido.",
                });
            }
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: "Ha ocurrido un error, por favor intetalo nuevamente.",
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
 * Last modified: 31/01/2021
 *
 * @param {*} req
 * @param {*} res
 *
 * @return Object
 */
sparePartsMethods.createSparePart = async (req, res) => {
    const permission = ac.can(req.user.rol.name).createAny("sparePart");
    if (permission.granted) {
        const { sparePartCode, price, stock, name } = req.body;
        if (req.file) {
            if (sparePartCode && price && stock && name) {
                try {
                    const evaluateCode = await SparePart.findOne({
                        sparePartCode,
                    });
                    if (evaluateCode) {
                        if (req.file) {
                            fs.unlinkSync(req.file.path);
                        }
                        return res.status(200).json({
                            status: false,
                            message:
                                "El código de la pieza de repuesto ya esta en uso.",
                        });
                    }

                    const sparePartData = {
                        sparePartCode,
                        price,
                        stock,
                        name,
                    };

                    if (req.file) {
                        sparePartData.sparePartPhoto = {
                            filename: req.file.filename,
                            folder: "/img/spareParts/",
                        };
                    } else {
                        return res.status(200).json({
                            status: false,
                            message:
                                "La foto de la pieza de repuesto es requerida.",
                        });
                    }

                    // if (machines) {
                    //     const machinesArray = JSON.parse(machines);
                    //     for (let i in machinesArray) {
                    //         const getMachine = await Machine.findById(
                    //             machinesArray[i],
                    //             {
                    //                 _id: true,
                    //             }
                    //         );
                    //         if (!getMachine) {
                    //             if (req.file) {
                    //                 fs.unlinkSync(req.file.path);
                    //             }
                    //             return res.status(200).json({
                    //                 status: false,
                    //                 message:
                    //                     "Lo sentimos pero alguna de las maquinas que seleccionaste no existen.",
                    //             });
                    //         }
                    //     }
                    //     sparePartData.machines = machinesArray;
                    // }

                    const sparePart = new SparePart(sparePartData);

                    if (await sparePart.save()) {
                        return res.status(201).json({
                            status: true,
                            sparePart,
                            message:
                                "La pieza de repuesto se ha creado correctamente.",
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
                        message:
                            "Ha ocurrido un error, por favor intentalo nuevamente.",
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
            return res.status(200).json({
                status: false,
                message: "La foto de la pieza de repuesto es requerida.",
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
 * Last modified: 31/01/2021
 *
 * @param {*} req
 * @param {*} res
 *
 * @return Object
 */
sparePartsMethods.updateSparePart = async (req, res) => {
    const permission = ac.can(req.user.rol.name).updateAny("sparePart");
    if (permission.granted) {
        const { sparePartID, price, stock, name } = req.body;
        if (sparePartID) {
            if (price && stock && name) {
                try {
                    const getsparePart = await SparePart.findById(sparePartID);
                    if (getsparePart) {
                        const sparePartData = {
                            price,
                            stock,
                            name,
                        };

                        // if (machines) {
                        //     const machinesArray = JSON.parse(machines);
                        //     for (let i in machinesArray) {
                        //         const getMachine = await Machine.findById(
                        //             machinesArray[i],
                        //             {
                        //                 _id: true,
                        //             }
                        //         );
                        //         if (!getMachine) {
                        //             if (req.file) {
                        //                 fs.unlinkSync(req.file.path);
                        //             }
                        //             return res.status(200).json({
                        //                 status: false,
                        //                 message:
                        //                     "Lo sentimos pero alguna de las maquinas que seleccionaste no existen.",
                        //             });
                        //         }
                        //     }
                        //     sparePartData.machines = machinesArray;
                        // }

                        if (req.file) {
                            if (getsparePart.sparePartPhoto.filename) {
                                if (
                                    fs.existsSync(
                                        __dirname +
                                            "/../../public" +
                                            getsparePart.sparePartPhoto.folder +
                                            getsparePart.sparePartPhoto.filename
                                    )
                                ) {
                                    fs.unlinkSync(
                                        __dirname +
                                            "/../../public" +
                                            getsparePart.sparePartPhoto.folder +
                                            getsparePart.sparePartPhoto.filename
                                    );
                                }
                            }

                            sparePartData.sparePartPhoto = {
                                filename: req.file.filename,
                                folder: "/img/spareParts/",
                            };
                        }

                        if (await getsparePart.updateOne(sparePartData)) {
                            return res.status(200).json({
                                status: true,
                                sparePart: await SparePart.findById(
                                    sparePartID
                                ),
                                message:
                                    "La pieza de repuesto se ha actualizado correctamente.",
                            });
                        } else {
                            if (req.file) {
                                fs.unlinkSync(req.file.path);
                            }
                            return res.status(400).json({
                                status: false,
                                message:
                                    "Ha ocurrido un error, por favor intentalo nuevamente.",
                            });
                        }
                    } else {
                        if (req.file) {
                            fs.unlinkSync(req.file.path);
                        }
                        return res.status(404).json({
                            status: false,
                            message:
                                "No se ha encontrado el recurso solicitado.",
                        });
                    }
                } catch (error) {
                    if (req.file) {
                        fs.unlinkSync(req.file.path);
                    }
                    return res.status(400).json({
                        status: false,
                        message:
                            "Ha ocurrido un error, por favor intentalo nuevamente.",
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
            return res.status(200).json({
                status: false,
                message: "El ID de la pieza de repuesto es requerida.",
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
 * Last modified: 31/01/2021
 *
 * @param {*} req
 * @param {*} res
 *
 * @return Object
 */
sparePartsMethods.assignSparePartToMachine = async (req, res) => {
    const permission = ac.can(req.user.rol.name).updateAny("sparePart").granted;
    if (permission) {
        const { machineID, sparePartID, stock } = req.body;
        try {
            if (sparePartID) {
                const sparePart = await SparePart.findById(sparePartID);
                if (sparePart) {
                    if (machineID) {
                        const machine = await Machine.findById(machineID);
                        if (machine) {
                            if (stock) {
                                if (stock === 0) {
                                    return res.status(200).json({
                                        status: false,
                                        message:
                                            "Lo sentimos el numero de partes para su uso debe ser mayor a 0.",
                                    });
                                }

                                if (sparePart.stock >= stock) {
                                    const updateSparePart = {
                                        machines: [
                                            ...sparePart.machines,
                                            {
                                                _id: machineID,
                                                stockUsed: stock,
                                            },
                                        ],
                                        stock: sparePart.stock - stock,
                                    };

                                    const updateMachine = {
                                        spareParts: [
                                            ...machine.spareParts,
                                            {
                                                _id: sparePartID,
                                                stockUsed: stock,
                                            },
                                        ],
                                    };

                                    if (
                                        await sparePart.updateOne(
                                            updateSparePart
                                        )
                                    ) {
                                        if (
                                            await machine.updateOne(
                                                updateMachine
                                            )
                                        ) {
                                            return res.status(200).json({
                                                status: true,
                                                machine: await Machine.findById(
                                                    machineID
                                                ),
                                                sparePart: await SparePart.findById(
                                                    sparePartID
                                                ),
                                                message:
                                                    "El repuesto se ha asignado correctamente.",
                                            });
                                        } else {
                                            await sparePart.updateOne({
                                                machines: sparePart.machines,
                                                stock: sparePart.stock,
                                            });
                                            return res.status(400).json({
                                                status: false,
                                                message:
                                                    "Ha ocurrido un error, por favor intentalo nuevamente.",
                                            });
                                        }
                                    } else {
                                        return res.status(400).json({
                                            status: false,
                                            message:
                                                "Ha ocurrido un error, por favor intentalo nuevamente.",
                                        });
                                    }
                                } else {
                                    return res.status(200).json({
                                        status: false,
                                        message:
                                            "Lo sentimos pero no hay suficiente stock en el inventario.",
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
                                message:
                                    "No se ha encontrado la maquina solicitada.",
                            });
                        }
                    } else {
                        return res.status(200).json({
                            status: false,
                            message: "El ID de la maquina es requerido.",
                        });
                    }
                } else {
                    return res.status(200).json({
                        status: false,
                        message: "No se ha encontrado el repuesto solicitado.",
                    });
                }
            } else {
                return res.status(200).json({
                    status: false,
                    message: "El ID de repuesto es requerido.",
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
            message: "No tienes permisos para acceder a este recurso",
        });
    }
};

/**
 * Author: Juan Araque
 * Last modified: 31/01/2021
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
                    message:
                        "La pieza de repuesto fue eliminada correctamente.",
                });
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
        return res.status(403).json({
            status: false,
            message: "No tienes permisos para acceder a este recurso.",
        });
    }
};

module.exports = sparePartsMethods;
