import React, { useState } from 'react';
import { TeamPlayerInputs } from '../../components/team-player-inputs/team-player-inputs';
import './home-page.css';

export function HomePage() {
    const [team1Players, setTeam1Players] = useState(Array(5).fill({ username: '', tag: '' }));
    const [team2Players, setTeam2Players] = useState(Array(5).fill({ username: '', tag: '' }));
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleSubmit = async () => {
        setLoading(true);
        const payload = {
            team1: team1Players,
            team2: team2Players,
        };
        try {
            const response = await fetch('http://127.0.0.1:5000/prediction', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const data = await response.json();
            setResult(data);
        } catch (error) {
            console.error('Error submitting teams:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main>
            <div className="page-container">
                <header>
                    <div className="header">
                        <img src={require("./riot.png")} alt="Summoner Showdown Logo" />
                        <div className="header-text">
                            <h1>Summoner Showdown</h1>
                            <h3>By <a href="https://github.com/angelala3252">angelala3252</a> and <a href="https://github.com/ilanivek">ilanivek</a></h3>
                        </div>
                    </div>
                </header>
                <div className="body-container">
                    <p>
                        Welcome to Summoner Showdown, a League of Legends match predictor based off of ELO of each summoner in a match!
                        <br />
                        <br />
                        To get started, please input the in-game usernames of all summoners:
                    </p>

                    {loading ? (
                        <div className="loader"></div>
                    ) : (
                        <div className="input-container">
                            <TeamPlayerInputs teamNumber={1} players={team1Players} setPlayers={setTeam1Players} />
                            <TeamPlayerInputs teamNumber={2} players={team2Players} setPlayers={setTeam2Players} />
                        </div>
                    )}
                    <button onClick={handleSubmit} className={loading ? 'loading' : ''}>Submit</button>
                    {result != null ?
                        (
                            <div className="result">
                                <h2>Prediction Result</h2>
                                <p>Team 1 Win Probability: {result["team1"]}</p>
                                <p>Team 2 Win Probability: {result["team2"]}</p>
                            </div>
                        ) :
                        null
                    }
                </div>
            </div>
        </main>
    );
}