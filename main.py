import requests
import json

api_key = "RGAPI-f563aeff-cbe8-434a-a816-89801df6452b"
team1 = [
    {"gameName": "cant type", "tagLine": "1998"},
    {"gameName": "C9 Loki", "tagLine": "kr3"},
    {"gameName": "NAgurin", "tagLine": "EU1"},
    {"gameName": "Pentaless", "tagLine": "penta"},
    {"gameName": "Isles", "tagLine": "000"}
]
team2 = [
    {"gameName": "From Iron", "tagLine": "1123"},
    {"gameName": "Kumo9", "tagLine": "NA1"},
    {"gameName": "tree frog", "tagLine": "100"},
    {"gameName": "dusklol", "tagLine": "000"},
    {"gameName": "DARKWINGS", "tagLine": "NA3"}
]

# get puuid for each player in team1 and team2
def get_puuid(
    team1,
    team2
    ):
    team1_puuid = []
    team2_puuid = []
    
    for player in team1:
        puuid = fetch_something(
            f"https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/{player['gameName']}/{player['tagLine']}",
            headers={"X-Riot-Token": api_key}
        )["puuid"]
        team1_puuid.append(puuid)

    for player in team2:
        puuid = fetch_something(
            f"https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/{player['gameName']}/{player['tagLine']}",
            headers={"X-Riot-Token": api_key}
        )["puuid"]
        team2_puuid.append(puuid)

    return team1_puuid, team2_puuid


# def get_game_ids(
#     team1_puuid,
#     team2_puuid
#     ):
#     team1_game_ids = {}
#     team2_game_ids = {}
#     num_games = 10 # default number of historical games to fetch
    
#     for puuid in team1_puuid:
#         player_game_ids = fetch_something(
#             f"https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/{puuid}/ids?start=0&count={num_games}",
#             headers={"X-Riot-Token": api_key}
#         )
#         team1_game_ids[puuid] = player_game_ids

#     for puuid in team2_puuid:
#         player_game_ids = fetch_something(
#             f"https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/{puuid}/ids?start=0&count={num_games}",
#             headers={"X-Riot-Token": api_key}
#         )
#         team2_game_ids[puuid] = player_game_ids

#     return team1_game_ids, team2_game_ids


def get_player_info(puuid):
    player_info = {}
    fields = ["tier", "rank", "leaguePoints", "wins", "losses"]
    for field in fields:
        player_info[field] = fetch_something(f"https://na1.api.riotgames.com/lol/league/v4/entries/by-puuid/{puuid}",
            headers={"X-Riot-Token": api_key})[0][field]
    return player_info


def get_num_rank(
    tier, 
    rank,
    LP
    ):
    tier_values = {
        "IRON": 0,
        "BRONZE": 400,
        "SILVER": 800,
        "GOLD": 1200,
        "PLATINUM": 1600,
        "DIAMOND": 2000,
        "MASTER": 2400,
        "GRANDMASTER": 2600,
        "CHALLENGER": 3100
    }
    rank_values = {
        "IV": 0,
        "III": 100,
        "II": 200,
        "I": 300
    }
    rank_num = tier_values[tier] + rank_values[rank] + LP

    return rank_num


def get_player_ranking(puuid):
    num_games = 10
    player_info = get_player_info(puuid)

    prev_game_ids = fetch_something(
        f"https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/{puuid}/ids?start=0&count={num_games}",
        headers={"X-Riot-Token": api_key})
    
    intial_ranking = get_num_rank(player_info["tier"], player_info["rank"], player_info["leaguePoints"])
    rankings = [intial_ranking]
    
    for game in prev_game_ids:
        updated_ranking = update_ranking(puuid, rankings[-1], game)
        rankings.append(updated_ranking)

    # if no previous games??

    return rankings[-1]


# game info ->
    # kills
    # deaths
    # assists
    # totalDamageDealt
    # totalDamageTaken
    # trueDamageDealt
    # trueDamageTaken
    # win   

def update_ranking(
    puuid, 
    rank, 
    game_id):

    participants = fetch_something(
        f"https://americas.api.riotgames.com/lol/match/v5/matches/{game_id}",
        headers={"X-Riot-Token": api_key})["metadata"]["participants"]
    
    team_rankings = []
    for participant in participants:
        rank = get_num_rank(participant)
        team_rankings.append(rank)
    

    return 0


def get_expected_win_rate(
    team1_puuid, 
    team2_puuid
    ):
    team1_ranking = []
    team2_ranking = []

    for player in team1_puuid:
        team1_ranking.append(get_player_ranking(player))

    for player in team2_puuid:
        team2_ranking.append(get_player_ranking(player))

    team1_overall_ranking = sum(team1_ranking)
    team2_overall_ranking = sum(team2_ranking)

    t1_expected_win = 1 / (1 + 10 ** ((team2_overall_ranking - team1_overall_ranking) / 400))
    t2_expected_win = 1 - t1_expected_win

    return t1_expected_win, t2_expected_win


def fetch_something(url, params=None, data=None, headers=None, cookies=None, auth=None, timeout=None, allow_redirects=True):
    response = requests.get(
        url,
        params=params,
        data=data,
        headers=headers,
        cookies=cookies,
        auth=auth,
        timeout=timeout,
        allow_redirects=allow_redirects
    )

    if response.status_code == 200:
        return response.json()
    else:
        print(f"Error fetching data: {response.status_code}")


if __name__ == "__main__":
    if not api_key:
        raise ValueError("API key is required. Please set the 'api_key' variable.")
    
    team1_puuid, team2_puuid = get_puuid(team1, team2)

    t1_expected_win, t2_expected_win = get_expected_win_rate(team1_puuid, team2_puuid)

    if t1_expected_win == t2_expected_win:
        print("The teams are evenly matched.")
    elif t1_expected_win > t2_expected_win:
        print("Team 1 is expected to win.")
    else:
        print("Team 2 is expected to win.")