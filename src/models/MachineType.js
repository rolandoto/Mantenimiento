import { model, Schema } from "mongoose";

const machineTypeSchema = new Schema({
    machine_type_name: {
        type: string,
        required: true,
    },
    create_at: {
        type: Date,
        default: new Date(),
    },
});

module.exports = model("MachineType", machineTypeSchema);
