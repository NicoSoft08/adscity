const { uploadPostImage, uploadUserProfilePicture, uploadUserBannerPicture, collectUserProfilePhoto } = require('../firebase/storage');

const getUserProfilePicture = async (req, res) => {
    const { userID } = req.params;

    try {
        const profilURL = await collectUserProfilePhoto(userID);
        if (!profilURL) {
            return res.status(404).json({
                success: false,
                message: 'Photo de profil non trouvée',
            });
        };
        res.status(200).json({
            success: true,
            message: 'Photo de profil récupérée avec succès',
            profilURL: profilURL,
        });
    } catch (error) {
        console.error('Erreur lors de la récupération de la photo de profil :', error);
        res.status(500).json({
            success: false,
            message: 'Erreur technique, réessayez plus tard',
        });
    };
};

const uploadImage = async (req, res) => {
    const file = req.file;
    const { userID } = req.body;

    try {
        const imageUrl = await uploadPostImage(file, userID);
        if (!imageUrl) {
            return res.status(400).json({
                success: false,
                message: 'Erreur lors du téléchargement de l\'image'
            });
        };
        res.status(201).json({
            success: true,
            message: 'Image téléchargée avec succès',
            imageUrl: imageUrl,
        });
    } catch (error) {
        console.error('Erreur lors du téléchargement de l\'image:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur technique, réessayez plus tard'
        });
    };
};

const uploadProfileURL = async (req, res) => {
    const file = req.file;
    const { userID } = req.body;

    try {
        const publicUrl = await uploadUserProfilePicture(file, userID);
        if (!publicUrl) {
            return res.status(400).json({
                success: false,
                message: 'Erreur lors du téléchargement de l\'image de profile'
            });
        };
        res.status(201).json({
            success: true,
            message: 'Image téléchargée avec succès',
            imageUrl: publicUrl,
        });
    } catch (error) {
        console.error('Erreur lors du téléchargement de l\'image de profile:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur technique, réessayez plus tard'
        });
    };
};

const uploadBannerURL = async (req, res) => {
    const file = req.file;
    const { userID } = req.body;

    try {
        const publicUrl = await uploadUserBannerPicture(file, userID);
        if (!publicUrl) {
            return res.status(400).json({
                success: false,
                message: 'Erreur lors du téléchargement de l\'image de couverture'
            });
        };
        res.status(201).json({
            success: true,
            message: 'Image téléchargée avec succès',
            imageUrl: publicUrl,
        });
    } catch (error) {
        console.error('Erreur lors du téléchargement de l\'image de couverture:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur technique, réessayez plus tard'
        });
    };
};



module.exports = {
    getUserProfilePicture,
    uploadImage,
    uploadBannerURL,
    uploadProfileURL,
};