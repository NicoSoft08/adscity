import { logEvent } from "firebase/analytics"
import { analytics } from "../firebaseConfig"


const fileUpload = () => {
    return logEvent(analytics, 'upload_file');
};


const userLoggedIn = () => {
    return logEvent(analytics, 'login');
}


const userSignedUp = () => {
    return logEvent(analytics, 'sign_up');
}



export { fileUpload, userLoggedIn, userSignedUp };