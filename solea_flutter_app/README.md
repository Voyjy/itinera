# Solea Flutter App

Application mobile Flutter pour la plateforme Itinera/Solea avec une expérience de swipe style Tinder pour découvrir des destinations de voyage.

## 🚀 Fonctionnalités

- **Onboarding personnalisé** : Wizard 3 étapes pour définir vos préférences de voyage
- **Swipe Deck** : Interface Tinder-like pour découvrir des destinations
  - Swipe droite = J'aime
  - Swipe gauche = Je passe
  - Swipe haut = Super like
- **Favoris** : Consultez vos destinations sauvegardées
- **Recherche de vols** : Redirection vers Google Flights, Skyscanner, Kayak
- **UI moderne** : Gradients animés, parallaxe, micro-animations

## 📋 Prérequis

- Flutter SDK 3.2.0+
- Android Studio (Hedgehog 2023.1.1+)
- Un émulateur Android ou appareil physique (API 24+)
- Backend Itinera en cours d'exécution

## 🔧 Installation

### 1. Cloner et installer les dépendances

```bash
cd solea_flutter_app
flutter pub get
```

### 2. Configurer l'URL du backend

Éditez `lib/core/constants.dart` :

```dart
// Pour émulateur Android (par défaut)
static const String baseUrl = 'http://10.0.2.2:8080';

// Pour appareil physique sur le même WiFi
static const String baseUrl = 'http://192.168.1.XXX:8080';

// Pour production
static const String baseUrl = 'https://your-api-gateway.com';
```

### 3. Démarrer le backend

```bash
# Depuis la racine du repo
docker-compose up
```

### 4. Lancer l'application

```bash
flutter run
```

## 🌐 Configuration réseau

### Émulateur Android

L'émulateur utilise des IPs spéciales :
- `10.0.2.2` → localhost de la machine hôte
- Port `8080` → API Gateway

### Appareil physique

1. Connectez le téléphone au même WiFi que votre PC
2. Trouvez l'IP de votre PC : `ipconfig` (Windows)
3. Mettez à jour `baseUrl` dans constants.dart
4. Assurez-vous que le firewall autorise le port 8080

### HTTP Cleartext

L'appli est configurée pour autoriser HTTP en développement via :
- `android/app/src/main/res/xml/network_security_config.xml`

## ✈️ Fonction Recherche de Vols

### Mode par défaut (Redirection)

L'app redirige vers des sites de confiance pour la recherche de vols :
- **Google Flights** (principal)
- **Skyscanner** (alternative)
- **Kayak** (alternative)

Aucune API key nécessaire - fonctionne immédiatement !

### Mode API (Optionnel)

Pour afficher les résultats dans l'app :
1. Obtenez une clé API gratuite sur [Amadeus](https://developers.amadeus.com/)
2. Configurez dans `constants.dart` :

```dart
static const String? flightApiKey = 'votre-api-key';
static const String? flightApiSecret = 'votre-secret';
```

## 📁 Structure du projet

```
lib/
├── main.dart                # Point d'entrée
├── app.dart                 # Configuration MaterialApp
├── core/
│   ├── constants.dart       # BASE_URL, storage keys
│   ├── router/              # GoRouter configuration
│   └── theme/               # Colors, typography, theme
├── data/
│   ├── models/              # City, TripCard, UserPrefs
│   ├── remote/              # API client (Dio)
│   ├── local/               # SharedPreferences stores
│   └── repositories/        # Recommendation, Flights
├── features/
│   ├── onboarding/          # Wizard 3 étapes
│   ├── swipe/               # Deck de cartes
│   ├── likes/               # Liste des favoris
│   ├── trip_details/        # Détails destination
│   ├── flights/             # Recherche vols
│   ├── settings/            # Réglages
│   └── shell/               # Bottom navigation
└── widgets/                 # Composants réutilisables
```

## 🔌 Endpoints API utilisés

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/api/cities` | GET | Liste des villes |
| `/api/cities/:id` | GET | Détails d'une ville |
| `/assets/{path}` | GET | Images des villes |

## 🐛 Dépannage

### "Impossible de se connecter"
1. Vérifiez que le backend tourne : `docker-compose ps`
2. Vérifiez BASE_URL dans constants.dart
3. Pour émulateur : utilisez `10.0.2.2`
4. Pour appareil : vérifiez même réseau + IP correcte

### Images qui ne chargent pas
1. Vérifiez que `/assets` retourne des images
2. Vérifiez les URLs dans la réponse API
3. Regardez les logs pour les erreurs réseau

### Erreurs de build
1. `flutter pub get` pour réinstaller les dépendances
2. `flutter clean` puis rebuild
3. Vérifiez que Flutter SDK est à jour : `flutter upgrade`

## 📄 Licence

Projet Itinera/Solea - EPITA
