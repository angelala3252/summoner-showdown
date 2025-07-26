import React, { useState } from 'react';
import './username-input.css';

interface UsernameInputProps {
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    playerNumber?: number;
}

export function UsernameInput({ value = '', onChange, placeholder = 'Enter username', playerNumber }: UsernameInputProps) {
    const [inputValue, setInputValue] = useState(value);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
        if (onChange) {
            onChange(e.target.value);
        }
    };

    return (
        <div>
            {playerNumber !== undefined && <span>Player #{playerNumber}: </span>}
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