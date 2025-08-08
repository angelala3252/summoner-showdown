from flask import Flask, request, jsonify
from flask_cors import CORS
from main import get_expected_win_rate, get_puuid, get_player_ranking

app = Flask(__name__)
CORS(app)

@app.route('/prediction', methods=['POST'])
def receive_teams():
    data = request.get_json()
    return jsonify(get_prediction(data)), 200

def get_prediction(data):
    team1 = data.get("team1")
    team2 = data.get("team2")
    if not team1 or not team2:
        return {"error": "Both teams must be provided."}, 400

    team1_puuid, team2_puuid = get_puuid(team1, team2)
    t1_expected_win, t2_expected_win = get_expected_win_rate(team1_puuid, team2_puuid)
    return {"team1": t1_expected_win, "team2": t2_expected_win}

if __name__ == '__main__':
    app.run(debug=True)