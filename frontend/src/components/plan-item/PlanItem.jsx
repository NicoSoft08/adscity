import React, { useState } from 'react';
import './PlanItem.scss';
import { forfaits } from '../../data/plans';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faInfoCircle, faTable, faThLarge, faTimes } from '@fortawesome/free-solid-svg-icons';

export default function PlanItem({ onSelectPlan, currentPlan }) {
    const [viewMode, setViewMode] = useState('card'); // 'card' or 'table'
    const [selectedPlan, setSelectedPlan] = useState(currentPlan || null);

    const handlePlanSelect = (planId) => {
        setSelectedPlan(planId);
        if (onSelectPlan) {
            onSelectPlan(planId);
        }
    };

    // Card view rendering
    const renderCardView = () => {
        return (
            <div className="pricing-cards">
                {forfaits.map((plan) => (
                    <div 
                        key={plan.id} 
                        className={`pricing-card ${plan.popular ? 'popular' : ''} ${selectedPlan === plan.id ? 'selected' : ''}`}
                        style={{ borderTopColor: plan.color }}
                    >
                        {plan.popular && <div className="popular-badge">Populaire</div>}
                        
                        <div className="plan-header">
                            <h3 className="plan-name">{plan.displayName}</h3>
                            <p className="plan-tagline">{plan.tagline}</p>
                            <div className="plan-price">
                                <span className="currency">{plan.currency}</span>
                                <span className="amount">{plan.price}</span>
                                <span className="period">/{plan.validity.label}</span>
                            </div>
                        </div>
                        
                        <div className="plan-limits">
                            <div className="limit-item">
                                <span className="limit-value">{plan.limits.ads}</span>
                                <span className="limit-label">Annonces</span>
                            </div>
                            <div className="limit-item">
                                <span className="limit-value">{plan.limits.photos}</span>
                                <span className="limit-label">Photos/annonce</span>
                            </div>
                            <div className="limit-item">
                                <span className="limit-value">{plan.limits.boosts}</span>
                                <span className="limit-label">Boosts</span>
                            </div>
                        </div>
                        
                        <div className="plan-features">
                            {plan.features.map((feature) => (
                                <div key={feature.id} className="feature-item">
                                    <div className="feature-icon">
                                        {feature.included ? (
                                            <FontAwesomeIcon icon={faCheck} className="icon-check" />
                                        ) : (
                                            <FontAwesomeIcon icon={faTimes} className="icon-times" />
                                        )}
                                    </div>
                                    <div className="feature-text">
                                        <span className="feature-label">{feature.label}</span>
                                        <span className="feature-value">{feature.value}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <div className="plan-description">
                            <p>{plan.description}</p>
                        </div>
                        
                        <button 
                            className="plan-cta-button" 
                            style={{ backgroundColor: plan.color }}
                            onClick={() => handlePlanSelect(plan.id)}
                        >
                            {plan.cta}
                        </button>
                    </div>
                ))}
            </div>
        );
    };

    // Table view rendering
    const renderTableView = () => {
        // Get all unique feature IDs across all plans
        const allFeatures = Array.from(
            new Set(forfaits.flatMap(plan => plan.features.map(feature => feature.id)))
        );

        return (
            <div className="pricing-table-container">
                <table className="pricing-table">
                    <thead>
                        <tr>
                            <th className="feature-column">Fonctionnalités</th>
                            {forfaits.map(plan => (
                                <th 
                                    key={plan.id} 
                                    className={`plan-column ${plan.popular ? 'popular' : ''}`}
                                    style={{ borderTop: plan.popular ? `3px solid ${plan.color}` : 'none' }}
                                >
                                    {plan.popular && <div className="popular-badge">Populaire</div>}
                                    <div className="plan-name">{plan.displayName}</div>
                                    <div className="plan-price">
                                        <span className="amount">{plan.price}</span>
                                        <span className="currency">{plan.currency}</span>
                                    </div>
                                    <div className="plan-period">{plan.validity.label}</div>
                                    <button 
                                        className="plan-select-btn"
                                        style={{ backgroundColor: plan.color }}
                                        onClick={() => handlePlanSelect(plan.id)}
                                    >
                                        {plan.cta}
                                    </button>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="section-header">
                            <td colSpan={forfaits.length + 1}>Limites</td>
                        </tr>
                        <tr>
                            <td>Nombre d'annonces</td>
                            {forfaits.map(plan => (
                                <td key={plan.id}>{plan.limits.ads}</td>
                            ))}
                        </tr>
                        <tr>
                            <td>Photos par annonce</td>
                            {forfaits.map(plan => (
                                <td key={plan.id}>{plan.limits.photos}</td>
                            ))}
                        </tr>
                        <tr>
                            <td>Boosts disponibles</td>
                            {forfaits.map(plan => (
                                <td key={plan.id}>{plan.limits.boosts}</td>
                            ))}
                        </tr>
                        <tr>
                            <td>Durée de validité</td>
                            {forfaits.map(plan => (
                                <td key={plan.id}>{plan.limits.duration}</td>
                            ))}
                        </tr>
                        
                        <tr className="section-header">
                            <td colSpan={forfaits.length + 1}>Fonctionnalités</td>
                        </tr>
                        
                        {allFeatures.map(featureId => {
                            // Find the feature label from the first plan that has it
                            const featureLabel = forfaits.find(
                                plan => plan.features.find(f => f.id === featureId)
                            )?.features.find(f => f.id === featureId)?.label || featureId;
                            
                            return (
                                <tr key={featureId}>
                                    <td>{featureLabel}</td>
                                    {forfaits.map(plan => {
                                        const feature = plan.features.find(f => f.id === featureId);
                                        return (
                                            <td key={plan.id}>
                                                {feature ? (
                                                    <>
                                                        {feature.included ? (
                                                            <div className="feature-included">
                                                                <FontAwesomeIcon icon={faCheck} className="icon-check" />
                                                                <span>{feature.value}</span>
                                                            </div>
                                                        ) : (
                                                            <FontAwesomeIcon icon={faTimes} className="icon-times" />
                                                        )}
                                                    </>
                                                ) : (
                                                    <FontAwesomeIcon icon={faTimes} className="icon-times" />
                                                )}
                                            </td>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="pricing-plans-container">
            <div className="view-toggle">
                <button 
                    className={`toggle-btn ${viewMode === 'card' ? 'active' : ''}`}
                    onClick={() => setViewMode('card')}
                >
                    <FontAwesomeIcon icon={faThLarge} /> Cartes
                </button>
                <button 
                    className={`toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
                    onClick={() => setViewMode('table')}
                >
                    <FontAwesomeIcon icon={faTable} /> Tableau
                </button>
            </div>
            
            <div className="pricing-content">
                {viewMode === 'card' ? renderCardView() : renderTableView()}
            </div>
            
            <div className="pricing-info">
                <div className="info-icon">
                    <FontAwesomeIcon icon={faInfoCircle} />
                </div>
                <p>
                    Tous les forfaits incluent l'accès à notre plateforme de base. 
                    Pour des besoins spécifiques ou des volumes plus importants, 
                    veuillez nous contacter pour une offre personnalisée.
                </p>
            </div>
        </div>
    );
};
