require("dotenv").config();
const mongoose = require("mongoose");
const db = mongoose.connection;
const uri = process.env.STATUS === "PROD" ? process.env.DATABASE_PROD : process.env.DATABASE_DEV;

function connect() {
    mongoose.connect(uri, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    db.on("open", (_) => {
        console.log("Database connect");
    });

    db.on("error", (error) => {
        console.log("Error: ", error);
    });
}

connect();
