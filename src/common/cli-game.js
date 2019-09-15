const COLOR = require('./color');

function generateClientGameState() {
	return {
		roomCode: undefined,
		users: [],
		reds: [],
		blues: [],
		round: undefined,
		phase: undefined,
		turn: undefined,
		whoseTurn: undefined,
		keyword: undefined,
		hint: undefined,
		fakerName: undefined,
		cards: [],
		selectedCards: [],
		redCards: [],
		blueCards: [],
		strokes: [],

		getUsernames() {
			return this.users.map(u => u.name);
		},
		getNoTeam() {
			return this.users
				.filter(u => u.team === undefined)
				.map(u => u.name);
		},
		getReds() {
			return this.users
				.filter(u => u.team === 'red')
				.map(u => u.name);
		},
		getBlues() {
			return this.users
				.filter(u => u.team === 'blue')
				.map(u => u.name);
		},
		getSelectedCards() {
			return this.selectedCards;
		},
		adoptJson(json) {
			return Object.assign(this, json);
		},
		getUserColor(username) {
			let userIdx = _.findIndex(this.getUsernames(), (u) => (u === username)); // needs es6 polyfill
			return userIdx >= 0 ? COLOR.HEX[COLOR.ORDER[userIdx]] || 'var(--grey6)' : 'var(--grey6)';
		},
		getUserTeam(username) {
			if (this.reds.includes(username)) {
				return 'red';
			} else if (this.blues.includes(username)) {
				return 'blue';
			}
			return undefined;
		},
		getMostRecentStroke() {
			return this.strokes[this.strokes.length - 1];
		},
		findUser(username) {
			return this.users.find(u => u.name === username);
		},
	};
}

module.exports = { generateClientGameState };