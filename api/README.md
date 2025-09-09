# 📌 AdsCity – Backend API

## 🚀 Description
Ce backend alimente la plateforme **AdsCity** (site de petites annonces et boutiques en ligne).  
Il est basé sur **Node.js + Express**, avec **Prisma ORM** et **PostgreSQL** pour la gestion des données.  

Fonctionnalités principales :
- Gestion des utilisateurs (particuliers & pros)
- Authentification sécurisée (JWT + cookies HttpOnly, refresh token)
- Gestion des annonces
- Gestion des boutiques
- Système de messagerie entre utilisateurs
- Notifications (push et en base de données)
- Dashboard & administration

---

## 📂 Structure du projet

```
api/
│── prisma/             # Schéma Prisma (User, Shop, Ad, Message, Notification)
│── src/
│   ├── config/         # Variables d'environnement, Prisma client, cookies/JWT
│   ├── middlewares/    # Middlewares (auth, validation, erreurs, rate limiting)
│   ├── validators/     # Validation des inputs (Zod schemas)
│   ├── controllers/    # Logique métier (auth, users, ads, shops, messages, notif)
│   ├── routes/         # Routes Express
│   ├── services/       # Services (emails, notifications, paiement, etc.)
│   ├── utils/          # Fonctions utilitaires
│   ├── app.js          # Initialisation Express
│   └── server.js       # Point d’entrée
│── .env                # Variables d'environnement
│── package.json
│── README.md
```

---

## ⚙️ Installation

### 1. Cloner le projet
```bash
git clone https://github.com/tonrepo/adscity-backend.git
cd adscity-backend/api
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Configurer l’environnement
Créer un fichier `.env` à la racine :
```env
DATABASE_URL="postgresql://user:password@localhost:5432/adscity"
JWT_SECRET="super_secret_key"
REFRESH_TOKEN_SECRET="another_secret_key"
COOKIE_DOMAIN=".adscity.net"
PORT=5000
```

### 4. Générer Prisma & migrer la base
```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 5. Lancer le serveur
```bash
npm run dev
```

---

## 🔑 Authentification

- **JWT double token** :  
  - `accessToken` (15 min) → HttpOnly cookie `access_token`
  - `refreshToken` (7 jours) → HttpOnly cookie `refresh_token`
- Sécurisé contre **XSS** et **CSRF**
- Middleware `authMiddleware` pour protéger les routes privées

---

## 📌 Endpoints principaux

### Authentification
- `POST /api/auth/signup` → inscription utilisateur
- `POST /api/auth/signin` → connexion utilisateur
- `POST /api/auth/signout` → déconnexion
- `POST /api/auth/refresh` → régénérer un access token

### Utilisateurs
- `GET /api/users/me` → profil de l’utilisateur connecté
- `PUT /api/users/me` → mise à jour du profil
- `DELETE /api/users/me` → suppression du compte

### Boutiques
- `POST /api/shops` → création boutique (Pro)
- `GET /api/shops/:id` → infos boutique
- `PUT /api/shops/:id` → mise à jour boutique
- `DELETE /api/shops/:id` → suppression boutique

### Annonces
- `POST /api/ads` → créer une annonce
- `GET /api/ads` → lister toutes les annonces
- `GET /api/ads/:id` → détail d’une annonce
- `PUT /api/ads/:id` → modifier une annonce
- `DELETE /api/ads/:id` → supprimer une annonce

### Messagerie
- `POST /api/messages` → envoyer un message
- `GET /api/messages/:conversationId` → récupérer messages

### Notifications
- `GET /api/notifications` → notifications de l’utilisateur
- `PUT /api/notifications/:id/read` → marquer comme lue

### Ticket de Support
- `POST /api/support/tickets`  → créer un ticket (user)
- `GET /api/support/tickets`  → lister les tickets (user: ses tickets; admin: tous les tickets) - pagination, filtres (status, category, priority, q)
- `GET /api/support/tickets/:id`  → récupérer ticket + messages + attachments (ownership check)
- `POST /api/support/tickets/:id/messages`  → ajouter un message / réponse (user ou support)
- `POST /api/support/tickets/:id/close`  → fermer ticket (user ou support selon policy)
- `POST /api/support/tickets/:id/close`  → fermer ticket (user ou support selon policy)
- `PATCH /api/support/tickets/:id`  → mettre à jour status/priority (admin/support)
- `DELETE /api/support/tickets/:id`  → supprimer (admin)
- `GET /api/support/stats`  → (admin) métriques
- `GET /api/support/categories`  → (admin) liste de catégories

---

## 🛠️ Technologies utilisées
- **Node.js** + **Express**
- **Prisma ORM** + **PostgreSQL**
- **Zod** (validation des inputs)
- **JWT** + **Cookies HttpOnly**
- **Socket.io** (messagerie temps réel)
- **Nodemailer** (emails)
- **Winston** (logging)

---

## 📊 Roadmap Backend
- [x] Authentification sécurisée
- [x] Gestion utilisateurs
- [x] Annonces
- [x] Boutiques
- [x] Messagerie
- [ ] Paiements (AdsCity Pay)
- [ ] Notifications push web & mobile
- [ ] Dashboard admin avec statistiques temps réel
