function generateClientGameState() {
    return {
        roomCode: undefined,
        users: [],

        getUsernames() {
            return this.users.map(u => u.name);
        },

        adoptJson(json) {
            return Object.assign(this, json);
        },

        findUser(username) {
            return this.users.find(u => u.name === username);
        }
    };
}

module.exports = {
    generateClientGameState
};