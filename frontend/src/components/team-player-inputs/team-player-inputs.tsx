import React, { useState } from 'react';
import { UsernameInput } from '../username-input/username-input';
import './team-player-inputs.css';

interface TeamPlayerInputsProps {
    teamNumber: number;
}

export function TeamPlayerInputs({ teamNumber }: TeamPlayerInputsProps) {
    const [usernames, setUsernames] = useState<string[]>(Array(5).fill(''));

    const handleUsernameChange = (index: number, value: string) => {
        const updated = [...usernames];
        updated[index] = value;
        setUsernames(updated);
    };

    return (
        <div className="team-player-inputs">
            <h2>Team #{teamNumber}</h2>
            {Array.from({ length: 5 }).map((_, i) => (
                <UsernameInput
                    key={i}
                    playerNumber={i + 1}
                    value={usernames[i]}
                    onChange={value => handleUsernameChange(i, value)}
                />
            ))}
        </div>
    );
}