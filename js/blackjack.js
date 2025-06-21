let deck = [];
let playerHand = [];
let dealerHand = [];
let gameOver = false;

export function startBlackjackGame() {
  deck = createDeck();
  shuffleDeck(deck);
  playerHand = [drawCard(), drawCard()];
  dealerHand = [drawCard(), drawCard()];
  gameOver = false;
  renderHands();
}

export function hit() {
  if (gameOver) return;
  playerHand.push(drawCard());
  const score = getScore(playerHand);
  renderHands();
  if (score > 21) endGame();
}

export function stand() {
  if (gameOver) return;
  while (getScore(dealerHand) < 17) {
    dealerHand.push(drawCard());
  }
  endGame();
}

function createDeck() {
  const suits = ['♠', '♥', '♦', '♣'];
  const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  const deck = [];
  for (const suit of suits) {
    for (const value of values) {
      deck.push({ suit, value });
    }
  }
  return deck;
}

function shuffleDeck(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

function drawCard() {
  return deck.pop();
}

function getScore(hand) {
  let score = 0;
  let aces = 0;
  for (const card of hand) {
    if (card.value === 'A') {
      score += 11;
      aces++;
    } else if (['J', 'Q', 'K'].includes(card.value)) {
      score += 10;
    } else {
      score += parseInt(card.value);
    }
  }
  while (score > 21 && aces > 0) {
    score -= 10;
    aces--;
  }
  return score;
}

function renderHands(showDealer = false) {
  const playerDiv = document.getElementById('player-hand');
  const dealerDiv = document.getElementById('dealer-hand');
  const playerScore = document.getElementById('player-score');
  const dealerScore = document.getElementById('dealer-score');
  const result = document.getElementById('blackjack-result');

  playerDiv.innerHTML = playerHand.map(c => `${c.value}${c.suit}`).join(' ');
  dealerDiv.innerHTML = showDealer
    ? dealerHand.map(c => `${c.value}${c.suit}`).join(' ')
    : `${dealerHand[0].value}${dealerHand[0].suit} 🂠`;

  playerScore.textContent = `Score: ${getScore(playerHand)}`;
  dealerScore.textContent = showDealer ? `Score: ${getScore(dealerHand)}` : 'Score: ?';
  result.textContent = '';
}

function endGame() {
  gameOver = true;
  const playerScore = getScore(playerHand);
  const dealerScore = getScore(dealerHand);
  renderHands(true);

  const result = document.getElementById('blackjack-result');
  if (playerScore > 21) {
    result.textContent = "You busted! Dealer wins.";
  } else if (dealerScore > 21 || playerScore > dealerScore) {
    result.textContent = "You win!";
  } else if (playerScore < dealerScore) {
    result.textContent = "Dealer wins!";
  } else {
    result.textContent = "It's a tie!";
  }
}