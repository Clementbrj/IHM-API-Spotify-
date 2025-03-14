<img src="https://foundations.projectpythia.org/_images/GitHub-logo.png" style=justify-content:center;>

<p style="text-align:right;text-decoration:underline;font-size:18px;">AJMC</p>

<p style="text-decoration:underline;font-size:14px;">14/03/2025</p>

# Projet SpotYnov

## Description
SpotYnov API est un service permettant d'étendre les fonctionnalités de l'API Spotify pour la gestion de groupes d'utilisateurs et la synchronisation musicale.

## Installation et lancement
### Prérequis
1. Posséder un compte Spotify.
2. Avoir créé une App sur votre compte Spotify dans votre espace développeur ([spotify developper](https://developer.spotify.com/documentation/web-api/tutorials/getting-started)).
3. [Node.js](https://nodejs.org/) et [npm](https://www.npmjs.com/) (pour le frontend).

### Cloner le projet

    git clone https://github.com/Clementbrj/IHM-API-Spotify-

### Installation des dépendances

    cd frontend
    npm install


### Lancement du serveur & du front
Avoir deux terminaux dans votre IDE

**terminal 1**

    cd backend
    npm start

**terminal 2**

    cd frontend
    npm run dev

### Utiliser les  routes
voici un descriptif des urls possibles

**Spotify**
1. Se connecter pour générer le token  
   [Connexion](http://localhost:3000/spotify/connexion?username=nomUtilisateurJson)  

2. Regarder ses titres likés et ses stats  
   [Voir les titres likés](http://localhost:3000/spotify/ShowLiked?param=nomUtilisateurJson)  

**Avec Postman :**  

3. Créer une playlist  
   [Créer une playlist](http://localhost:3000/spotify/createPlaylist?param=nomUtilisateurJson)  
   → Dans "Authorization", mettre le token Spotify dans `user.json` à l'objet JSON correspondant  

4. Synchroniser la musique jouée par son compte à un compte cible  
   [Synchronisation](http://localhost:3000/spotify/synchro?param=nomUtilisateurJson)  
   → Dans "Authorization", ajouter le token Spotify  


**service**
1. Ajouter un [utilisateur](http://localhost:5173/inscription)  
2. Se [connecter](http://localhost:3000/login)  
3. Récupérer les [utilisateurs](http://localhost:3000/users)  



## Fonctionnalités Principales
✔ fonctionnel

↻ en cours d'implémentation

### FT-1 : Création d'utilisateur ✔
- Inscription d'un utilisateur avec pseudo unique et mot de passe haché (SHA256).

### FT-2 : Connexion ✔
- Authentification de l'utilisateur et génération d'un token.

### FT-3 : Rejoindre un Groupe ✔
- Possibilité de rejoindre ou créer un Groupe.
- Gestion automatique des rôles d'administrateur.
- Possibilité de consulter tous les groupes et le nombre de membres de chaque groupe.

### FT-4 : Liaison du compte Spotify ✔
- Lien entre l'utilisateur et son compte Spotify via OAuth 2.0.

### FT-5 : Consultation des Groupes et Utilisateurs ↻
- Liste des Groupes existants.
- Liste des membres d'un Groupe avec détails sur la lecture en cours (si liaison Spotify).

### FT-6 : Personnalité de l’Utilisateur ✔
- Analyse des morceaux likés pour en déduire des statistiques.

### FT-7 : Synchronisation ↻
- L'administrateur d'un Groupe peut synchroniser la musique sur les appareils actifs des membres.

### FT-8 : Création de playlist ✔
- Génération d'une playlist Spotify basée sur les titres favoris d’un utilisateur du même Groupe.

## API Documentation
L'API est documentée avec  Swagger 

## Persistance des données
- Toutes les données sont stockées dans un fichier **users.json**.
- Les mots de passe sont hachés avec SHA256.

## Documentation swagger
- On peut retrouver toute la documentation de nos API via Sawgger sur le lien suivant :
- http://localhost:3000/api-docs


<div style="display: flex; align-items: center;flex-direction:column; gap: 10   px;">
    <img src="https://octodex.github.com/images/daftpunktocat-thomas.gif" 
         alt="GG" width="400">

<a style="font-size:15px" href="https://octodex.github.com/">Image</a>

