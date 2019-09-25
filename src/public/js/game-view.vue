<template>
	<div id="in-game" class="view">
		<div id="select-card-menu" class="view-container" v-if="thisUser.cardsChosen === false">
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
					:class="{highlight:selected.some(c => c.name === card.name)}"
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
		<div id="waiting-menu" v-if="thisUser.cardsChosen === true && !allUsersSubmitted">
			<div class="stripe flex-center">
				<div class="stripe-content align-center">
					<p>Waiting for other players to select their cards</p>
					<p>(feel free to give them a nudge)</p>
					<ul class="users" style="font-weight: bold">
						<li v-for="ncUser in notChosenUsers" :key="'0' + ncUser">{{ncUser}}</li>
					</ul>
				</div>
			</div>
		</div>
		<div class="stripe flex-center" id="game-screen" v-if="allUsersSubmitted">
			<div class="stripe-content">
				<p>Red team - points</p>
				<ul>
					<li v-for="red in this.gameState.users.filter(u => u.team === 'red')" :key="'0' + red">{{red.name}}</li>
				</ul>
			</div>
			<div class="stripe stripe-content">
				<card
					class="stripe-content card"
					v-bind:key="this.gameState.selectedCards[cardIdx].name"
					v-bind:name="this.gameState.selectedCards[cardIdx].name"
					v-bind:description="this.gameState.selectedCards[cardIdx].description"
					v-bind:category="this.gameState.selectedCards[cardIdx].category"
					v-bind:points="this.gameState.selectedCards[cardIdx].points"
				/>
				<button type="submit" id="next-card-btn" class="btn primary" @click="cardIdx++">Next Card</button>
			</div>
			<div class="stripe-content">
				<p>Blue team - points</p>
				<ul>
					<li v-for="blue in this.gameState.users.filter(u => u.team === 'blue')" :key="'0' + blue">{{blue.name}}</li>
				</ul>
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
			selected: [],
			cardIdx: 0
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
		},
		thisUser() {
			return this.gameState.users.find(user => user.name === Store.state.username);
		},
		notChosenUsers() {
			return this.gameState.users
				.filter(user => user.cardsChosen === false)
				.map(user => user.name);
		},
		allUsersSubmitted() {
			return this.gameState.users
				.every(user => user.cardsChosen === true);
		}
	},
	methods: {
		select(card) {
			if (this.selected.some(c => c.name === card.name)) {
				this.selected = this.selected.filter(c => c.name !== card.name);
			} else {
				if (this.selected.length < 5) {
					this.selected.push(card);
				}
			}
		},
		submit() {
			Store.submitCards(this.selected);
		}
	}
};
</script>
