# Titre du Projet

Projet Web Dev

## Description

Ce projet est une application web construite avec Node.js et Express. Il utilise une base de donnée pour gérer la persistance des données avec Squelize

## Pour commencer

### Prérequis

*   Node.js et npm installés sur votre machine. Vous pouvez les télécharger depuis [https://nodejs.org/](https://nodejs.org/)

### Installation

1.  Cloner le dépôt
    ```sh
    git clone https://example.com/your-repo.git
    ```
2.  Installer les paquets NPM
    ```sh
    npm install
    ```

## Utilisation

Pour démarrer le serveur, exécutez la commande suivante :

```sh
node index.js
```

## Dépendances

*   **@sequelize/mysql**: `^7.0.0-alpha.47`
*   **bcrypt**: `^6.0.0`
*   **cookie-parser**: `^1.4.7`
*   **cors**: `^2.8.6`
*   **dotenv**: `^17.2.3`
*   **express**: `^5.2.1`

## Architecture du projet
    Le projet utilise une architecture qui favorise le couplage bas et le principe du single responsibility afin de garantir la modularité et de réduire les erreurs
    il est alors divisé en plusieur dossiers :
    * ** controllers ** : ce dossier contient les routeurs pour chaque entité
    * ** Middleware ** : ce dossier contient les middleware utilisés a l'intérieur des handleur de route
    * **persistance** : ce dossier contient la définition des schéma de notre base de données et les données seed
    * **queries** : ce dossier contient des queries (inspiré du pattern CQRS utilisé en .NET)
    * **security** : ce dossier contient tout les composants relatifs a la sécurité de l'application (principalement et actuellement limité au hashage des mots de passe avec bcrypt)
*   **jsonwebtoken**: `^9.0.3`
*   **sequelize**: `^6.37.7`
*   **sqlite3**: `^5.1.7`
