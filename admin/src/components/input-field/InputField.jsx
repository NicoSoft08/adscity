import React from 'react';
import './InputField.scss';

export default function InputField({ label, name, value, onChange, disabled, error, type = 'text', options, placeholder }) {
    return (
        <div className="wrap">
            <label htmlFor={name}>
                {label} <strong>*</strong>
            </label>
            {type === 'select' ? (
                <select
                    name={name}
                    value={value}
                    onChange={onChange}
                    className={`input-field ${error ? 'error' : ''}`}
                >
                    <option value="">-- Choisissez --</option>
                    {options && options.map((opt, idx) => (
                        <option key={idx} value={opt}>
                            {opt}
                        </option>
                    ))}
                </select>
            ) : type === 'checkbox' && Array.isArray(options) ? (
                <div className="checkbox-group">
                    {options && options.map((opt, idx) => (
                        <label key={idx} className="checkbox-option">
                            <input
                                type="checkbox"
                                name={name}
                                value={opt}
                                checked={Array.isArray(value) && value.includes(opt)}
                                onChange={onChange}
                                disabled={disabled}
                            />
                            {opt}
                        </label>
                    ))}
                </div>
            ) : (
                <input
                    className={`input-field ${error ? 'error' : ''}`}
                    type={type}
                    name={name}
                    value={value}
                    placeholder={placeholder}
                    onChange={onChange}
                    disabled={disabled}
                />
            )}
            {error && <span className="error">{error}</span>}
        </div>
    );
};
