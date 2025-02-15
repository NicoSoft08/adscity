import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { validateDevice } from "../../routes/authRoutes";
import { AuthContext } from "../../contexts/AuthContext";
import Loading from "../../customs/Loading";
import Toast from "../../customs/Toast";

function VerifyDevice() {
    const { currentUser } = useContext(AuthContext);
    const { deviceID, verificationToken } = useParams();
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ show: false, type: '', message: '' });
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!currentUser) {
            setToast({ 
                show: true, 
                type: 'error', 
                message: "Utilisateur non connecté ou authentification non initialisée." 
            });
            return;
        }
        
        const verifyDevice = async () => {
            if (!deviceID || !verificationToken) {
                setToast({ 
                    show: true, 
                    type: 'error', 
                    message: 'Informations insuffisantes pour vérifier l’appareil.' 
                });
                return;
            }

            setLoading(true);

            try {
                const result = await validateDevice(deviceID, verificationToken);
                if (result.success) {
                    navigate('/user/dashboard/panel');
                }
            } catch (error) {
                console.error('Erreur lors de la vérification de l’appareil :', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        verifyDevice();
    }, [deviceID, verificationToken, currentUser, navigate]);


    if (loading) return <Loading />

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
            {error && <div>Erreur : {error}</div>}
            <Toast
                show={toast.show}
                type={toast.type}
                message={toast.message}
                onClose={() => setToast({ ...toast, show: false })}
            />
        </div>
    );
};


function DeclineDevice() {
    const { deviceID, verificationToken } = useParams();

    return (
        <div>
            <h1>Decline Device</h1>
            <p>Device ID: {deviceID}</p>
            <p>Verification Token: {verificationToken}</p>
        </div>
    );
};


export { VerifyDevice, DeclineDevice };