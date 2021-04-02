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
    machineUses: [
        {
            type: Types.ObjectId,
            ref: "MachineUse",
        },
    ],
    machineIssues: [
        {
            name: String,
            note: String,
            date: Date,
        },
    ],
    maintenances: [
        {
            check_list: Array,
            complete: {
                type: Boolean,
                default: false,
            },
            complete_at: {
                type: Date,
                default: null,
            },
            name: String,
            create_at: {
                type: Date,
                default: new Date(),
            },
            maintenanceType: {
                type: Types.ObjectId,
                ref: "MachineType",
            },
        },
    ],
    preconfiguredMaitenances: [
        {
            hours: Number,
            maintenance: {
                type: Types.ObjectId,
                ref: "Maintenance",
            },
        },
    ],
    model: String,
    adquisiton_year: String,
    security_rules: Array,
    enableSpareParts: [
        {
            type: Types.ObjectId,
            ref: "SparePart",
        },
    ],
    usedSpareParts: [
        {
            id: Types.ObjectId,
            price: Number,
            sparePartCode: String,
            name: String,
            sparePartPhoto: {},
            stockUsed: Number,
        },
    ],
    brand: String,
    stream: String,
    watts: String,
    voltage: String,
    create_at: {
        type: Date,
        default: new Date(),
    },
});

module.exports = model("Machine", machineSchema);
