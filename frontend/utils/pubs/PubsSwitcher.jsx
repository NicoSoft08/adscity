import { 
    MastheadPub, 
    NativeDisplayPub, 
    VideoInFeedPub 
} from "./Pubs";


const PubsSwitcher = ({ pub }) => {
    switch (pub.pubType) {
        case 'masthead':
            return <MastheadPub pub={pub} />;

        case 'video-in-feed':
            return <VideoInFeedPub pub={pub} />;

        case 'native-display':
            return <NativeDisplayPub pub={pub} />;

        // ... autres types de pub
        default:
            return null; // Aucun composant si pubType non reconnu
    };
};

export default PubsSwitcher;