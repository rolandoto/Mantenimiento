const { Schema, model } = require("mongoose");

const maintenanceTypeSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    create_at: {
        type: Date,
        default: new Date(),
    },
});

module.exports = model("MaintenanceType", maintenanceTypeSchema);
