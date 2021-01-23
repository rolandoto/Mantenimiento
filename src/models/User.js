const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new Schema({
    rol: {
        type: Object,
        required: true
    },
    profileImage: Object,
    email: {
        type: String,
        required: true,
        unique: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
    },
    city: {
        type: String,
    },
    create_at: {
        type: Date,
        default: new Date(),
    },
});

userSchema.methods.verifyPassword = function (password) {
    return bcrypt.compare(password, this.password);
};

userSchema.methods.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
};

module.exports = model("User", userSchema);
