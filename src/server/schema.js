const MESSAGE = require('../common/message');
const ajv = new(require('ajv'))();

const usernameMinLength = 1;
const usernameMaxLength = 20;
const SCHEMA = {};

SCHEMA[MESSAGE.CREATE_ROOM] = {
    $id: MESSAGE.CREATE_ROOM,
    properties: {
        username: {
            type: 'string',
            minLength: usernameMinLength,
            maxLength: usernameMaxLength
        },
    },
    required: ['username'],
};

SCHEMA[MESSAGE.JOIN_ROOM] = {
    $id: MESSAGE.JOIN_ROOM,
    properties: {
        username: {
            type: 'string',
            minLength: usernameMinLength,
            maxLength: usernameMaxLength
        },
        roomCode: {
            type: ['string', 'number'],
            minLength: 1
        },
        rejoin: {
            type: 'boolean'
        }
    },
    required: ['username', 'roomCode']
};

SCHEMA[MESSAGE.LEAVE_ROOM] = {
    $id: MESSAGE.LEAVE_ROOM,
    properties: {},
    required: []
};

for (let schema of Object.values(SCHEMA)) {
    ajv.addSchema(schema, schema.$id);
}
console.log('Message schemas loaded');

function validateMessageFromClient(messageName, json) {
    if (!SCHEMA[messageName]) {
        return true;
    }
    let res = ajv.validate(messageName, json);
    if (!res) {
        console.warn(ajv.errorsText());
        return undefined;
    }
    return res;
}

module.exports = {
    validateMessageFromClient
};