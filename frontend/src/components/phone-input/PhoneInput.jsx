import React from 'react';
import './PhoneInput.scss';

export default function PhoneInput({ selectedCountry, value, placeholder, className, onChange, countries, onChangeCountry }) {


    return (
        <div className="phone-input-container">
            <div className="select-wrapper">
                <select
                    value={selectedCountry.code}
                    onChange={onChangeCountry}
                    className="country-select"
                >
                    {countries.map((country) => (
                        <option key={country.code} value={country.code}>
                            {country.code} ({country.dialCode})
                        </option>
                    ))}
                </select>
                <img
                    src={selectedCountry.flag}
                    alt={`${selectedCountry.name} flag`}
                    className="selected-flag"
                />
            </div>
            <input
                type="tel"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={className}
            />
        </div>
    );
};
