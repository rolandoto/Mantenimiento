const { Schema, model } = require("mongoose");

const notificationSchema = new Schema({
    message: {
        type: String,
        required: true,
    },
    create_at: {
        type: Date,
        default: new Date(),
    },
});

module.exports = model("Notification", notificationSchema);
