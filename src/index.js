require("dotenv").config();
const app = require("./app");
require("./database");

const port  =process.env.PORT || 4000

async function init() {
    await app.listen(port);
    console.log("App running on port: ", process.env.PORT);
}

init();

module.exports = app;
