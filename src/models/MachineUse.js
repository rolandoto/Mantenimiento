const { Schema, model, Types } = require("mongoose");

const machineUseSchema = new Schema({
    user: {
        type: Types.ObjectId,
        ref: "Machine",
    },
    hours: {
        type: Number,
        required: true,
    },
    note: {
        type: String,
        required: true,
    },
    create_at: {
        type: Date,
        default: new Date(),
    },
});

module.exports = model("MachineUse", machineUseSchema);
