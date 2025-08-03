import React, { useState } from 'react';
import { UsernameInput } from '../username-input/username-input';
import './team-player-inputs.css';
import { TagInput } from '../tag-input/tag-input';

interface Player {
    username: string;
    tag: string;
}

export function TeamPlayerInputs({ teamNumber }: { teamNumber: number }) {
    const [players, setPlayers] = useState<Player[]>(
        Array.from({ length: 5 }, () => ({
            username: '',
            tag: '',
        }))
    );

    const handleUsernameChange = (index: number, value: string) => {
        const updated = [...players];
        updated[index].username = value;
        setPlayers(updated);
    };

    const handleTagChange = (index: number, value: string) => {
        const updated = [...players];
        updated[index].tag = value;
        setPlayers(updated);
    };

    return (
        <div className="team-player-inputs">
            <h2>Team #{teamNumber}</h2>
            {players.map((player, i) => (
                <div className="player-input" key={i}>
                    <UsernameInput
                        playerNumber={i + 1}
                        value={player.username}
                        onChange={value => handleUsernameChange(i, value)}
                    />
                    <TagInput
                        value={player.tag}
                        onChange={value => handleTagChange(i, value)}
                    />
                </div>
            ))}
        </div>
    );
}