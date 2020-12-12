const userMethods = {};
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Rol = require("../models/Rol");

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
                const token = await jwt.sign(user._id.toString(), process.env.SECRECT_KEY);
                if (!token) {
                    return res.status(400).json({
                        status: false,
                        message: "Ha ocurrido un error, por favor intentalo de nuevo.",
                    });
                }

                return res.status(200).json({
                    status: true,
                    token,
                    message: "Credenciales correctas.",
                });
            } else {
                return res.status(400).json({
                    status: false,
                    message: "El usuario y/o la contraseña son incorrectos.",
                });
            }
        } else {
            return res.status(400).json({
                status: false,
                message: "El usuario y/o la contraseña son incorrectos.",
            });
        }
    } else {
        return res.status(400).json({
            status: false,
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
                const getUserUsername = await getUserByParam(username, "username");
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
                    user.password = await user.encryptPassword(password);

                    if (await user.save()) {
                        return res.status(200).json({
                            status: true,
                            message: "El usuario ha sido registrado correctamente",
                        });
                    } else {
                        return res.status(400).json({
                            status: false,
                            type: "general",
                            message: "Ha ocurrido un error por favor intentalo nuevamente.",
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
            return res.status(200).json({
                status: true,
                message: "El token es correcto",
            });
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

module.exports = userMethods;
