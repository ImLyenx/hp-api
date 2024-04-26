# PARTIE IOT:

## Explications du fonctionnement:

### 1. Partie serveur:

Quand un utilisateur connecté au site clique sur une carte sur la page `/cards`, une requête est envoyée au serveur. Cette requête contient la maison qui correspond à la carte cliquée. Les données de l'utilisateur sont mises a jour dans la base de données pour contenir la dernière "maison visitée" (la maison de la dernière carte inspectée).

### 2. Partie Raspberry Pi:

Le raspberry se connecte au réseau (la LED clignote en rouge pendant la connexion), puis invite l'utilisateur à se connecter à son compte (email + password).

Ces deux parties sont ensuite exécutées en boucle dans un `while True:`:

- On récupère le JWT renvoyé et on l'utilise pour faire une requête à l'endpoint `/api/latesthouse` pour récupérer la dernière maison visitée par l'utilisateur.
- On récupère la couleur de la maison avec un dictionnaire, puis on affiche la couleur sur la LED avec la fonction `setColor()`.

---

Un compte "test" peut être utilisé pour tester cette fonctionnalité sur le site:

- URL: [https://hp.lyenx.com](https://hp.lyenx.com)
- E-mail: `test@test.test1`
- Mot de passe: `test`
