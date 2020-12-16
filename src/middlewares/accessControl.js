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
    .readOwn("machine")
    .readAny("machine")
    .deleteAny("machine")
    .updateAny("machine")
    .createAny("machine")
    .readOwn("maintenance")
    .readAny("maintenance")
    .deleteAny("maintenance")
    .updateAny("maintenance")
    .createAny("maintenance")
    .readOwn("sparePart")
    .readAny("sparePart")
    .deleteAny("sparePart")
    .updateAny("sparePart")
    .createAny("sparePart")

module.exports = ac;
