const { Schema, model, Types } = require("mongoose");

const maintenanceSchema = new Schema({
    maintenanceType: {
        type: Types.ObjectId,
        ref: "MaintenanceType",
    },
    complete: {
        type: Boolean,
        default: false,
    },
    name: {
        type: String,
        required: true
    },
    check_list: Array,
    complete_at: Date,
    create_at: {
        type: Date,
        default: new Date(),
    },
});

module.exports = model("Maintenance", maintenanceSchema);
