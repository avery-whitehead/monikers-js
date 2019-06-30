const MESSAGE = require('../../common/message');
const socket = io();
const VIEW = require('./view');
const ClientGame = require('../../common/cli-game');
const Util = require('../../common/util');
const GAME_PHASE = require('../../common/game-phase');
const CONNECTION_STATE = require('./connection-state');


const Store = {
    // The starting state
    state: {
        username: '',
        view: VIEW.HOME,
        previousView: VIEW.HOME,
        gameState: undefined,
        createWarning: undefined,
        joinWarning: undefined,
        gameConnection: CONNECTION_STATE.DISCONNECT
    },
    setUsername(username) {
        this.state.username = username;
    },
    setView(view) {
        this.state.previousView = this.state.view;
        this.state.view = view;
    },
    setGameState(newGameState) {
        if (newGameState === undefined) {
            this.state.gameState = undefined;
            this.setGameConnection(CONNECTION_STATE.DISCONNECT);
            this.setView(VIEW.HOME);
            return;
        }
        this.setGameConnection(CONNECTION_STATE.CONNECT);
        if (this.state.gameState === undefined) {
            this.state.gameState = ClientGame.generateClientGameState();
        }
        this.state.gameState.adoptJson(newGameState);
        if (this.state.gameState.phase === GAME_PHASE.SETUP) {
            this.setView(VIEW.SETUP);
        }
    },
    setGameConnection(cs) {
        this.state.gameConnection = cs;
    },
    setWarning(warningName, message) {
        this.state[warningName] = message;
    },
    submitCreateGame,
    submitJoinGame,
    submitLeaveGame
};

function handleSocket(messageName, handler, errHandler) {
    socket.on(messageName, function(data) {
        if (data.err) {
            console.warn(data.err);
            if (errHandler) {
                errHandler(data.err)
            }
            return;
        }
        if (handler) {
            handler(data);
        }
        if (data.roomState !== undefined) {
            Store.setGameState(data.roomState);
        }
    });
}

handleSocket(MESSAGE.CREATE_ROOM,
    function(data) {
        Store.setUsername(data.username);
    },
    function(errMsg) {
        Store.setWarning('createWarning', errMsg);
    }
);

handleSocket(MESSAGE.JOIN_ROOM,
    function(data) {
        if (data.username !== Store.state.username) {
            return;
        }
        Store.setWarning('joinWarning', undefined);
        if (data.rejoin === true) {
            console.log('Game reconnect success');
        }
    },
    function(errMsg) {
        Store.setWarning('joinWarning', errMsg);
    }
); 

handleSocket(MESSAGE.LEAVE_ROOM);
handleSocket(MESSAGE.USER_LEFT);

const usernameWarning = 'Username must be 1-20 characters long and only contain alphanumerics or spaces';

function submitCreateGame(username) {
    username = username.trim();
    if (Util.validateUsername(username)) {
        this.setWarning('createWarning', undefined);
        socket.emit(MESSAGE.CREATE_ROOM, {
            username: username
        });
        return true;
    } else {
        this.setWarning('createWarning', usernameWarning);
        return false;
    }
}

function submitJoinGame(roomCode, username) {
    username = username.trim();
    if (Util.validateUsername(username)) {
        this.setWarning('joinWarning', undefined);
        socket.emit(MESSAGE.JOIN_ROOM, {
            roomCode: roomCode,
            username: username
        });
        return true;
    } else {
        this.setWarning('joinWarning', usernameWarning);
        return false;
    }
}

function submitLeaveGame() {
    socket.emit(MESSAGE.LEAVE_ROOM, {});
}

socket.on('disconnect', function() {
    Store.state.gameConnection = CONNECTION_STATE.DISCONNECT;
    let existingGameState = Store.state.gameState;
    if (existingGameState) {
        switch (existingGameState.phase) {
            case GAME_PHASE.SETUP:
                Store.setGameState(undefined);
                break;
            default:
                console.warn('Bad gamestate');
                break;
        }
    }
});

socket.on('connect', reconnectToGame);
socket.on('reconnect', reconnectToGame);

function reconnectToGame() {
    let existingGameState = Store.state.gameState;
    let username = Store.state.username;
    if (existingGameState && username && Store.state.gameConnection === CONNECTION_STATE.DISCONNECT) {
        Store.state.gameConnection = CONNECTION_STATE.RECONNECT;
        console.log('Attempting game rejoin');
        socket.emit(MESSAGE.JOIN_ROOM, {
            roomCode: existingGameState.roomCode,
            username: username,
            rejoin: true
        });
    }
}

window.dbg = {
    dcon() {
        socket.disconnect();
    },
    recon() {
        reconnectToGame();
    },
    con() {
        socket.connect();
    }
};

module.exports = Store;