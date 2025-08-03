import requests
import json
import time

api_key = "RGAPI-367e41a4-7e32-4a31-8581-1fb9b96094b4"

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
        "EMERALD": 1600,
        "PLATINUM": 2000,
        "DIAMOND": 2400,
        "MASTER": 2500,
        "GRANDMASTER": 2700,
        "CHALLENGER": 3200
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
    num_games = 3
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


def update_ranking(
    puuid, 
    rank, 
    game_id):

    game_info = fetch_something(
        f"https://americas.api.riotgames.com/lol/match/v5/matches/{game_id}",
        headers={"X-Riot-Token": api_key})

    participants = game_info["metadata"]["participants"]
    
    team1 = []
    team2 = []

    for ind in range(len(participants)):
        team = game_info["info"]["participants"][ind]["teamId"]
        if team == 100:
            team1.append(participants[ind])
        else:
            team2.append(participants[ind])

    team1_dict = {}
    team2_dict = {}
    
    for player in team1:
        team1_dict[player] = {}
        player_info = get_player_info(player)

        games = player_info["wins"] + player_info["losses"] 
        k_value = 800 / (games +1)
        team1_dict[player]["K"] = k_value

        damage_dealt = game_info["info"]["participants"][ind]["trueDamageDealt"]
        team1_dict[player]["DamageDelt"] = damage_dealt

        damage_taken = game_info["info"]["participants"][ind]["trueDamageTaken"]
        team1_dict[player]["DamageTaken"] = damage_taken

        if player == puuid:
            ind = team1.index(player)
            win = game_info["info"]["participants"][ind]["win"]
            team1_dict[player]["rank"] = rank
            puuid_team = 1
        
        else:
            num_rank = get_num_rank(player_info["tier"], player_info["rank"], player_info["leaguePoints"])
            team1_dict[player]["rank"] = num_rank

    for player in team2:
        team2_dict[player] = {}
        player_info = get_player_info(player)

        games = player_info["wins"] + player_info["losses"] 
        k_value = 800 / (games +1)
        team2_dict[player]["K"] = k_value

        damage_dealt = game_info["info"]["participants"][ind]["trueDamageDealt"]
        team2_dict[player]["DamageDelt"] = damage_dealt

        damage_taken = game_info["info"]["participants"][ind]["trueDamageTaken"]
        team2_dict[player]["DamageTaken"] = damage_taken

        if player == puuid:
            ind = team2.index(player)
            win = game_info["info"]["participants"][ind]["win"]
            team2_dict[player]["rank"] = rank
            puuid_team = 2

        else:
            num_rank = get_num_rank(player_info["tier"], player_info["rank"], player_info["leaguePoints"])
            team2_dict[player]["rank"] = num_rank
    
    # get team ranks
    team1_rank = sum(team1_dict[player]["rank"] for player in team1_dict)
    team2_rank = sum(team2_dict[player]["rank"] for player in team2_dict)

    # get team k values
    t1_k = sum(team1_dict[player]["K"] for player in team1_dict)
    t2_k = sum(team2_dict[player]["K"] for player in team2_dict)
    
    # get expected win rate
    t1_win_rate = 1 / (1 + 10 ** ((team2_rank - team1_rank) / 400))
    t2_win_rate = 1 - t1_win_rate

    # get score and adjust ranking, split adjustment among team
    if puuid_team == 1:
        if win:
            score = 1
        else:
            score = 0
        new_team1_rank = team1_rank + t1_k * (score - t1_win_rate)
        if win:
            total_dmg = sum(team1_dict[player]["DamageDelt"] for player in team1_dict)
            percentage = team1_dict[puuid]["DamageDelt"] / total_dmg
            new_rank = new_team1_rank * percentage
        else:
            total_dmg = sum(team1_dict[player]["DamageTaken"] for player in team1_dict)
            percentage = team1_dict[puuid]["DamageTaken"] / total_dmg
            new_rank = new_team1_rank * percentage
    else:
        if win:
            score = 1
        else:
            score = 0
        new_team2_rank = team2_rank + t2_k * (score - t2_win_rate)
        if win: 
            total_dmg = sum(team2_dict[player]["DamageDelt"] for player in team2_dict)
            percentage = team2_dict[puuid]["DamageDelt"] / total_dmg
            new_rank = new_team2_rank * percentage
        else:   
            total_dmg = sum(team2_dict[player]["DamageTaken"] for player in team2_dict)
            percentage = team2_dict[puuid]["DamageTaken"] / total_dmg
            new_rank = new_team2_rank * percentage

    return new_rank


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
    time.sleep(1)  # To avoid hitting rate limits
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