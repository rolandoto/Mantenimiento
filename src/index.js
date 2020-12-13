require("dotenv").config();
const app = require("./app");
require("./database");

async function init() {
    await app.listen(process.env.PORT || 4000);
    console.log("App running on port: ", process.env.PORT);
}

init();

module.exports = app;
