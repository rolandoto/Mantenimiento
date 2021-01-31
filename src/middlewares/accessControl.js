const AccessControl = require("accesscontrol");
const ac = new AccessControl();

ac.grant("user")
    .readAny("environment")
    .updateOwn("profile")
    .readAny("notification")
    .deleteAny("notification")
    .createAny("machineUse");

ac.grant("admin")
    .extend("user")
    .updateAny("environment")
    .createAny("environment")
    .deleteAny("environment");

ac.grant("admin")
    .readAny("rol")
    .deleteAny("rol")
    .updateAny("rol")
    .createAny("rol");

ac.grant("admin")
    .readOwn("machine")
    .readAny("machine")
    .deleteAny("machine")
    .updateAny("machine")
    .createAny("machine");

ac.grant("admin")
    .readOwn("maintenanceType")
    .readAny("maintenanceType")
    .deleteAny("maintenanceType")
    .updateAny("maintenanceType")
    .createAny("maintenanceType");

ac.grant("admin")
    .readOwn("maintenance")
    .readAny("maintenance")
    .deleteAny("maintenance")
    .updateAny("maintenance")
    .createAny("maintenance");

ac.grant("admin")
    .readOwn("sparePart")
    .readAny("sparePart")
    .deleteAny("sparePart")
    .updateAny("sparePart")
    .createAny("sparePart");

module.exports = ac;
