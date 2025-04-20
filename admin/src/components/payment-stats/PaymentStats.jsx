import React, { useContext, useEffect, useState } from 'react';
import { fetchPaymentStatus } from '../../routes/paymentRoutes';
import { paymentStatuses } from '../../data';
import { LanguageContext } from '../../contexts/LanguageContext';
import './PaymentStats.scss';

export default function PaymentStats() {
    const [paymentsProcessing, setPaymentsProcessing] = useState([]);
    const [paymentsCompleted, setPaymentsCompleted] = useState([]);
    const [paymentsFailed, setPaymentsFailed] = useState([]);
    const { language } = useContext(LanguageContext);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchPaymentStatus();
                setPaymentsProcessing(data.processingPayments);
                setPaymentsCompleted(data.completedPayments);
                setPaymentsFailed(data.expiredPayments);
            } catch (error) {
                console.error('Erreur technique:', error);
            }
        };

        fetchData();
    }, []);


    return (
        <div className="payment-stats">
            <h3>{language === 'FR' ? "Paiements" : "Payments"}</h3>
            <div className="container">
                <div
                    className="stat-card"
                    style={{ backgroundColor: paymentStatuses(language).processing.color }}
                >
                    <span className="stat-icon">
                        {paymentStatuses(language).processing.icon}
                    </span>
                    <span className="stat-value">
                        {paymentsProcessing.length}
                    </span>
                    <span className="stat-label">
                        {paymentStatuses(language).processing.label}
                    </span>
                </div>
                <div
                    className="stat-card"
                    style={{ backgroundColor: paymentStatuses(language).completed.color }}
                >
                    <span className="stat-icon">
                        {paymentStatuses(language).completed.icon}
                    </span>
                    <span className="stat-value">
                        {paymentsCompleted.length}
                    </span>
                    <span className="stat-label">
                        {paymentStatuses(language).completed.label}
                    </span>
                </div>
                <div
                    className="stat-card"
                    style={{ backgroundColor: paymentStatuses(language).failed.color }}
                >
                    <span className="stat-icon">
                        {paymentStatuses(language).failed.icon}
                    </span>
                    <span className="stat-value">
                        {paymentsFailed.length}
                    </span>
                    <span className="stat-label">
                        {paymentStatuses(language).failed.label}
                    </span>
                </div>
            </div>
        </div>
    );
};
