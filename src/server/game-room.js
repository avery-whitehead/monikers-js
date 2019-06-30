const GAME_PHASE = require('../common/game-phase');
const _ = require('lodash');
const GameError = require('./game-error');

const MAX_USERS = 12;

class GameRoom {
    constructor(roomCode, host) {
        this.roomCode = roomCode;
        this.users = []
        this.host = host;
        this.phase = GAME_PHASE.SETUP;
    }

    addUser(user, isHost = false) {
        if (this.isFull()) {
            console.warn('Room full');
            return false;
        }
        this.users.push(user);
        if (isHost) {
            this.host = user;
        }
        return true;
    }

    readdUser(user) {
        let userTargetIndex = this.users.findIndex((u) => (u.name === user.name));
        if (user.targetIndex !== -1) {
            this.users[userTargetIndex] = user;
        } else {
            throw new GameError(`Could not re-add ${user.logName}`, 'Could not rejoin');
        }
    }

    dropUser(user) {
        let index = this.users.indexOf(user);
        this.users.splice(index, 1);
        return this.users.length;
    }

    findUser(name) {
        return this.users.find((p) => (p.name === name));
    }

    isFull() {
        return this.users.length >= MAX_USERS;
    }

    isDead() {
        return this.users.length === 0 || _.every(this.users, u => (!u.connected));
    }
}

const ClientAdapter = {
    generateStateJson(gameRoom, pickFields) {
        let res = {
            roomCode: gameRoom.roomCode,
            phase: gameRoom.phase,
            users: _.map(gameRoom.users, (u) => ({
                name: u.name,
                connected: u.connected
            }))
        };
        if (pickFields) {
            res = _.pick(res, pickFields);
        }
        return res;
    }
}

module.exports = {
    GameRoom,
    ClientAdapter
};