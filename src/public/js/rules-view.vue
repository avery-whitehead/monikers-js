<template>
	<div id="rules" class="view">
		<div class="view-container">
			<div class="stripe flex-center">
				<div id="rules-content" class="stripe-content normal-text">
					<div class="align-justify">
						<p>Monikers is played in <strong>3 rounds</strong>. In each round, teams have <strong>60</strong> seconds to describe as many people or characters from a deck of cards, so that their team can guess who it is.</p> 
						<p>Each of the three rounds has a restriction on how clues can be given:</p>
						<p>ROUND 1: <strong>Use any words, sounds or gestures</strong>. You can't use the name on the card during your description, but you can use the clues written beneath the name.</p>
						<p>ROUND 2: <strong>Use only 1 word as a clue</strong>. You aren't allowed to use sounds, gestures or the name itself.</p>
						<p>ROUND 3: <strong>Use only charades</strong>. No words are allowed. Sound effects are allowed (within reason).</p>
						<p>There's no limit to the number of guesses, and <strong>cards can be skipped</strong> if a team can't guess who they are.</p>
						<p><strong>The teams keep the cards they guessed correctly</strong> to score after the round. Skipped cards are reshuffled into the deck.</p>
						<p><strong>The teams take it in turn giving clues</strong>, and each player in each team should take it in turn to give clues too.</p>
						<p><strong>Each of the 3 rounds ends when all the cards from the deck have been guessed correctly</strong>. After that, the teams add the point values from the cards they correctly guessed and <strong>shuffle the cards back together into one deck</strong> for the next round. The team with the lowest score starts the next round.</p>
						<p><strong>The team with the highest total score after 3 rounds wins</strong> (but it's not necessary to keep score at all).</p>
					</div>
				</div>
			</div>
			<div id="rules-cards" class="stripe flex-center">
				<div class="flex-center">
					<div id="rules-card" class="card">
						<div class="card-title align-cenetr">A Neanderthal</div>
						<div class="card-desc align-justify">A member of an extinct species closely related to humans. Research suggests that interbreeding between the two groups occured, with modern non-African humans possessing 1-4% of their genome. They made tools, built dwellings, and had a form of language.</div>
						<div class="card-sep">·············</div>
						<div class="card-type points-one-t">ET CETERA</div>
						<div class="card-points points-one-p"><p class="point-score">1</p>POINT</div>
					</div>
					<div id="rules-card" class="card">
						<div class="card-title align-cenetr">The Eye of Sauron</div>
						<div class="card-desc align-justify">A manifestation of the title character in J.R.R. Tolkien's fantasy series The Lord of the Rings. Frodo describes it as "rimmed with fire, but was itself glazed, yellow as a cat's, watchful and intent, and the black slit of its pupil opened on a pit, a window into nothing."</div>
						<div class="card-sep">·············</div>
						<div class="card-type points-two-t">FICTIONAL CHARACTER</div>
						<div class="card-points points-two-p"><p class="point-score">2</p>POINTS</div>
					</div>
					<div id="rules-card" class="card">
						<div class="card-title align-cenetr">Catherine the Great</div>
						<div class="card-desc align-justify">The "Empress and Autocrat of all the Russias", who led the country's Golden Age: an era of revitalization and recognition as a great power of Europe. She took many lovers during her reign, leading to legends about her sexual proclivities, including an erotic desire for horses.</div>
						<div class="card-sep">·············</div>
						<div class="card-type points-three-t">HISTORICAL FIGURE</div>
						<div class="card-points points-three-p"><p class="point-score">3</p>POINTS</div>
					</div>
				</div>
			</div>
			<div class="stripe flex-center">
				<div class="align-justify">
					<p>If you want to know more, you can <a href="https://buffalogames.com/product_images/uploaded_images/instructions/174-Monikers-Instructions_081816.pdf">read the full rules</a> or <a href="https://www.youtube.com/watch?v=bRvEzutZ-ok">watch Polygon play through the game.</a></p>
				</div>
			</div>
			<div class="stripe flex-center">
				<div class="align-center">
					<button class="btn tertiary" @click="back()">Back</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
const Store = require('./state');
const VIEW = require('./view');
export default {
	name: 'RulesView',
	methods: {
		back() {
			Store.setView(Store.state.previousView);
		}
	},
};
</script>
