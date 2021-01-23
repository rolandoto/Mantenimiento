const userMethods = {};
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Rol = require("../models/Rol");
const AC = require("../middlewares/accessControl");
const fs = require("fs");

async function getUserByParam(value, field) {
    const search = field === "email" ? { email: value } : { username: value };
    const user = await User.findOne(search);
    if (user) {
        return user;
    } else {
        return false;
    }
}

/**
 * Author: Juan Araque
 * Last modified: 11/29/2020
 *
 * @param {*} req
 * @param {*} res
 *
 * @return Object
 */
userMethods.login = async (req, res) => {
    const { email, password } = req.body;
    if (email && password) {
        const user = await getUserByParam(email, "email");
        if (user) {
            const verifyPassword = await user.verifyPassword(password);
            if (verifyPassword) {
                const token = await jwt.sign(
                    user._id.toString(),
                    process.env.SECRECT_KEY
                );
                if (!token) {
                    return res.status(400).json({
                        status: false,
                        error: "general",
                        message:
                            "Ha ocurrido un error, por favor intentalo de nuevo.",
                    });
                }

                try {
                    const userFind = await User.findById(user._id, {
                        name: true,
                        email: true,
                        username: true,
                        phone: true,
                        city: true,
                        profileImage: true,
                    });
                    return res.status(200).json({
                        status: true,
                        token,
                        user: userFind,
                        message: "El token es correcto",
                    });
                } catch (error) {
                    return res.status(400).json({
                        status: false,
                        message: "El token es incorrecto.",
                    });
                }
            } else {
                return res.status(400).json({
                    status: false,
                    error: "general",
                    message: "El usuario y/o la contraseña son incorrectos.",
                });
            }
        } else {
            return res.status(400).json({
                status: false,
                error: "general",
                message: "El usuario y/o la contraseña son incorrectos.",
            });
        }
    } else {
        return res.status(400).json({
            status: false,
            error: "general",
            message: "El email y la contraseña son requeridas.",
        });
    }
};

/**
 * Author: Juan Araque
 * Last modified: 11/29/2020
 *
 * @param {*} req
 * @param {*} res
 *
 * @return Object
 */
userMethods.register = async (req, res) => {
    const { rolID, email, username, password, name } = req.body;
    if (rolID) {
        try {
            const rol = await Rol.findById(rolID);
            if (rol) {
                if (email) {
                    const getUserEmail = await getUserByParam(email, "email");
                    if (getUserEmail) {
                        return res.status(400).json({
                            status: false,
                            type: "email",
                            message: "El email ya esta en uso.",
                        });
                    }

                    if (username) {
                        const getUserUsername = await getUserByParam(
                            username,
                            "username"
                        );
                        if (getUserUsername) {
                            return res.status(400).json({
                                status: false,
                                type: "username",
                                message: "El nombre de usuario ya esta en uso.",
                            });
                        }

                        if (password) {
                            const user = new User({
                                email,
                                username,
                                password,
                                name,
                                rol: {
                                    id: rol._id,
                                    name: rol.name,
                                },
                            });
                            user.password = await user.encryptPassword(
                                password
                            );

                            if (await user.save()) {
                                return res.status(201).json({
                                    status: true,
                                    message:
                                        "El usuario ha sido registrado correctamente",
                                });
                            } else {
                                return res.status(400).json({
                                    status: false,
                                    type: "general",
                                    message:
                                        "Ha ocurrido un error por favor intentalo nuevamente.",
                                });
                            }
                        } else {
                            return res.status(400).json({
                                status: false,
                                type: "password",
                                message: "La contraseña es requerida.",
                            });
                        }
                    } else {
                        return res.status(400).json({
                            status: false,
                            type: "username",
                            message: "El nombre de usuario es requerdio.",
                        });
                    }
                } else {
                    return res.status(400).json({
                        status: false,
                        type: "email",
                        message: "El email es requerido.",
                    });
                }
            } else {
                return res.status(400).json({
                    status: false,
                    type: "general",
                    message: "No se ha encontrado el rol solicitado.",
                });
            }
        } catch (error) {
            return res.status(400).json({
                status: false,
                type: "general",
                message: "Ha ocurrido un error.",
            });
        }
    } else {
        return res.status(400).json({
            status: false,
            type: "general",
            message: "El rol es requerido.",
        });
    }
};

/**
 * Author: Juan Araque
 * Last modified: 11/29/2020
 *
 * @param {*} req
 * @param {*} res
 *
 * @return Object
 */
userMethods.authenticate = async (req, res) => {
    const token = req.headers["authorization"];
    try {
        if (!token) {
            return res.status(400).json({
                status: false,
                message: "El token es requerido.",
            });
        }

        const verify = await jwt.verify(token, process.env.SECRECT_KEY);
        if (verify) {
            try {
                const user = await User.findById(verify, {
                    name: true,
                    email: true,
                    username: true,
                    phone: true,
                    city: true,
                    profileImage: true,
                });
                return res.status(200).json({
                    status: true,
                    token,
                    user,
                    message: "El token es correcto",
                });
            } catch (error) {
                return res.status(400).json({
                    status: false,
                    message: "El token es incorrecto.",
                });
            }
        } else {
            return res.status(400).json({
                status: false,
                message: "El token es incorrecto.",
            });
        }
    } catch (error) {
        return res.status(400).json({
            status: false,
            message: "Ha ocurrido un error.",
        });
    }
};

/**
 * Author: Juan Araque
 * Last modified: 21/01/2021
 *
 * @param {*} req
 * @param {*} res
 *
 * @return Object
 */
userMethods.updateUser = async (req, res) => {
    const permission = AC.can(req.user.rol.name).updateOwn("profile").granted;
    if (permission) {
        const { email, username, name, phone, city } = req.body;
        if (email && username && name) {
            try {
                const getUser = await User.findById(req.user._id);

                if (getUser) {
                    const verifyEmail = await getUserByParam(email, "email");
                    if (verifyEmail && getUser.email !== email) {
                        if (req.file) {
                            fs.unlinkSync(req.file.path);
                        }
                        return res.status(400).json({
                            status: false,
                            message: "Este email ya esta en uso.",
                        });
                    }

                    const verifyUsername = await getUserByParam(
                        username,
                        "username"
                    );
                    if (verifyUsername && getUser.username !== username) {
                        if (req.file) {
                            fs.unlinkSync(req.file.path);
                        }
                        return res.status(400).json({
                            status: false,
                            message: "Este nombre de usuario ya esta en uso.",
                        });
                    }

                    const userUpdated = {
                        email,
                        username,
                        name,
                        phone,
                        city,
                    };

                    if (req.file) {
                        userUpdated.profileImage = {
                            filename: req.file.filename,
                            folder: "/img/users/",
                        };

                        if (getUser.profileImage) {
                            fs.unlinkSync(
                                __dirname +
                                    "/../../public" +
                                    getUser.profileImage.folder +
                                    getUser.profileImage.filename
                            );
                        }
                    }

                    if (await getUser.updateOne(userUpdated)) {
                        return res.status(200).json({
                            status: true,
                            user: await User.findById(req.user._id, {
                                name: true,
                                email: true,
                                username: true,
                                phone: true,
                                city: true,
                                profileImage: true,
                            }),
                            message:
                                "El usuario ha sido actualizado correctamente.",
                        });
                    } else {
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
                            "No se ha encontrado el recurso solicitado, intentalo nuevamente.",
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
            return res.status(400).json({
                status: false,
                message: "Debes llenar los campos requeridos.",
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

module.exports = userMethods;
