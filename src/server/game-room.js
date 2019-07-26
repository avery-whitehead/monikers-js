const Stroke = require('../common/stroke');
const GAME_PHASE = require('../common/game-phase');
const Util = require('../common/util');
const Prompts = require('./prompts');
const _ = require('lodash');
const GameError = require('./game-error');

const MAX_USERS = 10;

class GameRoom {
	constructor(roomCode, host) {
		this.roomCode = roomCode;
		this.users = [];
		this.reds = [];
		this.blues = [];
		this.host = host;

		this.round = 0;
		this.phase = GAME_PHASE.SETUP;

		this.turn = -1;
		this.keyword = undefined;
		this.hint = undefined;
		this.faker = undefined;

		this.strokes = [];
	}
	addUser(user, isHost = false) {
		if(this.isFull()) {
			console.warn('Full room');
			return false;
		}
		this.users.push(user);
		if(isHost) {
			this.host = user;
		}
		return true;
	}
	readdUser(user) {
		let userTargetIdx = this.users.findIndex((u) => (u.name === user.name));
		if(userTargetIdx !== -1) {
			this.users[userTargetIdx] = user;
		} else {
			throw new GameError(`Could not readd ${user.logName}. Existing user target DNE.`, 'Could not rejoin');
		}
	}
	addTeam(user, team) {
		if (team === 'red') {
			// If user doesn't already exist in a team
			if (!(this.reds.find((u) => (u.name === user.name)))) {
				this.reds.push(user);
				// If user exists in another team
				if (this.blues.find((u) => (u.name === user.name))) {
					let idx = this.blues.indexOf(user);
					// Remove user from old team
					this.blues.splice(idx, 1);
				}
				return this.reds.length;
			}
		} else if (team === 'blue') {
			if (!this.blues.find((u) => (u.name === user.name))) {
				this.blues.push(user);
				if (this.reds.find((u) => (u.name === user.name))) {
					let idx = this.reds.indexOf(user);
					this.reds.splice(idx, 1);
				}
				return this.blues.length;
			}
		}
		return false;
	}
	dropUser(user) {
		let uIdx = this.users.indexOf(user);
		this.users.splice(uIdx, 1);
		let rIdx = this.reds.indexOf(user);
		this.reds.splice(rIdx, 1);
		let bIdx = this.blues.indexOf(user);
		this.blues.splice(bIdx, 1);
		return this.users.length;
	}
	findUser(name) {
		return this.users.find((p) => (p.name === name));
	}
	startNewRound() {
		this.round++;
		this.shuffleUsers();
		this.phase = GAME_PHASE.PLAY;
		this.turn = 1;
		let prompt = Prompts.getRandomPrompt(); // TODO ensure no duplicate prompt
		this.keyword = prompt.keyword;
		this.hint = prompt.hint;
		this.faker = Util.randomItemFrom(this.users);
		this.strokes = [];
		console.log(`New round: Room-${this.roomCode} start round ${this.round}`);
	}
	invokeSetup() {
		console.log(`Force setup: Room-${this.roomCode}`);
		this.phase = GAME_PHASE.SETUP;
		// Reset game state
		this.turn = -1;
		this.keyword = undefined;
		this.hint = undefined;
		this.faker = undefined;
		this.users = this.users.filter(u => u.connected); // If anyone disconnected during the game, forget about them during setup
	}
	whoseTurn() {
		if(this.phase === GAME_PHASE.PLAY) {
			let idx = ((this.turn - 1) % this.users.length);
			return this.users[idx];
		}
		return undefined;
	}
	shuffleUsers() {
		Util.shuffle(this.users);
	}
	addStroke(username, points) {
		this.strokes.push(new Stroke(username, points));
		return this.strokes;
	}
	nextTurn() {
		if(this.gameInProgress()) {
			this.turn++;
			if(this.turn - 1 >= this.users.length * 2) {
				this.phase = GAME_PHASE.VOTE;
			}
			return this.turn;
		}
		return undefined;
	}
	gameInProgress() {
		return this.phase === GAME_PHASE.PLAY || this.phase === GAME_PHASE.VOTE;
	}
	isFull() {
		return this.users.length >= MAX_USERS;
	}
	isDead() {
		// all users are disconnected
		return this.users.length === 0 || _.every(this.users, u => (!u.connected));
	}
}

const ClientAdapter = {
	generateStateJson(gameRoom, pickFields) {
		let res = {
			roomCode: gameRoom.roomCode,
			users: _.map(gameRoom.users, (u) => ({name: u.name, connected: u.connected, team: u.team})),
			reds: _.map(gameRoom.reds, (u) => ({name: u.name, connected: u.connected, team: u.team})),
			blues: _.map(gameRoom.blues, (u) => ({name: u.name, connected: u.connected, team: u.team})),
			round: gameRoom.round,
			phase: gameRoom.phase,
			turn: gameRoom.turn,
			whoseTurn: gameRoom.whoseTurn() ? gameRoom.whoseTurn().name : null, // null, so the empty value still gets passed to the client
			keyword: gameRoom.keyword,
			hint: gameRoom.hint,
			fakerName: gameRoom.faker ? gameRoom.faker.name : undefined,
			strokes: gameRoom.strokes,
		};
		if(pickFields) {
			res = _.pick(res, pickFields);
		}
		return res;
	},
	hideKeyword(stateJson) {
		let res = _.cloneDeep(stateJson);
		res.keyword = '???';
		return res;
	},
	hideFaker(stateJson) {
		let res = _.cloneDeep(stateJson);
		res.fakerName = undefined;
		return res;
	},
};

module.exports = {
	GameRoom, ClientAdapter,
};