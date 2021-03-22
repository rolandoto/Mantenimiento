const { Schema, model } = require("mongoose");

const environmentSchema = new Schema({
    environmentPhoto: {
        type: Object,
        required: true,
    },
    environmentCode: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    in_charge: String,
    create_at: {
        type: Date,
        default: new Date(),
    },
});

module.exports = model("Environment", environmentSchema);
