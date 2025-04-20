import React from 'react';
import '../styles/ComparisonTable.scss';

function ComparisonTable({ plans, onClose }) {
    const attributes = [
        { key: 'ads_num', label: "Nombre d'annonces" },
        { key: 'cost_plan', label: "Coût du plan" },
        { key: 'ads_visible', label: "Visibilité des annonces" },
        { key: 'support_client', label: "Support client" },
        { key: 'stat_performance', label: "Statistiques de performance" },
        { key: 'special_cat', label: "Catégories spécialisées" },
        { key: 'tool_manage_ads', label: "Outils de gestion" },
        { key: 'personalize', label: "Personnalisation" },
        { key: 'credibility', label: "Crédibilité" },
        { key: 'ads_status', label: "Status publicitaires" },
    ];

    return (
        <div className="comparison-table">
            <table>
                <thead>
                    <tr>
                        <th>Caractéristiques</th>
                        {plans.map(plan => (
                            <th key={plan.id}>{plan.name}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {attributes.map(attr => (
                        <tr key={attr.key}>
                            <td>{attr.label}</td>
                            {plans.map(plan => (
                                <td key={plan.id}>
                                    {plan.content[attr.key]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>

            <button
                onClick={onClose}
                className="close-btn"
            >
                Fermer
            </button>
        </div>
    );
};

export default ComparisonTable;