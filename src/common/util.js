function randomInt(max) {
    return Math.floor(Math.random() * max);
}

function randomItemFrom(arr) {
    let index = randomInt(arr.length);
    return arr[index];
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function validateUsername(name) {
    name = name.trim();
    const minChars = 1;
    const maxChars = 20;
    let regex = new RegExp(`^[0-9a-zA-Z ]{${minChars},${maxChars}}$`);
    return name.match(regex);
}

function capitalise(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

module.exports = {
    randomInt,
    randomItemFrom,
    shuffle,
    validateUsername,
    capitalise
};