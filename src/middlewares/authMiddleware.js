const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers["authorization"];
        if (!token) {
            return res.status(200).json({
                status: false,
                message: "El token es requerido.",
            });
        }

        const verify = await jwt.verify(token, process.env.SECRECT_KEY);
        if (verify) {
            const user = await User.findById(verify);
            if (user) {
                req.user = user;
                next();
            } else {
                return res.status(404).json({
                    status: false,
                    logout: true,
                    message: "El usuario no existe.",
                });
            }
        } else {
            return res.status(200).json({
                status: false,
                message: "El token es incorrecto.",
            });
        }
    } catch (error) {
        return res.status(400).json({
            status: false,
            message: "El token es incorrecto.",
        });
    }
};

module.exports = authMiddleware;
