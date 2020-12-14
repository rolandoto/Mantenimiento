const AccessControl = require("accesscontrol");
const ac = new AccessControl();

ac.grant("user").readAny("environment");

ac.grant("admin")
    .extend("user")
    
    .updateAny("environment")
    .createAny("environment")
    .deleteAny("environment")
    .readAny("rol")
    .deleteAny("rol")
    .updateAny("rol")
    .createAny("rol")

module.exports = ac;
