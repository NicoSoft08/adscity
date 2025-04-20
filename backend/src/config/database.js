const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

// Création d'une instance de Pool pour la connexion à la base de données
const pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT || 5432,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Test de connexion à la base de données
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Erreur de connexion à la base de données :', err);
    } else {
        console.log('Connexion à la base de données réussie !');
    }
});

module.exports = {
    query: (text, params) => pool.query(text, params),
    pool
};
