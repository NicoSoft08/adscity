import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './DateRangePicker.scss';

export default function DateRangePicker({ onDateChange }) {
    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange;

    const handleDateChange = (update) => {
        setDateRange(update);
        onDateChange && onDateChange(update);
    };

    return (
        <div className="date-range-picker">
            <DatePicker
                selectsRange={true}
                startDate={startDate}
                endDate={endDate}
                onChange={handleDateChange}
                placeholderText="Sélectionner une période"
                className="date-input"
                dateFormat="dd/MM/yyyy"
            />
        </div>
    );
};
