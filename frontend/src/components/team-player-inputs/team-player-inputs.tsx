import React, { useState } from 'react';
import { UsernameInput } from '../username-input/username-input';
import './team-player-inputs.css';
import { TagInput } from '../tag-input/tag-input';

export function TeamPlayerInputs({ teamNumber, players, setPlayers }) {
    const handleUsernameChange = (index, value) => {
        const updated = [...players];
        updated[index].gameName = value;
        setPlayers(updated);
    };

    const handleTagChange = (index, value) => {
        const updated = [...players];
        updated[index].tagLine = value;
        setPlayers(updated);
    };

    return (
        <div className="team-player-inputs">
            <h2>Team #{teamNumber}</h2>
            {players.map((player, i) => (
                <div className="player-input" key={i}>
                    <UsernameInput
                        playerNumber={i + 1}
                        value={player.gameName}
                        onChange={value => handleUsernameChange(i, value)}
                    />
                    <TagInput
                        value={player.tagLine}
                        onChange={value => handleTagChange(i, value)}
                    />
                </div>
            ))}
        </div>
    );
}