const Store = require('./state');

import Vue from 'vue';
import HomeMenu from './home-menu.vue';
import SetupView from './setup-view.vue';

const app = new Vue({
    el: '#wrapper',
    components: {
        HomeMenu,
        SetupView
    },
    data: {
        state: Store.state
    },
    computed: {
        roomCode() {
            return this.state.gameState && this.state.gameState.roomCode;
        },
        usernames() {
            return this.state.gameState && this.state.gameState.getUsernames();
        }
    }
});