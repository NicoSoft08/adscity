import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { validateDevice } from "../../services/authServices";
import { AuthContext } from "../../contexts/AuthContext";
import Loading from "../../customs/Loading";
import Toast from "../../customs/Toast";

function VerifyDevice() {
    const { currentUser } = useContext(AuthContext);
    const { deviceID, verificationToken } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ show: false, type: '', message: '' });

    useEffect(() => {
        const verifyDevice = async () => {
            setLoading(true);
            const result = await validateDevice(currentUser, deviceID, verificationToken);

            console.log(result);
            // if (result.success) {
            //     setToast({
            //         show: true,
            //         type: 'success',
            //         message: 'Appareil vérifié avec succès !',
            //     });

            //     setTimeout(() => {
            //         navigate('/auth/signin');
            //         setLoading(false);
            //     }, 2000);
            // }
        };

        verifyDevice();

    }, [deviceID, verificationToken, navigate, currentUser]);

    if (loading) return <Loading />

    return (
        <div>
            <Toast
                show={toast.show}
                type={toast.type}
                message={toast.message}
                onClose={() => setToast({ ...toast, show: false })}
            />
            <h1>Verify Device</h1>
            <p>Device ID: {deviceID}</p>
            <p>Verification Token: {verificationToken}</p>
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