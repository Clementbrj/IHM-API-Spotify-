![GitLab](https://www.troispointzero.fr/content/uploads/2020/02/gitlab-logo.png "GitLab test")
<p style="text-align:right;text-decoration:underline;font-size:18px;">clementbrj</p>

<p style="text-decoration:underline;font-size:14px;">Seance du 14/03</p>
# Projet SpotYnov
    Cette équipe est composé de : 
    * Jérôme Gavino
    * Alexandre Pham
    * Mehdy Bouzid
    * Clément Barjolle

## Contexte

### Objectifs

### Manuel d'utilisation

**spotify**
    
    1. Se connecter avec pour générer le token
        http://localhost:3000/spotify/connexion?username=nomUtilisateurJson
    2. Regarder ces titres likés et ces stats
        http://localhost:3000/spotify/ShowLiked?param=nomUtilisateurJson

Avec Postman

    3. Créer une playlist
        http://localhost:3000/spotify/createPlaylist?param=nomUtilisateurJson
        dans "authorization" mettre le tokenspotify dans user.json à l'objet json correspondant  

    4. Synchroniser la musique jouer par son compte à un compte cible
        http://localhost:3000/spotify/synchro?param=nomUtilisateurJson
        dans "authorization" ..

---
**service**

    explication 1

blabla

    explication 2

---

<div style="display: flex; align-items: center;flex-direction:column; gap: 10   px;">
    <img src="https://st2.depositphotos.com/1001911/7684/v/450/depositphotos_76840867-stock-illustration-pointing-at-himself-emoticon.jpg" 
         alt="GG" width="400">