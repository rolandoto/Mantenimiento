const AccessControl = require("accesscontrol");
const ac = new AccessControl();

ac.grant("user").readAny("environment");

ac.grant("admin")
    .extend("user")
    .readAny("rol")
    .updateAny("environment")
    .createAny("environment")
    .deleteAny("environment")
    .deleteAny("rol")
    .updateAny("rol")
    .createAny("rol")
    .deleteAny("rol");

module.exports = ac;
