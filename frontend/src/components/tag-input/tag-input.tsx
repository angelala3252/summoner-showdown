import React, { useState } from 'react';
import './tag-input.css';

export function TagInput({ value = '', onChange }) {
    const [inputValue, setInputValue] = useState(value);

    const handleChange = (e) => {
        setInputValue(e.target.value);
        if (onChange) {
            onChange(e.target.value);
        }
    };

    return (
        <div>
            <span># </span>
            <input
                type="text"
                className="tag-input"
                value={inputValue}
                onChange={handleChange}
            />
        </div>
    );
}