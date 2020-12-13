const { Schema, model } = require("mongoose");

const environmentSchema = new Schema({
    environmentCode: {
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

module.exports = model("Environment", environmentSchema);
