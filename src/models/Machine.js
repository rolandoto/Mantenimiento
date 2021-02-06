const { Schema, model, Types } = require("mongoose");
const { maintenanceStatus } = require("../config/config");

const machineSchema = new Schema({
    status: {
        type: String,
        default: Object.keys(maintenanceStatus).find(
            (key) => maintenanceStatus[key] === maintenanceStatus.active
        ),
    },
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
    totalHoursRegisted: {
        type: Number,
        default: 0,
    },
    totalHoursWorking: {
        type: Number,
        default: 0,
    },
    totalHoursToMaintenance: {
        type: Number,
        default: 0,
    },
    spareParts: [
        {
            type: Object,
            field: '_id',
            ref: "SparePart",
        },
    ],
    machineUses: [
        {
            type: Types.ObjectId,
            ref: "MachineUse",
        },
    ],
    maintenances: [
        {
            type: Types.ObjectId,
            ref: "Maintenance",
        },
    ],
    create_at: {
        type: Date,
        default: new Date(),
    },
});

module.exports = model("Machine", machineSchema);
