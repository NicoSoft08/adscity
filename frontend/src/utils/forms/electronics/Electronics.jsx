import React, { useState } from 'react';

export default function Electronics({ isSibmitted }) {
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        make: '',
        model: '',
        productType: '',
        condition: '',
        features: '',
        priceType: '',
        price: '',
        description: '',
    });

    const validateForm = () => {
        const errors = {};

        if (!formData.title) {
            errors.title = "";
        }
        if (!formData.make) {
            errors.make = "";
        }
        if (!formData.model) {
            errors.model = "";
        }
        if (!formData.productType) {
            errors.productType = "";
        }
        if (!formData.condition) {
            errors.condition = "";
        }
        if (!formData.features) {
            errors.features = "";
        }
        if (!formData.priceType) {
            errors.priceType = "";
        }
        if (!formData.price) {
            errors.price = "";
        }
        if (!formData.description) {
            errors.description = "";
        }
    }


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    return (
        <div>Electronics</div>
    );
};
