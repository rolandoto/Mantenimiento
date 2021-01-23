var users = [];

function removeUser(_id) {
    return users.filter((user) => {
        return user._id != _id;
    });
}

function findUserByID(_id) {
    return users.find((u) => {
        return u._id == _id;
    });
}

const userConnection = ({ _id, _socketID }) => {
    const user = { _id, _socketID };
    user._socketID = [_socketID];

    const findUser = findUserByID(_id);

    if (!findUser) {
        users.push({ _id, _socketID: [_socketID] });
        return null;
    }

    findUser._socketID = [...findUser._socketID, ...user._socketID];
    users = removeUser(findUser._id);
    users.push(findUser);
};

const userDisconnect = ({ _id, _socketID }) => {
    const userFind = findUserByID(_id);

    if (!userFind) {
        return null;
    }

    users = removeUser(userFind._id);
    if (userFind._socketID.length > 1) {
        const newSockets = userFind._socketID.filter((socket) => {
            return socket != _socketID;
        });

        userFind._socketID = newSockets;

        users.push(userFind);
    }
};

exports.users = users;
exports.connect = userConnection;
exports.disconnect = userDisconnect;
