let userScore = 0;
let computerScore = 0;
let gameHistory = []; // Array to store player's past moves and results

const userScore_span = document.getElementById('userScore');
const computerScore_span = document.getElementById('computerScore');
const resultText_p = document.getElementById('resultText');

const choices = ['rock', 'paper', 'scissors'];

document.querySelectorAll('.choice-btn').forEach(button => {
    button.addEventListener('click', function() {
        const userChoice = this.id;
        const computerChoice = choices[Math.floor(Math.random() * choices.length)];
        const result = determineWinner(userChoice, computerChoice);
        
        // Log the player's choice, computer's choice, and result into gameHistory
        gameHistory.push({userChoice, computerChoice, result});
        console.log(gameHistory); // You can check this in your console
    });
});
function determineWinner(userChoice, computerChoice) {
    let result;  // Track the result (win, lose, draw)
    
    if (userChoice === computerChoice) {
        resultText_p.innerHTML = `It's a draw! You both chose ${userChoice}.`;
        resultText_p.className = 'result-draw';
        result = 'draw';
    } else if (
        (userChoice === 'rock' && computerChoice === 'scissors') ||
        (userChoice === 'paper' && computerChoice === 'rock') ||
        (userChoice === 'scissors' && computerChoice === 'paper')
    ) {
        userScore++;
        resultText_p.innerHTML = `You win! ${userChoice} beats ${computerChoice}.`;
        resultText_p.className = 'result-win';
        result = 'win';
    } else {
        computerScore++;
        resultText_p.innerHTML = `You lose! ${computerChoice} beats ${userChoice}.`;
        resultText_p.className = 'result-lose';
        result = 'lose';
    }

    // Update the scores on the screen
    updateScore();
    
    return result;
}

function updateScore() {
    userScore_span.textContent = userScore;  // Update user score in the HTML
    computerScore_span.textContent = computerScore;  // Update computer score in the HTML
}

function getPrediction(userChoice) {
    fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ player_move: userChoice })
    })
    .then(response => response.json())
    .then(data => {
        const computerChoice = data.predicted_move;  // This should be correct
        determineWinner(userChoice, computerChoice);  // Call the determineWinner function
    })
    
    .catch(error => {
        console.error('Error:', error);
    });
}

