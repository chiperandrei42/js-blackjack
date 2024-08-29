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

const cards = ["A", "A", "A", "A",
    2, 2, 2, 2,
    3, 3, 3, 3,
    4, 4, 4, 4,
    5, 5, 5, 5,
    6, 6, 6, 6,
    7, 7, 7, 7,
    8, 8, 8, 8,
    9, 9, 9, 9,
    10, 10, 10, 10,
    "J", "J", "J", "J",
    "Q", "Q", "Q", "Q",
    "K", "K", "K", "K"];

fisherYates(cards);

function fisherYates(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const random = Math.floor(Math.random() * (i + 1));
        [array[i], array[random]] = [array[random], array[i]];
    }
}

console.log(cards);

const playerCards = [cards.shift(), cards.shift()];
const dealerCards = [cards.shift()];

let dealerStands = false;

function aceHandling(sum, cards) {
    let aceCount = cards.filter(card => card === 'A').length;
    while (sum > 21 && aceCount > 0) {
        sum -= 10;
        aceCount--;
    }
    return sum;
}

function calculateSum(cards) {
    let convertedToNums = cards.map(card => cardsObj[card]);
    let sumOfCards = convertedToNums.reduce((accumulator, value) => accumulator + value, 0);
    return aceHandling(sumOfCards, cards);
}

function updatePlayerCount() {
    let sumOfCards = calculateSum(playerCards);
    playerCount.textContent = sumOfCards;
    
    if (sumOfCards === 21) {
        playerCount.textContent = "Blackjack! You hit 21";
        disableButtons();
    }
}

function updateDealerCount() {
    let sumOfCards = calculateSum(dealerCards);
    dealerCount.textContent = sumOfCards;
}

function checkInitialGameState() {
    updatePlayerCount();

    const playerTotal = parseInt(playerCount.textContent, 10);
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

    const dealerTotal = parseInt(dealerCount.textContent, 10);
    const playerTotal = parseInt(playerCount.textContent, 10);

    if (dealerTotal <= 21 && dealerTotal <= playerTotal) {
        setTimeout(dealerTurnWithDelay, 500);
    } else {
        determineOutcome(dealerTotal, playerTotal);
    }
}

function dealerTurnWithDelay() {
    const dealerTotal = parseInt(dealerCount.textContent, 10);
    const playerTotal = parseInt(playerCount.textContent, 10);

    if (dealerTotal < 17) {
        setTimeout(() => {
            dealerHitCards();
            dealerTurnWithDelay();
        }, 500);
    } else {
        determineOutcome(dealerTotal, playerTotal);
    }
}

function determineOutcome(dealerTotal, playerTotal) {
    if (dealerTotal > 21) {
        dealerCount.textContent = "Dealer Busted, Player Wins";
    } else if (dealerTotal > playerTotal) {
        dealerCount.textContent = `Dealer Wins (${dealerTotal})`;
    } else if (dealerTotal < playerTotal) {
        dealerCount.textContent = `Player Wins (${dealerTotal})`;
    } else if (dealerTotal === playerTotal) {
        dealerCount.textContent = "Push";
    }
    disableButtons();
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
}

hitBtn.addEventListener('click', function() {
    if (!dealerStands) {
        playerHitCards();
    }
});

standBtn.addEventListener('click', function() {
    if (!dealerStands) {
        revealDealerSecondCardWithDelay();
        dealerStands = true;
    }
});

function disableButtons() {
    hitBtn.disabled = true;
    standBtn.disabled = true;
}

checkInitialGameState();
