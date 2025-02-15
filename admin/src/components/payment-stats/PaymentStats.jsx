import React, { useEffect, useState } from 'react';
import { fetchPaymentStatus } from '../../routes/paymentRoutes';
import { paymentStatuses } from '../../data';
import './PaymentStats.scss';


export default function PaymentStats() {
    const [paymentsProcessing, setPaymentsProcessing] = useState([]);
    const [paymentsCompleted, setPaymentsCompleted] = useState([]);
    const [paymentsFailed, setPaymentsFailed] = useState([]);


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
            <h3>Paiements</h3>
            <div className="container">
                <div
                    className="stat-card"
                    style={{ backgroundColor: paymentStatuses.processing.color }}
                >
                    <span className="stat-icon">
                        {paymentStatuses.processing.icon}
                    </span>
                    <span className="stat-value">
                        {paymentsProcessing.length}
                    </span>
                    <span className="stat-label">
                        {paymentStatuses.processing.label}
                    </span>
                </div>
                <div
                    className="stat-card"
                    style={{ backgroundColor: paymentStatuses.completed.color }}
                >
                    <span className="stat-icon">
                        {paymentStatuses.completed.icon}
                    </span>
                    <span className="stat-value">
                        {paymentsCompleted.length}
                    </span>
                    <span className="stat-label">
                        {paymentStatuses.completed.label}
                    </span>
                </div>
                <div
                    className="stat-card"
                    style={{ backgroundColor: paymentStatuses.failed.color }}
                >
                    <span className="stat-icon">
                        {paymentStatuses.failed.icon}
                    </span>
                    <span className="stat-value">
                        {paymentsFailed.length}
                    </span>
                    <span className="stat-label">
                        {paymentStatuses.failed.label}
                    </span>
                </div>
            </div>
        </div>
    );
};
