import React, { useState } from 'react';
import './username-input.css';

export function UsernameInput({ value = '', onChange, placeholder = 'Game Name', playerNumber }) {
    const [inputValue, setInputValue] = useState(value);

    const handleChange = (e) => {
        setInputValue(e.target.value);
        if (onChange) {
            onChange(e.target.value);
        }
    };

    return (
        <div>
            {playerNumber !== undefined && <span className="player-number">Player #{playerNumber}: </span>}
            <input
                type="text"
                className="username-input"
                value={inputValue}
                onChange={handleChange}
                placeholder={placeholder}
            />
        </div>
    );
}