import React, { useState } from 'react';

interface UsernameInputProps {
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
}

export function UsernameInput({ value = '', onChange, placeholder = 'Enter username' }: UsernameInputProps) {
    const [inputValue, setInputValue] = useState(value);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
        if (onChange) {
            onChange(e.target.value);
        }
    };

    return (
        <input
            type="text"
            className="username-input"
            value={inputValue}
            onChange={handleChange}
            placeholder={placeholder}
        />
    );
}