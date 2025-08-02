import { TeamPlayerInputs } from '../../components/team-player-inputs/team-player-inputs';
import './home-page.css';

export function HomePage() {
    return (
        <main>
            <div className="page-container">
                <header>
                    <div className="header">
                        <h1>Summoner Showdown</h1>
                        <h3>By <a href="https://github.com/angelala3252">angelala3252</a> and <a href="https://github.com/ilanivek">ilanivek</a></h3>
                    </div>
                </header>
                <div className="body-container">
                    <p>
                        Welcome to Summoner Showdown, a League of Legends match predictor based off of ELO of each summoner in a match! 
                        <br />
                        <br />
                        To get started, please input the in-game usernames of all summoners:
                    </p>
                    <div className="input-container">
                        <TeamPlayerInputs teamNumber={1} />
                        <TeamPlayerInputs teamNumber={2} />
                    </div>
                </div>
            </div>
        </main>
    );
}
