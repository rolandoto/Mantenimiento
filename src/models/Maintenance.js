const { Schema, model, Types } = require("mongoose");

const maintenanceSchema = new Schema({
    maintenanceType: {
        type: Types.ObjectId,
        ref: "MaintenanceType",
    },
    machine: {
        type: Types.ObjectId,
        ref: "Machine",
    },
    complete: {
        type: Boolean,
        default: false,
    },
    complete_at: Date,
    create_at: {
        type: Date,
        default: new Date(),
    },
});

module.exports = model("Maintenance", maintenanceSchema);
