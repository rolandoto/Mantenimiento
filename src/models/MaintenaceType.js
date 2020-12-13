const { Schema, model } = require("mongoose");

const maintenaceTypeSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    create_at: {
        type: Date,
        default: new Date(),
    },
});

module.exports = model("MaintenaceType", maintenaceTypeSchema);
