const Util = require('./util');

class User {
	constructor(socket, name) {
		if(!Util.validateUsername(name)) {
			return undefined;
		}
		this.socket = socket;
		this.name = name;
		this.gameRoom = undefined;
		this.team = undefined;
		this.captain = false;
	}

	setGameRoom(gameRoom) {
		this.gameRoom = gameRoom;
	}
	setTeam(team) {
		this.team = team;
	}
	setCaptain(captain) {
		this.captan = captain;
	}

	get connected() {
		return Boolean(this.socket && this.socket.connected);
	}
	get logName() {
		return `<${this.name}>`;
	}
}

module.exports = User;