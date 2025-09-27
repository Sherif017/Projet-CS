<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>

---

# OpenData API – NestJS

API REST NestJS servant des données **OpenData** (JSON) chargées au démarrage.  
Exemples d'usages : musées, bars, établissements scolaires, etc.

---

## 🚀 Fonctionnalités
- Chargement des données OpenData au démarrage (`OPENDATA_URL`).
- Endpoints :
  - `GET /items` : liste (résumé + recherche + favoris).
  - `GET /items/:id` : détail.
  - `PUT /items/:id` : marquer/démarquer en favori (`{ "favorite": true|false }`).
  - `POST /items` : créer un item.
- Tests (Jest). Déploiement CleverCloud.

---

## 🔗 Jeu de données OpenData
- URL utilisée :  
  [Établissements scolaires – Ministère Éducation Nationale](https://data.education.gouv.fr/api/explore/v2.1/catalog/datasets/fr-en-adresse-et-geolocalisation-etablissements-premier-et-second-degre/records?limit=20)  
- Contraintes : JSON, contient `latitude`/`longitude` + `imageUrl` **ou** `type` (`type_etablissement` / `secteur`).

---

## 🛠️ Démarrage
```bash
# Installer les dépendances
npm install

# Lancer en mode développement (watch)
npm run start:dev

# Lancer en mode production
npm run build && npm start

# Exécuter les tests
npm test
