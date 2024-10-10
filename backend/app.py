from flask import Flask, request, jsonify
import random

app = Flask(__name__)

# Sample transition matrix
transition_matrix = {
    'rock': {'rock': 1/3, 'paper': 1/3, 'scissors': 1/3},
    'paper': {'rock': 1/3, 'paper': 1/3, 'scissors': 1/3},
    'scissors': {'rock': 1/3, 'paper': 1/3, 'scissors': 1/3},
}

player_history = []

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    player_move = data['player_move']
    player_history.append(player_move)

    update_transition_matrix(player_move)
    
    predicted_move = predict_next_move()  # Get the computer's predicted move
    
    return jsonify({'predicted_move': predicted_move})  # Ensure proper response


def update_transition_matrix(player_move):
    if len(player_history) < 2:
        return

    last_move = player_history[-2]
    transition_matrix[last_move][player_move] += 0.1

    total = sum(transition_matrix[last_move].values())
    for move in transition_matrix[last_move]:
        transition_matrix[last_move][move] /= total

def predict_next_move():
    if len(player_history) == 0:
        return random.choice(['rock', 'paper', 'scissors'])

    last_move = player_history[-1]
    move_probabilities = transition_matrix[last_move]

    return max(move_probabilities, key=move_probabilities.get)

if __name__ == '__main__':
    app.run(debug=True)
