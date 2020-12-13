const { Schema, model } = require("mongoose");

const maintenaceSchema = new Schema({
    maintenaceType: {
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

module.exports = model("Maintenace", maintenaceSchema);
