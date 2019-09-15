<template>
	<div id="in-game" class="view">
		<div class="view-container">
			<div class="stripe flex-center">
				<div id="game-info" class="stripe-content align-center">
					<p>Choose five cards you like the look of</p>
					<p>(don't tell anyone)</p>
				</div>
			</div>
			<div class="stripe flex-center" id="ten-cards">
				<card
					v-for="card in playerCards"
					class="card-small"
					:class="{highlight:selected.includes(card)}"
					@select="select(card)"
					v-bind:key="card.name"
					v-bind:name="card.name"
					v-bind:description="card.description"
					v-bind:category="card.category"
					v-bind:points="card.points"
				/>
			</div>
			<div class="stripe flex-center">
				<div class="form-actions">
					<button type="submit" id="submit-cards-btn" class="btn primary" :disabled="selected.length < 5" @click="submit">Submit</button>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
const Store = require('./state');
const VIEW = require('./view');
const GAME_PHASE = require('../../common/game-phase');
const CONNECTION_STATE = require('./connection-state');
import Card from './card';
import ConnectionOverlay from './connection-overlay';

export default {
	name: 'GameView',
	components: {
		ConnectionOverlay,
		Card
	},
	props: {
		gameConnection: {
			type: String,
			required: true,
		},
		gameState: {
			type: Object,
			required: true,
		},
	},
	data() {
		return {
			selected: []
		}
	},
	computed: {
		actionsEnabled() {
			return (
				this.gameConnection === CONNECTION_STATE.CONNECT
			);
		},
		playerCards() {
			let idx = this.gameState.users.findIndex(user => user.name === Store.state.username);
			return this.gameState.cards.slice(idx * 10, idx * 10 + 10);
		}
	},
	methods: {
		select(card) {
			if (this.selected.includes(card)) {
				this.selected.splice(this.selected.indexOf(card), 1)
			} else {
				if (this.selected.length < 5) {
					this.selected.push(card);
				}
			}
		},
		reset() {
			console.log('reset');
		},
		submit() {
			Store.submitCards(this.selected);
		}
	},
};
</script>
