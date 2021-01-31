const notificationMethods = {};
const Notification = require("../models/Notification");
const ac = require("../middlewares/accessControl");

notificationMethods.getNotifications = async (req, res) => {
    const permission = ac.can(req.user.rol.name).readAny("notification")
        .granted;
    if (permission) {
        try {
            return res.status(200).json({
                status: true,
                notifications: await Notification.find(),
                message: "Se han encontrado notificaciones",
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

notificationMethods.completeNotification = async (req, res) => {
    const permission = ac.can(req.user.rol.name).deleteAny("notification")
        .granted;
    if (permission) {
        try {
            const { notificationID } = req.body;
            if (notificationID) {
                const notification = await Notification.findById(
                    notificationID
                );
                if (notification) {
                    if (notification.remove()) {
                        return res.status(200).json({
                            status: true,
                            message:
                                "La notificación ha sido completada correctamente.",
                        });
                    } else {
                        return res.status(400).json({
                            status: false,
                            message:
                                "Ha ocurrido un error, por favor intentalo nuevamente.",
                        });
                    }
                } else {
                    return res.status(404).json({
                        status: false,
                        message: "No se ha encontrado el recurso solicitado.",
                    });
                }
            } else {
                return res.status(200).json({
                    status: false,
                    message: "El ID de la notificación es requerido.",
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
            message: "No tienes permisos para acceder a este recurso.",
        });
    }
};

module.exports = notificationMethods;
