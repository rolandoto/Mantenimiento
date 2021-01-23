const multer = require("multer");
const path = require("path");

function ramdomName(characters, _ext) {
    const posibleChars =
        "1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let filename = "";
    for (let i = 0; i < characters; i++) {
        const ramdomCharacter = Math.floor(Math.random() * (characters - 0));
        filename += posibleChars[ramdomCharacter];
    }

    return filename + _ext;
}

const upload = (dest) => {
    const options = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, __dirname + "/../../public/img/" + dest);
        },
        filename: function (req, file, cb) {
            cb(null, ramdomName(40, path.extname(file.originalname)));
        },
    });

    return multer({
        storage: options,
    });
};

module.exports = upload;
