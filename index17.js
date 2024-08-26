const playerCount = document.getElementById("playerCount");
const dealerCount = document.getElementById("dealerCount");
const playerDrawedCards = document.getElementById("playerDrawedCards");
const dealerDrawedCards = document.getElementById("dealerDrawedCards");
const hitBtn = document.getElementById("hitBtn");
const standBtn = document.getElementById("standBtn");

const cardsObj = {
    '2': 2,
    '3': 3,
    '4': 4,
    '5': 5,
    '6': 6,
    '7': 7,
    '8': 8,
    '9': 9,
    '10': 10,
    'J': 10,
    'Q': 10,
    'K': 10,
    'A': 11
};

const cards = ["A", 2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K"];

fisherYates(cards);

function fisherYates(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const random = Math.floor(Math.random() * (i + 1));
        [array[i], array[random]] = [array[random], array[i]];
    }
}

const playerCards = [cards.shift(), cards.shift()];
const dealerCards = [cards.shift()];

let dealerStands = false;

function updatePlayerCount() {
    let convertedToNums = playerCards.map(card => cardsObj[card]);
    const sumOfCards = convertedToNums.reduce((accumulator, value) => accumulator + value, 0);
    playerCount.textContent = sumOfCards;
    if (sumOfCards > 21) {
        playerCount.textContent = "Busted, Dealer Wins";
        disableButtons();
    } else if (sumOfCards === 21) {
        playerCount.textContent = "Blackjack! You hit 21";
        disableButtons();
    }
}

function updateDealerCount() {
    let convertedToNums = dealerCards.map(card => cardsObj[card]);
    const sumOfCards = convertedToNums.reduce((accumulator, value) => accumulator + value, 0);
    dealerCount.textContent = sumOfCards;
    if (dealerCards.includes('A') && sumOfCards > 21) {
        dealerCount.textContent = sumOfCards - 10;
    }
}

function checkInitialGameState() {
    updatePlayerCount();

    const playerTotal = parseInt(playerCount.textContent);
    if (playerTotal > 21) {
        dealerCount.textContent = "Dealer Wins";
        disableButtons();
    }

    playerDrawedCards.textContent = `Cards: ` + playerCards.join(', ');
    dealerDrawedCards.textContent = `Cards: ` + dealerCards.join(', ') + ', [hidden]';
}

function revealDealerSecondCardWithDelay() {
    setTimeout(function() {
        revealDealerSecondCard();
    }, 500);
}

function revealDealerSecondCard() {
    const secondCard = cards.shift();
    dealerCards.push(secondCard);
    dealerDrawedCards.textContent = `Cards: ` + dealerCards.join(', ');
    updateDealerCount();

    if (parseInt(dealerCount.textContent) <= 21 && parseInt(dealerCount.textContent) <= parseInt(playerCount.textContent)) {
        setTimeout(dealerTurnWithDelay, 500);
    } else if (parseInt(dealerCount.textContent) > 21) {
        dealerCount.textContent = "Dealer Busted, Player Wins";
        disableButtons();
    } else if (parseInt(dealerCount.textContent) > parseInt(playerCount.textContent)) {
        dealerCount.textContent += " (Dealer Wins)";
        disableButtons();
    } else if (parseInt(dealerCount.textContent) === parseInt(playerCount.textContent)) {
        dealerCount.textContent += " (Push)";
        disableButtons();
    }
}

function dealerTurnWithDelay() {
    if (parseInt(dealerCount.textContent) <= 21 && parseInt(dealerCount.textContent) <= parseInt(playerCount.textContent)) {
        setTimeout(function() {
            dealerHitCards();

            if (parseInt(dealerCount.textContent) > 21) {
                dealerCount.textContent = "Dealer Busted, Player Wins";
                disableButtons();
            } else if (parseInt(dealerCount.textContent) > parseInt(playerCount.textContent)) {
                dealerCount.textContent += " (Dealer Wins)";
                dealerStands = true;
                disableButtons();
            } else {
                dealerTurnWithDelay();
            }
        }, 500);
    }
}

function playerHitCards() {
    if (dealerStands) return;

    if (cards.length === 0) return;

    let firstElement = cards.shift();
    playerCards.push(firstElement);
    playerDrawedCards.textContent = playerCards.join(', ');
    updatePlayerCount();
}

function dealerHitCards() {
    if (cards.length === 0) return;

    let firstElement = cards.shift();
    dealerCards.push(firstElement);
    dealerDrawedCards.textContent = dealerCards.join(', ');
    updateDealerCount();

    if (parseInt(dealerCount.textContent) > 21) {
        dealerCount.textContent = "Dealer Busted, Player Wins";
        disableButtons();
    }
}

hitBtn.addEventListener('click', function() {
    if (!dealerStands) {
        playerHitCards();
    }
});

standBtn.addEventListener('click', function() {
    if (!dealerStands) {
        revealDealerSecondCardWithDelay();
    }
});

function disableButtons() {
    hitBtn.disabled = true;
    standBtn.disabled = true;
}

checkInitialGameState();
