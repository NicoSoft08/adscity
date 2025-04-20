import React, { useState } from 'react';
import '../../styles/FeedbackForm.scss';

const testSteps = [
    {
        id: 1,
        title: "Inscription",
        description: "Testez la fonctionnalité d'inscription d'un nouvel utilisateur. Remplissez les champs requis et validez l'inscription. Une code de confirmation sera envoyé à l'email que vous aurez fourni. Vous serez redirigé vers la page d'inscription réussie, où vous devrez entrez le code reçu. Une fois le code validé, vous pourrez vous connecter avec votre email et mot de passe.",
        expected: "L'utilisateur doit être inscrit avec succès.",
        fields: {
            obtained: "",
            status: "",
            comments: "",
        },
    },
    {
        id: 2,
        title: "Connexion",
        description: "Testez la fonctionnalité de connexion avec des identifiants valides. Vous devrez fournir un email et un mot de passe valides. Une fois que vous aurez saisi ces informations, vous serez redirigé vers la page d'accueil.",
        expected: "L'utilisateur doit être connecté avec succès.",
        fields: {
            obtained: "",
            status: "",
            comments: "",
        },
    },
    {
        id: 3,
        title: "Publication d'annonce",
        description: "Testez la création et la publication d'une annonce.  Vous choisirez une catégorie et une sous catégorié, puis vous devrez remplir les champs requis. A l'aide des boutons de navigations, vous devrez passer les étapes suivantes. Vous devrez ensuite ajouter des photos de votre annonce, puis passer à l'étape suivante. Vous allez renseignez la localisation, ensuite vous arriverez à la dernière étape où vous devrez revisiter les informations de votre annonce pour la publier. En appuyant sur le bouton 'Soumettre', vous verrez une boite de dialogue vous demandant de confirmer la publication. Une fois la confirmation faite, vous verrez une boite de dialogue vous indiquant que votre annonce a été publiée avec succès.",
        expected: "L'annonce doit être publiée avec succès.",
        fields: {
            obtained: "",
            status: "",
            comments: "",
        },
    },
];

export default function FeedbackForm() {
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState([...testSteps]);

    const handleChange = (field, value) => {
        const updatedFormData = [...formData];
        updatedFormData[currentStep].fields[field] = value;
        setFormData(updatedFormData);
    };

    const handleNext = () => {
        if (currentStep < formData.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSubmit = () => {
        console.log("Final Form Data:", formData);
        alert("Merci pour vos retours !");
        // Envoyer les données vers une API ou Firebase ici
    };

    const currentData = formData[currentStep];

    return (
        <div className="step-form">
            <h2>Test fonctionnel : {currentData.title}</h2>
            <p>{currentData.description}</p>
            <div className="test-details">
                <p><strong>Résultat attendu : </strong>{currentData.expected}</p>
            </div>

            <div className="form-group">
                <label>Résultat obtenu</label>
                <textarea
                    value={currentData.fields.obtained}
                    onChange={(e) => handleChange("obtained", e.target.value)}
                    placeholder="Décrivez le résultat obtenu..."
                />
            </div>

            <div className="form-group">
                <label>Statut</label>
                <div>
                    <label>
                        <input
                            type="radio"
                            name={`status-${currentStep}`}
                            value="Succès"
                            checked={currentData.fields.status === "Succès"}
                            onChange={(e) => handleChange("status", e.target.value)}
                        />
                        Succès
                    </label>
                    <label>
                        <input
                            type="radio"
                            name={`status-${currentStep}`}
                            value="Échec"
                            checked={currentData.fields.status === "Échec"}
                            onChange={(e) => handleChange("status", e.target.value)}
                        />
                        Échec
                    </label>
                    <label>
                        <input
                            type="radio"
                            name={`status-${currentStep}`}
                            value="En cours"
                            checked={currentData.fields.status === "En cours"}
                            onChange={(e) => handleChange("status", e.target.value)}
                        />
                        En cours
                    </label>
                </div>
            </div>

            <div className="form-group">
                <label>Commentaires ou observations</label>
                <textarea
                    value={currentData.fields.comments}
                    onChange={(e) => handleChange("comments", e.target.value)}
                    placeholder="Ajoutez vos commentaires ou remarques ici..."
                />
            </div>

            <div className="navigation-buttons">
                <button className="previous-button"
                    onClick={handlePrevious}
                    disabled={currentStep === 0}
                >
                    Précédent
                </button>
                {currentStep < formData.length - 1 ? (
                    <button className='next-button' onClick={handleNext}>
                        Suivant
                    </button>
                ) : (
                    <button className='submit-button' onClick={handleSubmit}>
                        Soumettre
                    </button>
                )}
            </div>
        </div>
    );
};
