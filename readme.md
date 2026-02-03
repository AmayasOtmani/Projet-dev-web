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
*   **jsonwebtoken**: `^9.0.3`
*   **sequelize**: `^6.37.7`
*   **sqlite3**: `^5.1.7`


## Architecture du projet

Le projet utilise une architecture qui favorise un couplage faible et le principe de responsabilité unique (Single Responsibility Principle - SRP) afin de garantir la modularité, la maintenabilité et de réduire les erreurs. L'application est structurée en plusieurs répertoires, chacun ayant un rôle spécifique :

*   **controllers**: Ce répertoire contient les contrôleurs qui gèrent la logique de routage et les requêtes HTTP pour chaque entité (par exemple, Auth, Avis, Reservations, Salles, Statistics, Users). Ils interagissent avec les services pour exécuter les opérations métier.
*   **Middleware**: Ce répertoire contient les middlewares Express utilisés pour intercepter et traiter les requêtes HTTP avant qu'elles n'atteignent les gestionnaires de route. Cela inclut l'authentification (`authmw.js`) et la validation (`validationmw.js`).
*   **dal**: (Data Access Layer) Ce répertoire contient les couches d'accès aux données. Il est responsable de l'interaction directe avec la base de données via des modèles Sequelize pour les opérations CRUD.
*   **models**: Ce répertoire définit les modèles Sequelize qui représentent la structure des tables de la base de données et leurs relations.
*   **persistance**: Ce répertoire contient la configuration de la base de données et potentiellement des scripts de migration ou de _seeding_ des données (`db.js`).
*   **queries**: Ce répertoire contient les requêtes spécifiques pour récupérer des données, inspirées du pattern CQRS (Command Query Responsibility Segregation) souvent utilisé dans des architectures comme .NET. Elles sont optimisées pour la lecture des données.
*   ****security**: Ce répertoire gère tous les composants liés à la sécurité de l'application, principalement le hachage des mots de passe avec `bcrypt` et la gestion des tokens (`security.js`).
*   **config**: Ce répertoire contient les fichiers de configuration pour différents environnements ou modules de l'application.

## Schéma relationnel

Voici la description des entités de la base de données, leurs clés primaires et leurs relations (clés étrangères).

*   **User**
    *   **Clé primaire**: `Id` (UUID)
    *   **Champs**: `Nom`, `Prenom`, `Email`, `DateNaissance`, `Password`, `Valid`
    *   **Relations**:
        *   Un utilisateur peut posséder plusieurs `Salle` (relation un-à-plusieurs).
        *   Un utilisateur peut effectuer plusieurs `Reservation` (relation un-à-plusieurs).
        *   Un utilisateur peut avoir plusieurs `Role` (relation plusieurs-à-plusieurs via la table de jonction `UserRoles`).
        *   Un utilisateur peut laisser plusieurs `Commentaire` et `Avis`.

*   **Role**
    *   **Clé primaire**: `Id` (UUID)
    *   **Champs**: `Nom`
    *   **Relations**:
        *   Un rôle peut être assigné à plusieurs `User` (relation plusieurs-à-plusieurs via la table de jonction `UserRoles`).

*   **Salle**
    *   **Clé primaire**: `Id` (UUID)
    *   **Champs**: `Nom`, `Addresse`, `Description`, `Capacite`, `Prix`, `Longitude`, `Latitude`
    *   **Clé étrangère**: `UserId` (référence `User.Id`)
    *   **Relations**:
        *   Une salle appartient à un `User`.
        *   Une salle peut avoir plusieurs `Reservation`, `Commentaire`, et `Avis`.

*   **Reservation**
    *   **Clé primaire**: `Id` (UUID)
    *   **Champs**: `DateHeureDebut`, `DateHeureFin`
    *   **Clés étrangères**: `UserId` (référence `User.Id`), `SalleId` (référence `Salle.Id`)
    *   **Relations**:
        *   Une réservation est effectuée par un `User` pour une `Salle`.

*   **Commentaire**
    *   **Clé primaire**: `Id` (UUID)
    *   **Champs**: `Text`
    *   **Clés étrangères**: `UserId` (référence `User.Id`), `SalleId` (référence `Salle.Id`)
    *   **Relations**:
        *   Un commentaire est laissé par un `User` sur une `Salle`.

*   **Avis**
    *   **Clé primaire**: `Id` (UUID)
    *   **Champs**: `Note`
    *   **Clés étrangères**: `UserId` (référence `User.Id`), `SalleId` (référence `Salle.Id`)
    *   **Relations**:
        *   Un avis est donné par un `User` pour une `Salle`.

*   **UserRoles** (Table de jonction)
    *   **Champs**: `UserId`, `RoleId`
    *   **Description**: Table intermédiaire pour la relation plusieurs-à-plusieurs entre `User` et `Role`.
