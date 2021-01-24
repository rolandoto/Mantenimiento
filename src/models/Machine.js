const { Schema, model } = require("mongoose");

const machineSchema = new Schema({
    environmentID: {
        type: String,
        required: true,
    },
    machineCode: {
        type: String,
        required: true,
    },
    machinePhoto: {
        type: Object,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    totalHoursWorking: {
        type: Number,
        default: 0,
    },
    totalHoursToMaintenance: {
        type: Number,
        default: 0,
    },
    spareParts: [Object],
    notes: [Object],
    maintenances: [Object],
    machineUsers: [Object],
    create_at: {
        type: Date,
        default: new Date(),
    },
});

module.exports = model("Machine", machineSchema);
