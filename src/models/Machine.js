const { Schema, model } = require("mongoose");

const machineSchema = new Schema({
    environment: {
        type: String,
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
