const { Schema, model } = require("mongoose");

const sparePartSchema = new Schema({
    sparePartPhoto: {
        type: String,
        required: true,
    },
    sparePartCode: {
        type: String,
        required: true,
    },
    machines: [Object],
    price: {
        type: Number,
        default: 0,
        required: true,
    },
    stock: {
        type: Number,
        default: 0,
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

module.exports = model("SparePart", sparePartSchema);
