# OpenData API – NestJS

API REST NestJS servant des données **OpenData** (JSON) chargées au démarrage.
Exemples d'usages : musées, bars, aliments, etc.

## 🚀 Fonctionnalités
- Chargement des données OpenData au démarrage (`OPENDATA_URL`).
- Endpoints :
  - `GET /items` : liste (résumé + recherche + favoris).
  - `GET /items/:id` : détail.
  - `PUT /items/:id` : marquer/démarquer en favori (`{ "favorite": true|false }`).
  - `POST /items` : créer un item.
- Tests (Jest). Déploiement CleverCloud.

## 🔗 Jeu de données OpenData
- URL : **à renseigner à l’étape 2**
- Contraintes : JSON, contient `latitude`/`longitude` + `imageUrl` **ou** `type`.

## 🛠️ Démarrage (sera complété)
```bash
npm i
npm run start:dev      # dev local
npm test               # tests
npm run build && npm start
