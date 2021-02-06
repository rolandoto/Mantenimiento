const { Schema, model, Types } = require("mongoose");

const sparePartSchema = new Schema({
    sparePartPhoto: {
        type: Object,
        required: true,
    },
    sparePartCode: {
        type: String,
        required: true,
    },
    machines: [
        {
            type: Object,
            ref: "Machine",
            field: "_id"
        },
    ],
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
