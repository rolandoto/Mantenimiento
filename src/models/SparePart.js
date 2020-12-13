const { Schema, model } = require("mongoose");

const sparePartSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    create_at: {
        type: Date,
        default: new Date(),
    },
});

module.exports = model("SparePart", sparePartSchema);
