const db = require('../config/database');
const { formatRelativeDate, generateSlug, monthNames } = require('../func');

const makePost = async (postData, userID) => {
    const client = await db.pool.connect();

    try {
        // Start transaction
        await client.query('BEGIN');

        // 1️⃣ Récupérer les données utilisateur
        const userQuery = 'SELECT * FROM users WHERE id = $1';
        const userResult = await client.query(userQuery, [userID]);

        if (userResult.rows.length === 0) {
            console.error("Utilisateur non trouvé");
            await client.query('ROLLBACK');
            return false;
        }

        const userData = userResult.rows[0];
        const { is_active, plans, ads_posted_this_month, user_id: UserID } = userData;
        const { location } = postData;


        // 2️⃣ Vérifier si l'utilisateur est actif
        if (!is_active) {
            console.error("Utilisateur inactif. Veuillez contacter le support.");
            await client.query('ROLLBACK');
            return false;
        }

        // 3️⃣ Vérifier si une promotion est active
        const promotionQuery = 'SELECT * FROM promotions WHERE code = $1 AND is_active = true AND start_date <= NOW() AND end_date >= NOW()';
        const promotionResult = await client.query(promotionQuery, ['launchOffer']);

        let maxAdsPerMonth;
        if (promotionResult.rows.length > 0) {
            const promotionFeatures = promotionResult.rows[0].features;
            maxAdsPerMonth = promotionFeatures.maxAdsPerMonth || null;
        }

        // 4️⃣ Gérer les limites du plan
        const userPlans = typeof plans === 'string' ? JSON.parse(plans) : plans;
        const userPlanKey = Object.keys(userPlans).find(planKey => userPlans[planKey]?.max_ads);
        const userPlan = userPlanKey ? userPlans[userPlanKey] : null;

        if (!userPlan) {
            console.error("Plan utilisateur introuvable");
            await client.query('ROLLBACK');
            return false;
        }

        const maxAdsFromPlan = userPlan.max_ads;
        const maxAds = maxAdsPerMonth || maxAdsFromPlan; // Priorité à la promotion

        // Vérifier si l'utilisateur a atteint la limite d'annonces
        if (ads_posted_this_month >= maxAds) {
            console.error("Limite d'annonces mensuelles atteinte");
            await client.query('ROLLBACK');
            return false;
        }

        // 6️⃣ Ajouter l'annonce dans PostgreSQL

        // 📌 Récupérer le dernier ID de post
        const lastPostQuery = 'SELECT post_id FROM posts ORDER BY post_id DESC LIMIT 1';
        const lastPostResult = await client.query(lastPostQuery);

        let lastPostID = "POST000";
        if (lastPostResult.rows.length > 0) {
            lastPostID = lastPostResult.rows[0].post_id;
        }

        // 📌 Extraire le numéro et incrémenter
        const lastNumber = parseInt(lastPostID.replace("POST", ""), 10);
        const newNumber = lastNumber + 1;
        const newPostID = `POST${String(newNumber).padStart(3, "0")}`; // Format POST001, POST002

        // 🆕 Initialiser les statistiques
        const stats = {
            views: 0,
            clicks: 0,
            reportingCount: 0,
            views_per_city: {},
            clicks_per_city: {},
            report_per_city: {},
            views_history: {},
            clicks_history: {},
            report_history: {}
        };

        // 🗓️ Initialiser les vues et clics sur 7, 15, 30 jours
        const periods = [7, 15, 30];
        const today = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD
        periods.forEach(days => {
            const formattedDate = formatRelativeDate(today);
            stats.views_history[days] = { [formattedDate]: 0 };
            stats.clicks_history[days] = { [formattedDate]: 0 };
            stats.report_history[days] = { [formattedDate]: 0 };
        });

        // Insert post into database
        const insertPostQuery = `
            INSERT INTO posts (
                id, 
                user_id, 
                user_unique_id,
                post_id,
                details, 
                category, 
                subcategory, 
                location, 
                images, 
                stats,
                status, 
                updated_at,
                posted_at,
                is_active,
                is_sold,
                refusal_reason,
                conversion_rate,
                engagement_rate,
                reported,
                slug,
                type,
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21
            ) RETURNING id
        `;

        const postValues = [
            userID,
            UserID,
            newPostID,
            postData.details || {},
            postData.category,
            postData.subcategory,
            JSON.stringify(postData.location),
            JSON.stringify(postData.images || []),
            JSON.stringify(stats),
            'pending',
            null,
            new Date(),
            false,
            false,
            null,
            0,
            0,
            generateSlug(postData.details.title),
            'regular',
        ];

        const postResult = await client.query(insertPostQuery, postValues);
        const newPostDbId = postResult.rows[0].id;

        // 7️⃣ Gérer le compteur d'annonces mensuelles
        const currentMonthName = monthNames[new Date().getMonth()];

        if (userData.current_month !== currentMonthName) {
            // Nouveau mois : Réinitialiser le compteur mensuel
            const updateUserQuery = `
                UPDATE users 
                SET ads_posted_this_month = 1,
                    current_month = $1,
                    ads_count = ads_count + 1
                WHERE id = $2
            `;

            await client.query(updateUserQuery, [currentMonthName, userID]);
        } else {
            // Même mois : Incrémenter les compteurs
            const updateUserQuery = `
                UPDATE users 
                SET ads_posted_this_month = ads_posted_this_month + 1,
                    ads_count = ads_count + 1
                WHERE id = $1
            `;
            await client.query(updateUserQuery, [userID]);
        }

        // 8️⃣ Sauvegarder la localisation (si applicable)
        if (location && location.country && location.city) {
            const locationQuery = `
                INSERT INTO locations (country, city, count)
                VALUES ($1, $2, 1)
                ON CONFLICT (country, city)
                DO UPDATE SET count = locations.count + 1
            `;
            await client.query(locationQuery, [location.country, location.city]);
        }

        // 📢 9️⃣ Envoyer une notification à l'admin
        const adminNotificationQuery = `
            INSERT INTO admin_notifications (
                type,
                title,
                message,
                timestamp,
                is_read,
                link
            ) VALUES (
                $1, $2, $3, $4, $5, $6
            )
        `;

        const notificationValues = [
            'new_post',
            'Nouvelle annonce en attente',
            `Nouvelle annonce en attente de validation: ${postData?.details.title}`,
            new Date(),
            false,
            `/admin/dashboard/posts/${newPostID}`
        ];

        await client.query(adminNotificationQuery, notificationValues);

        // 📧 🔔 🔹 Envoi d'un email à l'admin
        sendEmailToAdmin(postData, newPostID);

        // Commit transaction
        await client.query('COMMIT');

        console.log('Annonce créée avec succès', newPostDbId);
        return true;
    } catch (error) {
        // Rollback transaction in case of error
        await client.query('ROLLBACK');
        console.error("Erreur lors de la création de l'annonce :", error);
        return false;
    } finally {
        // Release client back to pool
        client.release();
    }
};


module.exports = { makePost };