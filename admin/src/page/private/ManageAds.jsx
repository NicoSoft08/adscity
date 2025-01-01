import React from 'react';
import '../../styles/ManageAds.scss';

export default function ManageAds() {
    return (
        <div className="ads-section">
            <h3>Gestion des Annonces</h3>

            <div className="ads-tools">
                <div className="stats">
                    <h4>Statistiques générales</h4>
                    <p>Total Publicités : 500</p>
                    <p>Publicités actives : 350</p>
                    <p>Revenus générés : 10,000 RUB</p>
                </div>

                <div className="ads-list">
                    <h4>Liste des Annonces</h4>
                    <table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Titre</th>
                                <th>Utilisateur</th>
                                <th>Statut</th>
                                <th>Date d'expiration</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Exemple de ligne */}
                            <tr>
                                <td>1</td>
                                <td>Promo spéciale</td>
                                <td>Jean Dupont</td>
                                <td>Actif</td>
                                <td>2024-01-15</td>
                                <td>
                                    <button>Modifier</button>
                                    <button>Désactiver</button>
                                    <button>Supprimer</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
