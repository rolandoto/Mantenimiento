const { Schema, model, Types } = require("mongoose");
const { maintenanceStatus } = require("../config/config");

const machineSchema = new Schema({
    status: {
        type: String,
        default: Object.keys(maintenanceStatus).find(
            (key) => maintenanceStatus[key] === maintenanceStatus.active
        ),
    },
    machineType: {
        type: Types.ObjectId,
        ref: "MachineType",
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
            field: "_id",
            ref: "SparePart",
        },
    ],
    machineUses: [
        {
            type: Types.ObjectId,
            ref: "MachineUse",
        },
    ],
    machineAlerts: [
        {
            name: String,
            note: String,
            date: new Date(),
        }
    ],
    maintenances: [
        {
            type: Types.ObjectId,
            ref: "Maintenance",
        },
    ],
    preconfiguredMaitenances: [
        {
            hours: Number,
            type: Types.ObjectId,
            ref: "Maintenance"
        },
    ],
    model: String,
    adquisiton_year: String,
    security_rules: [
        {
            description: string,
        },
    ],
    enableSpareParts: [
        {
            type: Types.ObjectId,
            ref: "SparePart",
        },
    ],
    usedSpareParts: [
        {
            type: Types.ObjectId,
            ref: "SparePart",
            used: Number,
            date_used: new Date(),
        },
    ],
    power: String,
    stream: String,
    wats: String,
    voltage: String,
    create_at: {
        type: Date,
        default: new Date(),
    },
});

module.exports = model("Machine", machineSchema);
