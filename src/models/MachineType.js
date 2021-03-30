const { model, Schema } = require("mongoose");

const machineTypeSchema = new Schema({
    machine_type_name: {
        type: String,
        required: true,
    },
    create_at: {
        type: Date,
        default: new Date(),
    },
});

module.exports = model("MachineType", machineTypeSchema);
