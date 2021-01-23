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
    create_at: {
        type: Date,
        default: new Date(),
    },
});

module.exports = model("Machine", machineSchema);
